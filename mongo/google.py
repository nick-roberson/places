import os
import json
import googlemaps

from mongo.models import Place
from typing import List

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
INITIAL_RESTAURANTS = "/Users/nicholas/Code/sandbox_mongo_db/data/initial_places.json"


def seed(fp: str = INITIAL_RESTAURANTS, existing: List[str] = None, limit: int = None):
    """
    Seed the database with initial data
    """
    # check if exists
    if not os.path.exists(INITIAL_RESTAURANTS):
        print("Seed data not found")
        return

    # load initial data
    with open(fp, "r") as f:
        data = json.load(f)

    # limit data based on limit or existing names
    if limit:
        data = data[:limit]
    if existing:
        data = [d for d in data if d.get("name") not in existing]

    # loop and get restaurant info
    for restaurant in data:
        try:
            restaurant_info = get_restaurant_info(
                name=restaurant.get("name"), location=restaurant.get("location")
            )
            restaurant["info"] = Place(**restaurant_info)
        except Exception as e:
            print(f"Error getting restaurant info for {restaurant.get('name')}: {e}")
            continue

    # return data to be inserted
    return [d for d in data if d.get("info") is not None]


def get_restaurant_info(name: str, location: str = None):
    """
    Get restaurant info from Google Places API
    """
    query = name if location is None else f"{name} near {location}"
    gmaps = googlemaps.Client(key=GOOGLE_API_KEY)
    places_result = gmaps.places(query=query)
    return places_result["results"][0]
