import os
import typer
import json
import sys
import tabulate

from mongo.google import seed as get_seed_data, get_restaurant_info
from mongo.restaurant_manager import RestaurantManager

app = typer.Typer()
manager = RestaurantManager()

SEED_DATA = "/Users/nicholas/Code/sandbox_mongo_db/data/initial_places.json"


@app.command()
def drop_all():
    """Drop all restaurants."""
    manager.drop_all()
    print(f"Dropped all from {manager.collection_name}")


@app.command()
def seed(
    input_file: str = typer.Argument(SEED_DATA, help="Path to the seed data"),
    limit: int = typer.Option(
        None, "--limit", "-l", help="Limit the number of records to seed"
    ),
):
    """Seed MongoDB with initial data.

    Args:
        input_file (str, optional): Path to the seed data. Defaults to SEED_DATA.
        limit (int, optional): Limit the number of records to seed. Defaults to None.

    Notes:
        - The seed data should be a json file with the following schema:
            [
                {
                    "name": "Restaurant Name",
                }
            ]
    """
    # check if seed data exists
    if not os.path.exists(input_file):
        print(f"Seed data not found at {input_file}. Exiting.")
        return

    # check that schema is correct
    with open(input_file, "r") as f:
        data = json.load(f)
        if not all([all(k in d for k in ["name"]) for d in data]):
            print("Seed data schema is incorrect. Exiting.")
            return

    # fetch already inserted data
    existing = manager.get_names()
    print(f"Existing: {existing}")

    # fetch enriched seed data
    seed_data = get_seed_data(input_file=input_file, existing=existing, limit=limit)
    if not seed_data:
        print("No seed data found that hasnt already been inserted. Exiting.")
        return

    # insert seed data
    places = [place["info"] for place in seed_data]
    manager.insert_many(places)
    print(f"Inserted {len(places)} places")


@app.command()
def search(
    name: str = typer.Option(None, "--name", help="Name of the restaurant to lookup"),
    address: str = typer.Option(
        None, "--address", help="Address of the restaurant to lookup"
    ),
    min_rating: float = typer.Option(
        None, "--min-rating", help="Minimum rating for the restaurant"
    ),
    exact: bool = typer.Option(False, "--exact", help="Exact match for name"),
):
    """Search for a restaurant by name"""
    # check for name or address
    if not name and not address:
        print("Please provide a name or address")
        raise typer.Abort()

    # search
    places = manager.search(
        name=name, address=address, min_rating=min_rating, exact=exact
    )
    if not places:
        print("No places found")
        return
    print(f"Found {len(places)} places!\n")

    # filter and print results
    places = [p.dict() for p in places]
    headers = [
        "name",
        "formatted_address",
        "rating",
        "user_ratings_total",
        "price_level",
    ]
    places = [{k: v for k, v in place.items() if k in headers} for place in places]
    print(tabulate.tabulate(places, headers="keys"))

    print("\nDone!")


@app.command()
def insert(
    name: str = typer.Argument(..., help="Name of the restaurant"),
    location: str = typer.Argument(..., help="Address of the restaurant"),
):
    """Add a restaurant to the database.

    Args:
        name (str): Name of the restaurant
        location (str): Address of the restaurant
    """
    # check for name and address
    if not name or not location:
        print("Please provide a name and address")
        raise typer.Abort()

    # check it does not already exist
    existing = manager.get(name, exact=False)
    if existing:
        print(
            f"""Looks like something with a similar name already exists!
        - existing: '{existing['name']}' at '{existing['formatted_address']}'
        - new: '{name}' at '{location}'""
        """
        )
        return

    # fetch new place
    new_place = get_restaurant_info(name=name, location=location)
    if not new_place:
        print(f"Could not find '{name}' at '{location}'")
        return

    # confirm that this is the palce we want to add
    print(f"Inserting '{new_place}'")
    confirm = typer.confirm("Do you want to insert this place?")
    if not confirm:
        print("Aborted")
        sys.exit(0)

    manager.insert(new_place)
    print(f"Inserted '{new_place}'")


if __name__ == "__main__":
    app()
