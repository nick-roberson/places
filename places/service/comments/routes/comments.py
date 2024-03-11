# Standard
import datetime
import logging
import uuid
from typing import List

# Third Party
from fastapi import APIRouter, HTTPException

from places.service.comments.manager import get_manager as get_comments_manager
from places.service.comments.models import (
    CommentInsertModel,
    CommentModel,
    CommentsModel,
)

# Places Code
from places.service.places.manager import get_manager as get_places_manager

# Constants
places_manager = get_places_manager()
comments_manager = get_comments_manager()

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/comments/get")
def get_comments(place_id: str) -> CommentsModel:
    """Get all comments for a place.

    Args:
        place_id (str): Place to get comments for
    """
    print(f"Getting comments for {place_id}")
    comments = comments_manager.get(place_id=place_id)
    return comments


@router.post("/comments/add")
def add_comment(comment: CommentInsertModel) -> CommentModel:
    """Add a restaurant to the database.

    Args:
        comment (Comment): Comment to add to the place
    """
    print(f"Adding comment to {comment.place_id}")

    # Check comment and place_id
    if not comment.text or not comment.place_id:
        print("Please provide a comment and place_id")
        raise HTTPException(
            status_code=400, detail="Please provide a comment and place_id"
        )

    # Fetch place and ensure exists
    place = places_manager.get_place_by_id(id=comment.place_id)
    if not place:
        detail = f"Could not find place by id '{comment.place_id}'"
        print(detail)
        raise HTTPException(status_code=404, detail=detail)

    # Add comment to the database
    new_comment = CommentModel(
        place_id=place.id,
        comment_id=str(uuid.uuid4()),
        text=comment.text,
        created_at=str(datetime.datetime.utcnow()),
        updated_at=str(datetime.datetime.utcnow()),
    )

    new_comment = comments_manager.add(comment=new_comment)
    return new_comment


@router.post("/comments/delete")
def delete_comment(comment_id: str) -> None:
    """Delete a comment by id.

    Args:
        comment_id (str): Comment to delete
    """
    print(f"Deleting comment by id {comment_id}")
    comments_manager.drop_by_id(comment_id=comment_id)
    return None
