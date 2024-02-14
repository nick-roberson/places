# Standard
import logging
import uuid
import datetime

# Third Party
from fastapi import APIRouter
from fastapi import HTTPException
from typing import List

# Places Code
from places.manager import get_manager
from places.models import CommentModel, CommentInsertModel

# Constants
manager = get_manager()
router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/comments/get")
def get_comments(place_id: str) -> List[CommentModel]:
    """Get all comments for a place.

    Args:
        place_id (str): Place to get comments for
    """
    logger.info(f"Getting comments for {place_id}")
    comments = manager.get_comments(place_id=place_id)
    return comments


@router.post("/comments/add")
def add_comment(comment: CommentInsertModel) -> CommentModel:
    """Add a restaurant to the database.

    Args:
        comment (Comment): Comment to add to the place
    """
    logger.info(f"Adding comment to {comment.place_id}")

    # check comment and place_id
    if not comment.text or not comment.place_id:
        logger.info("Please provide a comment and place_id")
        raise HTTPException(
            status_code=400, detail="Please provide a comment and place_id"
        )

    # fetch place and ensure exists
    place = manager.get_by_place_id(place_id=comment.place_id)
    if not place:
        detail = f"Could not find place by id '{comment.place_id}'"
        logger.info(detail)
        raise HTTPException(status_code=404, detail=detail)

    # add comment to the database
    new_comment_id: str = str(uuid.uuid4())
    created_at_utc = str(datetime.datetime.utcnow())
    comment_model: CommentModel = CommentModel(
        comment_id=new_comment_id,
        place_id=comment.place_id,
        text=comment.text,
        created_at=created_at_utc,
        updated_at=created_at_utc,
    )
    new_comment = manager.add_comment(comment_model=comment_model)
    print(f"Added comment: {new_comment}")
    # return new comment
    return new_comment
