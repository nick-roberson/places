import json
import os
from typing import List, Union
import uuid

import googlemaps
from tqdm import tqdm

from places.service.places.models import Place

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
INITIAL_RESTAURANTS = "/Users/nicholas/Code/sandbox_mongo_db/data/initial_places.json"


def seed(
    input_file: str = INITIAL_RESTAURANTS, existing: List[str] = None, limit: int = None
):
    """
    Seed the database with initial data.

    Args:
        input_file (str, optional): Path to the seed data. Defaults to INITIAL_RESTAURANTS.
        existing (List[str], optional): List of existing restaurant names. Defaults to None.
        limit (int, optional): Limit the number of records to seed. Defaults to None.
    """
    # check if exists
    if not os.path.exists(INITIAL_RESTAURANTS):
        print("Seed data not found")
        return

    # load initial data
    with open(input_file, "r") as f:
        data = json.load(f)

    # limit data based on limit or existing names
    if limit:
        data = data[:limit]
    if existing:
        data = [d for d in data if d.get("name") not in existing]

    # loop and get restaurant info
    for restaurant in tqdm(data, desc="Seeding data"):
        try:
            restaurant_info = get_restaurant_info(
                name=restaurant.get("name"), location=restaurant.get("location")
            )
            restaurant["info"] = restaurant_info
        except Exception as e:
            print(f"Error getting restaurant info for {restaurant.get('name')}: {e}")
            continue

    # return data to be inserted
    return [d for d in data if d.get("info") is not None]


def get_restaurant_info(name: str, location: str = None) -> Union[Place, None]:
    """
    Get restaurant info from Google Places API
    """
    # build query and get supplemental info
    query = name if location is None else f"{name} near {location}"
    gmaps = googlemaps.Client(key=GOOGLE_API_KEY)
    places_result = gmaps.places(query=query)

    # check if results, return None otherwise
    if not places_result["results"]:
        print(f"No results found for {name}")
        return None

    # return first result
    first = places_result["results"][0]

    # update with new id and return
    first["id"] = str(uuid.uuid4())
    return Place(**first)
