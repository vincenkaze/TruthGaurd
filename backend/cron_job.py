import time
import threading
import logging
import datetime
import atexit
import os
from dotenv import load_dotenv
from backend.rss_scraper import fetch_rss_news

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Get fetch interval from .env file (default: 600 seconds)
FETCH_INTERVAL = int(os.getenv("FETCH_INTERVAL", 600))

# Track the last fetch time
LAST_FETCH_TIME = None

def fetch_news_background():
    """Automatically fetch RSS news at a configurable interval."""
    global LAST_FETCH_TIME
    while True:
        try:
            logger.info("Fetching RSS news...")
            fetch_rss_news()
            LAST_FETCH_TIME = datetime.datetime.now()
        except Exception as e:
            logger.error(f"Failed to fetch RSS news: {e}")
        time.sleep(FETCH_INTERVAL)

def health_check():
    """Check if the background job is running as expected."""
    if LAST_FETCH_TIME is None:
        return {"status": "unknown", "message": "Background job has not started yet."}
    time_since_last_fetch = (datetime.datetime.now() - LAST_FETCH_TIME).total_seconds()
    if time_since_last_fetch > FETCH_INTERVAL * 2:  # Allow some buffer
        return {"status": "unhealthy", "message": f"Last fetch was {time_since_last_fetch} seconds ago."}
    return {"status": "healthy", "message": f"Last fetch was {time_since_last_fetch} seconds ago."}

def stop_background_job():
    """Stop the background job gracefully."""
    logger.info("Stopping background job...")
    # Add cleanup logic if needed

# Register the shutdown hook
atexit.register(stop_background_job)

# Start background job
threading.Thread(target=fetch_news_background, daemon=True).start()