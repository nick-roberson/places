import json
from typing import Dict, List, Union

import redis

from constants import REDIS_DB, REDIS_HOST, REDIS_PORT, REDIS_TTL_SECONDS
from places.service.places.models import Place

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

    # Basic String Operations
    def get(self, key: str) -> Union[str, None]:
        """Get value from cache."""
        if not self.client.exists(key):
            return None
        return self.client.get(key)

    def set(self, key: str, value) -> bool:
        """Set key to value in cache."""
        return self.client.set(key, value, ex=REDIS_TTL_SECONDS)

    # Set Place Operations
    def get_place(self, key: str) -> Union[Place, None]:
        """Get full dictionary from hash."""
        # If key does not exist, return None
        if not self.client.exists(key):
            return None

        # Get all fields and values from hash, convert to values
        encoded = self.client.get(key)
        decoded = json.loads(encoded)
        return Place(**decoded)

    def set_place(self, key: str, place: Place):
        """Set field to value in hash."""
        # Remove the _id field if it exists, product of using MongoDB
        place_dict = place.dict()
        place_dict.pop("_id", None)

        # Convert all values to strings
        place_dict_str = json.dumps(place_dict)
        return self.client.set(key, place_dict_str)

    # Get / Set Place(s) Operations
    def get_places(self, key: str) -> Union[List[Place], None]:
        """Get full dictionary from hash."""
        # If key does not exist, return None
        if not self.client.exists(key):
            return None

        # Get all fields and values from hash, convert to values
        encoded = self.client.get(key)
        decoded = json.loads(encoded)
        return [Place(**place) for place in decoded]

    def set_places(self, key: str, places: List[Place]):
        """Set field to value in hash."""
        # Remove the _id field if it exists, product of using MongoDB
        places_dict = [place.dict() for place in places]
        for place in places_dict:
            place.pop("_id", None)

        # Convert all values to strings
        places_dict_str = json.dumps(places_dict)
        return self.client.set(key, places_dict_str)

    # Basic Delete and Keys Operations
    def delete(self, key: str):
        """Remove key from cache."""
        if not self.client.exists(key):
            return None
        return self.client.delete(key)

    def keys(self, pattern: str = "*"):
        """Get all keys matching pattern."""
        all_keys = self.client.keys(pattern)
        return [key.decode("utf-8") for key in all_keys]
