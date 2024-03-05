from places.service.comments.models import CommentModel, CommentsModel
from places.service.mongo_utils import get_client, get_collection
import uuid
from typing import List

# Singleton manager class
_MANAGER_SINGLETON = None


def get_manager():
    global _MANAGER_SINGLETON
    if _MANAGER_SINGLETON is None:
        _MANAGER_SINGLETON = CommentsManager()
    return _MANAGER_SINGLETON


class CommentsManager:
    def __init__(self):
        self.client = get_client()
        self.collection_name = "comments"
        self.collection = get_collection(self.client, self.collection_name)

    ########################################################
    # Drop                                                 #
    ########################################################

    def drop_all(self) -> None:
        """Drop all comments"""
        print(f"Dropping all from {self.collection_name}")
        self.collection.drop()

    def drop_by_id(self, comment_id: str) -> None:
        """Drop a comment by id"""
        self.collection.delete_many({"comment_id": comment_id})
        print(f"Dropped {comment_id} from {self.collection_name}")

    ########################################################
    # Get                                                  #
    ########################################################

    def get(self, place_id: str) -> CommentsModel:
        """Get all comments for a place.
        Args:
            place_id (str): Place to get comments for
        """
        print(f"Getting comments for {place_id}")
        comments = self.collection.find({"place_id": place_id})
        return CommentsModel(comments=[CommentModel(**comment) for comment in comments])

    ########################################################
    # Insert                                               #
    ########################################################

    def add(self, comment: CommentModel) -> CommentModel:
        """Insert a comment into the database.
        Args:
            comment (CommentModel): Comment model
        """
        print(f"Inserting {comment.text} into {self.collection_name}")
        try:
            comment_dict = comment.dict()
            comment_dict["id"] = str(uuid.uuid4())
            self.collection.insert_one(comment_dict)
            return comment
        except Exception as e:
            print(f"Error inserting {comment.text}: {e}")

    def add_many(self, comments: List[CommentModel]) -> None:
        """Insert multiple comments into the database.
        Args:
            comments (List[CommentModel]): List of comments
        """
        print(f"Inserting {len(comments)} comments into {self.collection_name}")
        for comment in comments:
            self.insert(comment)
        print(f"Inserted {len(comments)} comments into {self.collection_name}")
