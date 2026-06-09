from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Request, BackgroundTasks
from jose import jwt, JWTError, ExpiredSignatureError
from datetime import datetime, timedelta, timezone
from pydantic import EmailStr
import logging
import bcrypt
import re

from backend.models import predict_fake_news,FeedbackInput, NewsText, UserCreate, TokenWithUser, PasswordResetRequest, PasswordResetConfirm
from backend.database import get_news, create_user, verify_user, store_feedback, store_analysis, FeedbackInput
from backend.email_utils import send_reset_email
from backend.rss_scraper import fetch_rss_news
from backend.database import supabase
from uuid import uuid4

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Fake News Detection API",
    description="An API to detect fake news using machine learning.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_password_reset_token(email: str, expires_delta: timedelta = None):
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode = {"sub": email, "exp": expire, "scope": "password_reset"}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_password_reset_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("scope") != "password_reset":
            raise HTTPException(status_code=400, detail="Invalid reset token")
        return payload.get("sub")  # returns email
    except ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Reset token expired")
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid reset token")

def validate_password_strength(password: str):
    if len(password) < 12:
        raise HTTPException(status_code=400, detail="Password must be at least 12 characters long.")
    if not re.search(r"[a-z]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least one lowercase letter.")
    if not re.search(r"[A-Z]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter.")
    if not re.search(r"[0-9]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least one number.")

@app.get("/")
def home():
    return {"message": "Fake News Detection API is Running!"}

@app.get("/news")
def fetch_news():
    try:
        return {"news": get_news()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/fetch_rss")
def fetch_rss():
    try:
        fetch_rss_news()
        return {"message": "RSS fetching triggered!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict")
def predict(data: NewsText):
    """Predict whether a given news article is FAKE or REAL."""
    try:
        prediction_id = str(uuid4())
        result = predict_fake_news(data.text)

        # Store the analysis result in the database
        store_analysis(
            prediction_id=prediction_id,
            text=data.text,
            prediction=result["prediction"],
            confidence=result["confidence"]
        )

        return {
            "predictionId": prediction_id,
            "prediction": result["prediction"],
            "confidence": result["confidence"]
        }

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    
@app.post("/auth/register", response_model=TokenWithUser)
def register(user: UserCreate):
    try:
        
        validate_password_strength(user.password)

        existing_user = supabase.table("users").select("*").eq("email", user.email).execute()
        if existing_user.data:
            raise HTTPException(status_code=400, detail="Email is already registered.")

        result = create_user(user)
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

        # Fetch the newly created user to get the DB id
        user_row = supabase.table("users").select("id, name, email").eq("email", user.email).single().execute()
        if not user_row.data:
            raise HTTPException(status_code=500, detail="User creation failed (no user row)")

        token = create_access_token({"sub": user.email})
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": str(user_row.data["id"]),
                "name": user_row.data["name"],
                "email": user_row.data["email"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration failed: {e}")
        raise HTTPException(status_code=500, detail="Registration failed")

@app.post("/auth/login", response_model=TokenWithUser)
def login_user(form_data: OAuth2PasswordRequestForm = Depends()):
    user, error = verify_user(form_data.username, form_data.password)

    if error == "User does not exist":
        raise HTTPException(status_code=404, detail="User does not exist")
    elif error == "Invalid password":
        raise HTTPException(status_code=401, detail="Invalid password")
    elif error:  # unexpected db errors
        raise HTTPException(status_code=400, detail=error)

    access_token = create_access_token(data={"sub": user["email"]})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["id"]),
            "name": user["name"],
            "email": user["email"]
        }
    }

@app.post("/feedback")
def receive_feedback(feedback: FeedbackInput, request: Request):
    token = request.headers.get("authorization", "").replace("Bearer ", "")
    logger.info(f"Received token: {token}")
    if not token:
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        logger.info(f"Decoded payload: {payload}")
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        result = store_feedback(feedback, email)
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return result

    except ExpiredSignatureError:
        logger.error("Token expired")
        raise HTTPException(status_code=401, detail="Token expired")

    except JWTError as e:
        logger.error(f"JWT error: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")
    
@app.post("/auth/reset-password")
def reset_password(data: PasswordResetConfirm):
    email = verify_password_reset_token(data.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid reset token")

    # hash new password
    hashed = bcrypt.hashpw(data.new_password.encode(), bcrypt.gensalt()).decode()

    # update Supabase users table
    result = supabase.table("users").update({"password": hashed}).eq("email", email).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Password update failed")

    return {"message": "Password reset successful"}

@app.post("/auth/request-password-reset")
async def request_password_reset(data: PasswordResetRequest):
    try:
        logger.info(f" Request received for password reset: {data.email}")

        user = supabase.table("users").select("id, email").eq("email", data.email).execute()
        if not user.data:
            logger.info(f"No user found with email {data.email}, returning generic response")
            return {"message": "If that email exists, a reset link has been sent."}

        token = create_password_reset_token(data.email, expires_delta=timedelta(minutes=15))
        logger.info(f" Generated reset token for {data.email}: {token}")

        await send_reset_email(data.email, token)

        return {"message": "Reset email sent (debug mode)."}
    except Exception as e:
        logger.error(f" Error in /auth/request-password-reset: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

