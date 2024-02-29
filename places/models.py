from pydantic import BaseModel
from typing import List, Optional, Dict


class PlaceInsertModel(BaseModel):
    name: str
    location: str
    collection: Optional[str] = "personal"


class APIKey(BaseModel):
    key: str


class Location(BaseModel):
    lat: float
    lng: float


class Viewport(BaseModel):
    northeast: Location
    southwest: Location


class Geometry(BaseModel):
    location: Location
    viewport: Viewport


class Photo(BaseModel):
    height: int
    html_attributions: List[str]
    photo_reference: str
    width: int


class PlusCode(BaseModel):
    compound_code: str
    global_code: str


class Place(BaseModel):
    """Place model"""

    # Required fields
    id: Optional[str] = None

    # Required fields
    business_status: str
    formatted_address: str
    geometry: Geometry
    icon_background_color: str
    icon_mask_base_uri: str
    name: str
    place_id: str
    plus_code: PlusCode
    reference: str
    types: List[str]
    user_ratings_total: int

    # Optional fields
    price_level: Optional[int] = None
    rating: Optional[float] = None
    collection: Optional[str] = "personal"

    # Processed fields
    reservation_url: Optional[str] = None
    comments: Optional[List[Dict]] = []

    def __init__(self, **data):
        """Ensure that all fields are set, allow none accounting for messy data."""
        fields = set(Place.__fields__.keys())
        for field in fields:
            if field not in data:
                data[field] = None

        # Processed fields
        data["reservation_url"] = None
        if data["place_id"] and data["name"]:
            data["reservation_url"] = (
                f"https://www.google.com/maps/place/?q=place_id:{data['place_id']}"
            )

        super().__init__(**data)

    def __str__(self):
        return f"{self.name} - {self.formatted_address} - {self.rating}"

    def __repr__(self):
        return self.name


class CommentInsertModel(BaseModel):
    """Comment model passed on insert to the database"""

    place_id: str
    text: str


class CommentModel(BaseModel):
    """Comment model returned from the database"""

    comment_id: str
    place_id: str
    text: str
    created_at: str
    updated_at: str
