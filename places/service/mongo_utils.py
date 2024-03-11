import sys

import pymongo

# Places Code
from constants import MONGO_URI


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
