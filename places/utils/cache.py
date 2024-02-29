# Third Party
import redis

# Places Code
from constants import REDIS_HOST, REDIS_PORT, REDIS_DB, REDIS_TTL_SECONDS

# Global Redis Client
redis_client = None
places_cache = None


def get_redis_client():
    """Get a global redis client."""
    global redis_client
    if redis_client is None:
        redis_client = redis.StrictRedis(
            host=REDIS_HOST,
            port=REDIS_PORT,
            db=REDIS_DB,
            decode_responses=True,
        )
    return redis_client


def get_places_cache():
    """Get a global cache."""
    global places_cache
    if places_cache is None:
        places_cache = Cache()
    return places_cache


class Cache:
    client = None

    def __init__(self):
        """Initialize the cache."""
        self.client = get_redis_client()

    def get(self, key: str):
        """Get value from cache."""
        if not self.client.exists(key):
            return None
        return self.client.get(key)

    def set(self, key: str, value):
        """Set key to value in cache."""
        return self.client.set(key, REDIS_TTL_SECONDS, value)

    def delete(self, key: str):
        """Remove key from cache."""
        if not self.client.exists(key):
            return None
        return self.client.delete(key)

    def keys(self, pattern: str = "*"):
        """Get all keys matching pattern."""
        all_keys = self.client.keys(pattern)
        return [key.decode("utf-8") for key in all_keys]
