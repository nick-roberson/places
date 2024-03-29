# Standard
import logging
import os
from typing import List

from fastapi import APIRouter, HTTPException, Response

from places.service.places.manager import get_manager

# Constants
manager = get_manager()
router = APIRouter()
logger = logging.getLogger(__name__)


@router.delete("/delete")
def delete(place_id: str, name: str) -> Response:
    """Simple, delete single place."""
    # Raise errors if no place_id or name provided
    if not place_id and not name:
        raise HTTPException(
            status_code=400,
            detail="Please provide a `place_id` or `name` to delete.",
        )

    # Conditional delete by place_id or name
    if place_id:
        print(f"Deleting place {place_id} by place_id")
        manager.drop_by_place_id(place_id=place_id)
        return Response(
            status_code=200, content=f"Deleted place {place_id} by place_id"
        )
    elif name:
        print(f"Deleting place {name} by name")
        manager.drop_by_name(name=name)
        return Response(status_code=200, content=f"Deleted place {name} by name")

    # Raise error if no place_id or name provided
    raise HTTPException(
        status_code=400,
        detail="Please provide a `place_id` or `name` to delete.",
    )


@router.delete("/delete/many")
def delete_many(place_ids: List[str], names: List[str]) -> Response:
    """Simple, delete multiple places."""
    # Raise errors if no place_ids or names provided
    if not place_ids and not names:
        raise HTTPException(
            status_code=400,
            detail="Please provide `place_ids` or `names` to delete.",
        )

    successful_deletes = []
    failed_deletes = []

    # Conditional delete by place_ids or names
    if place_ids:
        print(f"Deleting places {place_ids} by place_ids")
        for place_id in place_ids:
            try:
                manager.drop_by_place_id(place_id=place_id)
                successful_deletes.append(place_id)
            except Exception as e:
                failed_deletes.append((place_id, e))
                pass
    elif names:
        print(f"Deleting places {names} by names")
        for name in names:
            try:
                manager.drop_by_place_id(name=name)
                successful_deletes.append(name)
            except Exception as e:
                failed_deletes.append((name, e))
                pass

    # If any failed, raise error
    if len(failed_deletes) > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to delete places: {failed_deletes}",
        )

    # If all successful, return success and list of successful deletes
    content = {
        "successful_deletes": successful_deletes,
    }
    return Response(status_code=200, content=content)
