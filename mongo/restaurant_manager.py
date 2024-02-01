import pymongo
import sys
import os

from typing import List
from mongo.models import Place

USER = os.environ.get("MONGO_USER")
PASSWORD = os.environ.get("MONGO_PASSWORD")
CLUSTER_NAME = os.environ.get("MONGO_CLUSTER")
URI = f"mongodb+srv://{USER}:{PASSWORD}@{CLUSTER_NAME}.umyk1er.mongodb.net/?retryWrites=true&w=majority"


###################################################################
# Utility Functions                                               #
###################################################################


def get_client():
    """Gets MongoDB client"""
    print("Getting MongoDB client")
    try:
        client = pymongo.MongoClient(URI)
        client.admin.command("ping")
    except pymongo.errors.ConfigurationError:
        print(
            "An Invalid URI host error was received. Is your Atlas host name correct in your connection string?"
        )
        sys.exit(1)
    return client


def get_collection(client, collection_name):
    print(f"Getting collection {collection_name}")
    db = client.myDatabase
    return db[collection_name]


###################################################################
# Restaurant Manager                                              #
###################################################################


class RestaurantManager:
    def __init__(self):
        print("Initializing RestaurantManager")
        self.client = get_client()
        self.collection_name = "restaurants"
        self.collection = get_collection(self.client, self.collection_name)

    ########################################################
    # Insert                                               #
    ########################################################
    def insert(self, place: Place):
        print(f"Inserting {place.name} into {self.collection_name}")
        self.collection.insert_one(place.dict())

    def insert_many(self, places: List[Place]):
        print(f"Inserting {len(places)} places into {self.collection_name}")
        self.collection.insert_many([p.dict() for p in places])

    ########################################################
    # Get                                                  #
    ########################################################

    def search(self, query: dict, exact: bool = False):
        """Search for a restaurant by query"""
        # update query for case insensitive search
        if not exact:
            query = {
                k: {"$regex": v, "$options": "i"} if isinstance(v, str) else v
                for k, v in query.items()
            }

        # query
        results = [Place(**place) for place in self.collection.find(query)]

        # sort by name
        results.sort(key=lambda x: x.name)
        return results

    def get(self, name: str, exact: bool = False):
        """Get a restaurant by name"""
        if exact:
            query = {"name": name}
        else:
            query = {"name": {"$regex": name, "$options": "i"}}
        print(f"Getting {name} from {self.collection_name}")
        return self.collection.find_one(query)

    def get_all(self):
        """Get all restaurants"""
        print(f"Getting all from {self.collection_name}")
        return [place for place in self.collection.find()]

    def get_names(self):
        print(f"Getting names from {self.collection_name}")
        return [place["name"] for place in self.collection.find()]
