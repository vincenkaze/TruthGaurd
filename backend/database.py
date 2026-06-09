import os
import logging
import bcrypt
from uuid import uuid4
from backend.models import FeedbackInput, UserCreate, NewsItem
from dotenv import load_dotenv
from supabase import create_client, Client
from .utils import hash_password

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Get Supabase URL and Key from .env file
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Validate environment variables
logger.info(f"Supabase URL is set: {'Yes' if SUPABASE_URL else 'No'}")
logger.info(f"Supabase Key is set: {'Yes' if SUPABASE_KEY else 'No'}")

# Create Supabase client
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    logger.info("Supabase client created successfully")
except Exception as e:
    logger.error(f"Failed to create Supabase client: {e}")
    raise

# Function to create the 'news' table if it doesn't exist
def create_user(user: UserCreate):
    try:
        exists = supabase.table("users").select("*").eq("email", user.email).execute()
        if exists.data:
            return {"error": "Email is already registered."}

        hashed = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()

        response = supabase.table("users").insert({
            "name": user.name,
            "email": user.email,
            "password": hashed
        }).execute()

        if response.data is not None:
            logger.info("User created successfully")
            return {"message": "User created"}
        else:
            error_msg = response.model_dump().get("error")
            logger.error(f"Supabase insert error: {error_msg}")
            return {"error": str(error_msg)}

    except Exception as e:
        logger.error(f"Exception in create_user: {e}")
        return {"error": str(e)}

# Function to store news
def store_news(news: NewsItem):
    """Store a news item in the Supabase database."""
    try:
        data = {
            "title": news.title,
            "link": news.link,
            "description": news.description
        }
        response = supabase.table("news").insert(data).execute()
        if response.status_code == 201:
            logger.info(f"Stored news: {news.title}")
            return {"message": "News stored successfully!"}
        elif response.status_code == 409:  # Conflict (duplicate entry)
            logger.warning(f"Duplicate news: {news.title}")
            return {"message": "News already exists."}
        else:
            logger.error(f"Failed to store news: {response}")
            return {"error": "Failed to store news"}
    except Exception as e:
        logger.error(f"Failed to store news: {e}")
        return {"error": f"Failed to store news: {e}"}

# Function to fetch stored news from Supabase with pagination
def get_news(limit: int = 10, offset: int = 0):
    """Fetch stored news from Supabase database with pagination."""
    try:
        response = supabase.table("news").select("*").range(offset, offset + limit - 1).execute()
        if response.status_code == 200:
            logger.info(f"Fetched {len(response.data)} news items from Supabase.")
            return response.data
        else:
            logger.error(f"Failed to fetch news: {response}")
            return {"error": "Failed to fetch news"}
    except Exception as e:
        logger.error(f"Failed to fetch news: {e}")
        return {"error": f"Failed to fetch news: {e}"}

def verify_user(email: str, password: str):
    try:
        response = supabase.table("users").select("*").eq("email", email).execute()
        users = response.data or []

        if not users:
            return None, "User does not exist"

        user = users[0]  # take the first match

        if bcrypt.checkpw(password.encode(), user["password"].encode()):
            return user, None
        else:
            return None, "Invalid password"

    except Exception as e:
        return None, str(e)
    
def store_analysis(prediction_id: str, text: str, prediction: str, confidence: float):
    """Insert the analysis result into the analysis table."""
    try:
        data = {
            "analysis_id": prediction_id,
            "text": text,
            "prediction": prediction,
            "confidence": confidence
        }

        response = supabase.table("analysis").insert(data).execute()

        if response.data:
            logger.info("Analysis stored successfully")
            return {"message": "Analysis stored"}
        else:
            logger.error(f"Supabase error: {response}")
            return {"error": "Failed to store analysis"}
    except Exception as e:
        logger.error(f"Exception in store_analysis: {e}")
        return {"error": str(e)}
    
def store_feedback(feedback: FeedbackInput, email: str):
    try:
        logger.info(f"Received feedback: {feedback.model_dump()}, email: {email}")

        analysis_check = supabase.table("analysis").select("*").eq("analysis_id", feedback.analysis_id).execute()
        if not analysis_check.data:
            logger.error("Analysis not found")
            return {"error": "Analysis not found"}

        user_query = supabase.table("users").select("id").eq("email", email).single().execute()
        if not user_query.data:
            logger.error("User not found")
            return {"error": "User not found"}
        user_id = user_query.data["id"]

        if not (1 <= feedback.rating <= 5):
            logger.error("Rating out of range")
            return {"error": "Rating must be between 1 and 5"}

        insert_data = {
            "user_id": user_id,
            "analysis_id": feedback.analysis_id,
            "rating": feedback.rating
        }

        response = supabase.table("feedback").insert(insert_data).execute()
        if response.data is None:
            logger.error(f"Insert failed: {response.model_dump().get('error')}")
            return {"error": f"Failed: {response.model_dump().get('error')}"}
        else:
            logger.info("Feedback stored successfully")
            return {"message": "Feedback stored"}

    except Exception as e:
        logger.error(f"store_feedback error: {e}")
        return {"error": str(e)}