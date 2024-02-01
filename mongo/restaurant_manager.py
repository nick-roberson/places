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
    db = client.myDatabase
    return db[collection_name]


###################################################################
# Restaurant Manager                                              #
###################################################################


class RestaurantManager:
    def __init__(self):
        self.client = get_client()
        self.collection_name = "restaurants"
        self.collection = get_collection(self.client, self.collection_name)

    ########################################################
    # Insert                                               #
    ########################################################
    def insert(self, place: Place) -> None:
        """Insert a restaurant into the database.
        Args:
            place (Place): Place model
        """
        print(f"Inserting {place.name} into {self.collection_name}")
        try:
            self.collection.insert_one(place.dict())
        except Exception as e:
            print(f"Error inserting {place.name}: {e}")

    def insert_many(self, places: List[Place]) -> None:
        """Insert multiple restaurants into the database.
        Args:
            places (List[Place]): List of Place models
        """
        print(f"Inserting {len(places)} places into {self.collection_name}")
        try:
            self.collection.insert_many([p.dict() for p in places])
        except Exception as e:
            print(f"Error inserting places: {e}")

    ########################################################
    # Get                                                  #
    ########################################################

    def search(
        self,
        name: str = None,
        address: str = None,
        min_rating: float = None,
        exact: bool = False,
    ) -> List[Place]:
        """Search for a restaurant by query"""
        # assemble query
        query = {}
        if name:
            query["name"] = name
        if address:
            query["formatted_address"] = address
        if min_rating:
            query["rating"] = {"$gte": min_rating}

        """Search for a restaurant by query"""
        # update query for case insensitive search
        if not exact:
            query = {
                k: {"$regex": v, "$options": "i"} if isinstance(v, str) else v
                for k, v in query.items()
            }

        # query
        print(f"Searching for {query} in {self.collection_name}")
        results = [Place(**place) for place in self.collection.find(query)]

        # sort by name
        results.sort(key=lambda x: x.name)
        return results

    def get(self, name: str, exact: bool = False) -> Place:
        """Get a restaurant by name"""
        if exact:
            query = {"name": name}
        else:
            query = {"name": {"$regex": name, "$options": "i"}}
        print(f"Getting {name} from {self.collection_name}")
        return self.collection.find_one(query)

    def get_all(self) -> List[Place]:
        """Get all restaurants"""
        print(f"Getting all from {self.collection_name}")
        return [place for place in self.collection.find()]

    def get_names(self) -> List[str]:
        """Get all restaurant names"""
        print(f"Getting names from {self.collection_name}")
        return [place["name"] for place in self.collection.find()]
