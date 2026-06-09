import os
import json
import logging
from typing import List
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class Config:
    def __init__(self, config_file: str = "config.json"):
        # Load configuration from file
        with open(config_file, "r") as f:
            config = json.load(f)

        # Supabase credentials
        self.SUPABASE_URL: str = config["supabase"]["url"]
        self.SUPABASE_KEY: str = config["supabase"]["key"]
        if not self.SUPABASE_URL or not self.SUPABASE_KEY:
            raise ValueError("Supabase URL and Key must be set in the config file.")

        # RSS Feed Sources
        self.RSS_FEEDS: List[str] = config["rss_feeds"]
        if not self.RSS_FEEDS or not self.RSS_FEEDS[0]:
            raise ValueError("At least one RSS feed must be set in the config file.")

        # Model Path
        self.MODEL_PATH: str = config["model_path"]
        if not os.path.exists(self.MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {self.MODEL_PATH}")

# Instantiate the configuration
config = Config()