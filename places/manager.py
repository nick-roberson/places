import pymongo
import sys
import os
import uuid

from typing import List
from places.models import Place

MONGO_URI = os.environ.get("MONGO_URI")

###################################################################
# Utility Functions                                               #
###################################################################

# Singleton manager class
_MANAGER_SINGLETON = None


def get_manager():
    global _MANAGER_SINGLETON
    if not _MANAGER_SINGLETON:
        _MANAGER_SINGLETON = RestaurantManager()
    return _MANAGER_SINGLETON


def get_client():
    """Gets MongoDB client"""
    try:
        client = pymongo.MongoClient(MONGO_URI)
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
    # Drop                                                 #
    ########################################################

    def drop_all(self) -> None:
        """Drop all restaurants"""
        print(f"Dropping all from {self.collection_name}")
        self.collection.drop()

    def drop_by_name(self, name: str) -> None:
        """Drop a restaurant by name"""
        print(f"Dropping {name} from {self.collection_name}")
        self.collection.delete_one({"name": name})

    def drop_by_place_id(self, place_id: str) -> None:
        """Drop a restaurant by place_id"""
        print(f"Dropping {place_id} from {self.collection_name}")
        self.collection.delete_one({"place_id": place_id})

    def drop_by_id(self, id: str) -> None:
        """Drop a restaurant by id"""
        print(f"Dropping {id} from {self.collection_name}")
        self.collection.delete_one({"id": id})

    ########################################################
    # Insert                                               #
    ########################################################
    def insert(self, place: Place) -> Place:
        """Insert a restaurant into the database.
        Args:
            place (Place): Place model
        """
        print(f"Inserting {place.name} into {self.collection_name}")
        try:
            place_dict = place.dict()
            place_dict["id"] = str(uuid.uuid4())
            self.collection.insert_one(place_dict)
            return place
        except Exception as e:
            print(f"Error inserting {place.name}: {e}")

    def insert_many(self, places: List[Place]) -> None:
        """Insert multiple restaurants into the database.
        Args:
            places (List[Place]): List of Place models
        """
        print(f"Inserting {len(places)} places into {self.collection_name}")
        try:
            dicts = [p.dict() for p in places]
            for d in dicts:
                d["id"] = str(uuid.uuid4())
            self.collection.insert_many(dicts)
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
        """Get all restaurants, ensure that names are sorted and unique"""
        print(f"Getting all from {self.collection_name}")
        results = [Place(**place) for place in self.collection.find()]
        results.sort(key=lambda x: x.name)
        return results

    def get_property_list(self, property_name: str) -> List[str]:
        """Get a list of unique values for a property"""
        print(f"Getting {property_name} from {self.collection_name}")
        return self.collection.distinct(property_name)

    def get_by_place_id(self, place_id: str) -> Place:
        """Get a restaurant by place_id"""
        print(f"Getting {place_id} from {self.collection_name}")
        result = self.collection.find_one({"place_id": place_id})
        return Place(**result) if result else None
