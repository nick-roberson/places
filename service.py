""" Simple FastAPI service

To run this do the following:
    > export LOG_VERBOSE="1" && poetry run uvicorn service:app --reload

Then open your browser and go to:
    > http://localhost:8000/get/all
"""

# Standard Library
import os
import logging
import uvicorn
import argparse

# Third Party
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

# Places Code
from places.manager import RestaurantManager

# Places Routers
from places.service.routes.add import router as add_routes
from places.service.routes.remove import router as delete_routes
from places.service.routes.get import router as get_routes
from places.service.routes.comments import router as comments_routes

# Initialize FastAPI app and allow CORS
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"])

# Initialize manager and logger
manager = RestaurantManager()
logger = logging.getLogger(__name__)

# Add routes for requests
app.include_router(add_routes)
app.include_router(delete_routes)
app.include_router(get_routes)
app.include_router(comments_routes)


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
