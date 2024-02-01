""" Simple FastAPI service

To run this do the following:
    > export LOG_VERBOSE="1" && poetry run uvicorn service:app --reload

Then open your browser and go to:
    > http://localhost:8000/get/all
"""

import os
import logging
import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from typing import List, Optional, Dict

from places.manager import RestaurantManager
from places.models import Place, APIKey, PlaceInsertModel
from places.google import get_restaurant_info


app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"])

manager = RestaurantManager()
logger = logging.getLogger(__name__)


def configure_logging():
    level = logging.DEBUG if os.environ.get("LOG_VERBOSE") is None else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )


@app.get("/")
def read_root():
    return {"Hello": "World"}


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


@app.post("/delete/many")
def delete_many(places: List[Dict[str, str]]) -> str:
    """Delete multiple restaurants from the database.

    Args:
        places (List[str]): List of restaurants to delete
    """
    logger.info(f"Deleting {len(places)} places")
    deleted_places = []
    for place in places:
        try:
            name, location = place.get("name"), place.get("location")
            manager.drop_by_name(name=name)
        except Exception as e:
            logger.error(f"Could not delete {place}: {e}")
    return "Done"


@app.get("/all")
def get_all() -> List[Place]:
    """Get all restaurants."""
    logging.info("Getting all")
    return manager.get_all()


@app.get("/get/{name}")
def get_one(name: str, exact: bool = False) -> Optional[Place]:
    """Get one restaurant by name

    Args:
        name (str): Name of the restaurant to get
        exact (bool, optional): Exact match for name. Defaults to False.
    """
    logger.info(f"Getting {name}")
    return manager.get(name=name, exact=exact)


@app.get("/search")
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


@app.get("/keys/google")
def get_google_api_key() -> APIKey:
    """Get the Google api key."""
    return APIKey(key=os.environ.get("GOOGLE_API_KEY"))


if __name__ == "__main__":
    configure_logging()
    uvicorn.run(app, host="localhost", port=8000)
