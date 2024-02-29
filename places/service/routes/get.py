""" Simple FastAPI service

To run this do the following:
    > export LOG_VERBOSE="1" && poetry run uvicorn service:app --reload

Then open your browser and go to:
    > http://localhost:8000/get/all
"""

# Standard Library
import logging

# Third Party
from fastapi import APIRouter
from typing import List, Optional

# Places Code
from places.manager import get_manager
from places.models import Place, APIKey
from places.cache.cache import get_places_cache
from constants import GOOGLE_API_KEY

places_cache = get_places_cache()
manager = get_manager()
router = APIRouter()

logger = logging.getLogger(__name__)


@router.get("/all")
def get_all(force: bool = True) -> List[Place]:
    """Get all restaurants. Only use force if you want to bypass the cache."""
    # If force is not set then check the cache
    if not force:
        cached_entry = places_cache.get_places("all")
        if cached_entry:
            logger.info(f"Getting all places from cache")
            return cached_entry

    # If not in cache then get from manager directly
    logger.info(f"Getting all places from DB")
    all_places = manager.get_all()

    # Update the cache as we go then
    if all_places:
        logger.info(f"Updating all places in cache")
        places_cache.set_places("all", all_places)

    # Return
    return all_places


@router.get("/get")
def get_one(name: str, exact: bool = False) -> Optional[Place]:
    """Get one restaurant by name

    Args:
        name (str): Name of the restaurant to get
        exact (bool, optional): Exact match for name. Defaults to False.
    """
    # First check the cache
    cached_entry = places_cache.get_place(name)
    if cached_entry:
        logger.info(f"Getting {name} from cache")
        return cached_entry

    # If not in cache then get from manager
    logger.info(f"Getting {name} from DB")
    entry = manager.get(name=name, exact=exact)

    # Add to cache
    if entry:
        logger.info(f"Updating {name} in cache")
        places_cache.set_place(name, entry)

    # Return
    return entry


@router.get("/search")
def search(
    name: Optional[str] = None,
    address: Optional[str] = None,
    min_rating: Optional[float] = None,
    exact: bool = False,
) -> List[Place]:
    """Search for a restaurant by name.

    Args:
        name (str, optional): Name of the restaurant to lookup. Defaults to None.
        address (str, optional): Address of the restaurant to lookup. Defaults to None.
        min_rating (float, optional): Minimum rating for the restaurant. Defaults to None.
        exact (bool, optional): Exact match for name. Defaults to False.
    """
    if not name and not address and not min_rating:
        logger.error("Please provide a name or address or min_rating")
        return []

    # Check the cache, using a dict to store the search parameters and hashing it as the key
    search_params = {"name": name, "address": address, "min_rating": min_rating}
    search_key = hash(str(search_params))
    cached_entry = places_cache.get_places(search_key)
    if cached_entry:
        logger.info(f"Getting search results from cache")
        return cached_entry

    # If not in cache then get from manager
    logger.info(f"Searching for {name} at {address} with min rating {min_rating}")
    results = manager.search(
        name=name, address=address, min_rating=min_rating, exact=exact
    )

    # Add to cache
    if results:
        logger.info(f"Updating search results in cache")
        places_cache.set_places(search_key, results)

    # Return
    return results


@router.get("/keys/google")
def get_google_api_key() -> APIKey:
    """Get the Google api key."""
    return APIKey(key=GOOGLE_API_KEY)
