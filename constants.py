import os

# REDIS Constants
REDIS_TTL_SECONDS: int = 60 * 60 * 24
REDIS_HOST: str = "localhost"
REDIS_PORT: int = 6379
REDIS_DB: int = 0

# MongoDB Constants
MONGO_URI: str = os.environ.get("MONGO_URI")

# Google API Key
GOOGLE_API_KEY: str = os.environ.get("GOOGLE_API_KEY")
