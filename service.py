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
from typing import List, Optional

from mongo.restaurant_manager import RestaurantManager
from mongo.models import Place


app = FastAPI()
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


if __name__ == "__main__":
    configure_logging()
    uvicorn.run(app, host="localhost", port=8000)
