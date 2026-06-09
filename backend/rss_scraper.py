import feedparser
import os
import time
import logging
import validators
import requests
from dotenv import load_dotenv
from backend.database import store_news, NewsItem

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
RSS_FEEDS = os.getenv("RSS_FEEDS", "").split(",")

def fetch_rss_news():
    """Fetch news from RSS feeds and store them in the database."""
    if not RSS_FEEDS or not RSS_FEEDS[0]:
        logger.error("No RSS feeds configured. Please check your .env file.")
        return

    for feed_url in RSS_FEEDS:
        if not validators.url(feed_url):
            logger.error(f"Invalid RSS feed URL: {feed_url}")
            continue
        try:
            logger.info(f"Fetching news from RSS feed: {feed_url}")
            response = requests.get(feed_url, timeout=10)  # 10-second timeout
            feed = feedparser.parse(response.content)
            
            for entry in feed.entries[:5]:  # Limit to 5 articles per source
                try:
                    news = NewsItem(
                        title=entry.title,
                        link=entry.link,
                        description=entry.get("description", "No description available")
                    )
                    store_news(news)
                except Exception as e:
                    logger.error(f"Failed to process entry: {entry.title}. Error: {e}")
            
            time.sleep(5)  # Add a 5-second delay between feeds
        except Exception as e:
            logger.error(f"Failed to fetch RSS feed: {feed_url}. Error: {e}")

if __name__ == "__main__":
    fetch_rss_news()  # Run manually if needed