""" Simple FastAPI service

To run this do the following:
    > export LOG_VERBOSE="1" && poetry run uvicorn service:app --reload

Then open your browser and go to:
    > http://localhost:8000/get/all
"""

import argparse
import logging

# Standard Library
import os

import uvicorn

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

# Comments Routes
from places.service.comments.routes.comments import router as comments_routes


from places.service.places.manager import PlacesManager

# Places Routes
from places.service.places.routes.add import router as add_places_routes
from places.service.places.routes.get import router as get_places_routes
from places.service.places.routes.delete import router as delete_places_routes

# Recipe Routes
from places.service.recipes.routes.add import router as add_recipes_routes
from places.service.recipes.routes.delete import router as delete_recipes_routes
from places.service.recipes.routes.get import router as get_recipes_routes
from places.service.recipes.routes.update import router as update_recipes_routes

# Initialize FastAPI App
app = FastAPI()

# Add Places Endpoints
app.include_router(add_places_routes)
app.include_router(get_places_routes)
app.include_router(delete_places_routes)


# Add Comments Endpoints
app.include_router(comments_routes)

# Add Recipe Endpoints
app.include_router(add_recipes_routes)
app.include_router(get_recipes_routes)
app.include_router(delete_recipes_routes)
app.include_router(update_recipes_routes)

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize manager and logger
manager = PlacesManager()
logger = logging.getLogger(__name__)


def configure_logging(level: int = logging.INFO):
    level = logging.DEBUG if os.environ.get("LOG_VERBOSE") is None else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )


@app.get("/")
def read_root() -> Response:
    content = {
        "message": "Welcome to Nick's restaurant service!",
    }
    return Response(status_code=200, content=content)


def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description="Run the FastAPI service")
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Set logging level to DEBUG",
    )
    return parser.parse_args()


def run_service():
    """Run the FastAPI service."""
    args = parse_args()
    configure_logging(level=logging.DEBUG if args.verbose else logging.INFO)
    uvicorn.run(app, host="localhost", port=8000)


if __name__ == "__main__":
    """Run the FastAPI service."""
    run_service()
