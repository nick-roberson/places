# Standard
import os
import logging

# Third Party
from fastapi import APIRouter
from fastapi import HTTPException, Response
from typing import List

# Places Code
from places.manager import get_manager

# Constants
manager = get_manager()
router = APIRouter()
logger = logging.getLogger(__name__)


def configure_logging():
    level = logging.DEBUG if os.environ.get("LOG_VERBOSE") is None else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )


@router.post("/delete")
def delete(place_id_or_name: str) -> Response:
    """Simple, delete single place."""
    logger.info(f"Deleting place: {place_id_or_name}")

    # Delete single place
    success: bool = False
    try:
        manager.drop_by_name(name=place_id_or_name)
        success = True
    except Exception as e:
        logger.error(f"Could not delete {place_id_or_name}: {e}")
        raise HTTPException(
            status_code=500, detail=f"Could not delete {place_id_or_name}: {e}"
        )

    # Delete single place by name
    if not success:
        try:
            manager.drop_by_place_id(place_id=place_id_or_name)
            success = True
        except Exception as e:
            logger.error(f"Could not delete {place_id_or_name}: {e}")
            raise HTTPException(
                status_code=500, detail=f"Could not delete {place_id_or_name}: {e}"
            )

    # Raise error if could not be deleted by place_id or name for some reason
    if not success:
        raise HTTPException(
            status_code=404, detail=f"Could not find place {place_id_or_name}"
        )

    # return response
    return Response(status_code=200, content=f"Deleted place {place_id_or_name}")


@router.post("/delete/many")
def delete_many(places: List[str]) -> Response:
    """Simple, delete multiple places."""
    logger.info(f"Deleting {len(places)} places")
    successful_deletes, failed_deletes = [], []

    # loop through places and delete
    for place_id in places:
        try:
            manager.drop_by_place_id(place_id=place_id)
            successful_deletes.append(place_id)
        except Exception as e:
            logger.error(f"Could not delete {place_id}: {e}")
            failed_deletes.append(place_id)

    # return content with successful and failed deletes
    content = {
        "successful_deletes": successful_deletes,
        "failed_deletes": failed_deletes,
    }
    return Response(status_code=200, content=content)
