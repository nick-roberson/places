# Standard
import logging
import os
from typing import Dict, List

from fastapi import APIRouter, HTTPException

from places.google.google import get_restaurant_info
from places.service.places.manager import get_manager
from places.service.places.models import Place, PlaceInsertModel

# Constants
manager = get_manager()
router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/add")
def add(
    name: str,
    location: str,
) -> Place:
    """Add a restaurant to the database.

    Args:
        name (str): Name of the restaurant
        location (str): Address of the restaurant
    """
    print(f"Adding {name} at {location}")
    # check for name and address
    if not name or not location:
        print("Please provide a name and address")
        raise HTTPException(status_code=400, detail="Please provide a name and address")

    # fetch new place
    new_place = get_restaurant_info(name=name, location=location)
    if not new_place:
        print(f"Could not find '{name}' at '{location}'")
        raise HTTPException(
            status_code=404, detail=f"Could not find '{name}' at '{location}'"
        )

    # if the place is already in the database, raise an error
    existing = manager.get_place_by_place_id(new_place.place_id)
    if existing:
        print(existing)
        print(f"Already contains '{existing.name}' at '{existing.formatted_address}'")
        return manager.get_place_by_place_id(new_place.place_id)

    new_place = manager.insert(new_place)
    print(f"Inserted '{new_place}'")
    return new_place


@router.post("/add/many")
def add_many(places: List[PlaceInsertModel]) -> List[Place]:
    """Add multiple restaurants to the database.

    Args:
        places (List[Dict[str, str]]): List of restaurants to add
    """
    print(f"Adding {len(places)} places")
    new_places = []
    for place in places:
        try:
            new_place = add(name=place["name"], location=place["location"])
            new_places.append(new_place)
        except Exception as e:
            logger.error(f"Could not add {place}: {e}")
    return new_places
