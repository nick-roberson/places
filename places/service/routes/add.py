""" Simple FastAPI service

To run this do the following:
    > export LOG_VERBOSE="1" && poetry run uvicorn service:app --reload

Then open your browser and go to:
    > http://localhost:8000/get/all
"""

import os
import logging
import uvicorn

from fastapi import APIRouter
from fastapi import HTTPException
from typing import List, Optional, Dict

from places.manager import RestaurantManager
from places.models import Place, APIKey, PlaceInsertModel
from places.google import get_restaurant_info

# Constants
manager = None
router = APIRouter()
logger = logging.getLogger(__name__)


def configure_logging():
    level = logging.DEBUG if os.environ.get("LOG_VERBOSE") is None else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )


@app.post("/add")
def add(
    name: str,
    location: str,
) -> Place:
    """Add a restaurant to the database.

    Args:
        name (str): Name of the restaurant
        location (str): Address of the restaurant
    """
    logger.info(f"Adding {name} at {location}")
    # check for name and address
    if not name or not location:
        logger.info("Please provide a name and address")
        raise HTTPException(status_code=400, detail="Please provide a name and address")

    # fetch new place
    new_place = get_restaurant_info(name=name, location=location)
    if not new_place:
        logger.info(f"Could not find '{name}' at '{location}'")
        raise HTTPException(
            status_code=404, detail=f"Could not find '{name}' at '{location}'"
        )

    # if the place is already in the database, raise an error
    existing = manager.get_by_place_id(new_place.place_id)
    if existing:
        print(existing)
        logger.info(
            f"Already contains '{existing.name}' at '{existing.formatted_address}'"
        )
        return manager.get_by_place_id(new_place.place_id)

    new_place = manager.insert(new_place)
    logger.info(f"Inserted '{new_place}'")
    return new_place


@app.post("/add/many")
def add_many(places: List[PlaceInsertModel]) -> List[Place]:
    """Add multiple restaurants to the database.

    Args:
        places (List[Dict[str, str]]): List of restaurants to add
    """
    logger.info(f"Adding {len(places)} places")
    new_places = []
    for place in places:
        try:
            new_place = add(name=place["name"], location=place["location"])
            new_places.append(new_place)
        except Exception as e:
            logger.error(f"Could not add {place}: {e}")
    return new_places
