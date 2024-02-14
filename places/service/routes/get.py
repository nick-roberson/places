""" Simple FastAPI service

To run this do the following:
    > export LOG_VERBOSE="1" && poetry run uvicorn service:app --reload

Then open your browser and go to:
    > http://localhost:8000/get/all
"""

# Standard Library
import os
import logging

# Third Party
from fastapi import APIRouter, Response
from typing import List, Optional

# Places Code
from places.manager import get_manager
from places.models import Place, APIKey

# Constants
manager = get_manager()
router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/")
def read_root() -> Response:
    content = {
        "message": "Welcome to Nick's restaurant service!",
    }
    return Response(status_code=200, content=content)


@router.get("/all")
def get_all() -> List[Place]:
    """Get all restaurants."""
    logging.info("Getting all")
    return manager.get_all()


@router.get("/get/{name}")
def get_one(name: str, exact: bool = False) -> Optional[Place]:
    """Get one restaurant by name

    Args:
        name (str): Name of the restaurant to get
        exact (bool, optional): Exact match for name. Defaults to False.
    """
    logger.info(f"Getting {name}")
    return manager.get(name=name, exact=exact)


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

    logger.info(f"Searching for {name} at {address} with min rating {min_rating}")
    return manager.search(
        name=name, address=address, min_rating=min_rating, exact=exact
    )


@router.get("/keys/google")
def get_google_api_key() -> APIKey:
    """Get the Google api key."""
    return APIKey(key=os.environ.get("GOOGLE_API_KEY"))
