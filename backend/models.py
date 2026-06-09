import os
import joblib
from backend.utils import clean_text
from pydantic import BaseModel, EmailStr

# Load model
MODEL_PATH = "backend/fake_news_model.pkl"
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")

model = joblib.load(MODEL_PATH)

def predict_fake_news(text: str):
    """Predict if a news article is Fake or Real."""
    if not text.strip():
        return {"error": "No text provided"}

    text = clean_text(text)  # Clean before prediction
    prediction = model.predict([text])[0]

    confidence = None
    if hasattr(model, "predict_proba"):
        confidence = model.predict_proba([text])[0][prediction]

    return {
        "prediction": "FAKE" if prediction == 1 else "REAL",
        "confidence": round(confidence, 4) if confidence else "N/A"
    }

# Test Example
if __name__ == "__main__":
    print(predict_fake_news("Breaking: AI is taking over the world!"))


class NewsItem(BaseModel):
    title: str
    link: str
    description: str

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr

class TokenWithUser(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class FeedbackInput(BaseModel):
    analysis_id: str  # Use snake_case and str (UUID)
    rating: int
    timestamp: str | None = None

class NewsText(BaseModel):
    text: str

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str