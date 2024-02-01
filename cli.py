import typer

from mongo.google import seed as get_seed_data
from mongo.restaurant_manager import RestaurantManager

app = typer.Typer()
manager = RestaurantManager()

SEED_DATA = "/Users/nicholas/Code/sandbox_mongo_db/data/initial_places.json"


@app.command()
def seed(limit: int = typer.Argument(None, help="Limit the number of records to seed")):
    print("Seeding the database")
    # get already inserted data
    existing = manager.get_names()
    print(f"Existing: {existing}")

    # get seed data
    seed_data = get_seed_data(existing=existing, limit=limit)
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

    # assemble query
    query = {}
    if name:
        query["name"] = name
    if address:
        query["formatted_address"] = address
    if min_rating:
        query["rating"] = {"$gte": min_rating}
    # search
    places = manager.search(query, exact)
    if not places:
        print("No places found")
        return

    # print results
    print(f"Found {len(places)} places!")
    for place in places:
        print(f"- {str(place)}")


if __name__ == "__main__":
    app()
