from pydantic import BaseModel
from typing import List, Optional


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

    business_status: str
    formatted_address: str
    geometry: Geometry
    icon_background_color: str
    icon_mask_base_uri: str
    name: str
    place_id: str
    plus_code: PlusCode
    price_level: Optional[int] = None
    rating: Optional[float] = None
    reference: str
    types: List[str]
    user_ratings_total: int

    def __init__(self, **data):
        """Ensure that all fields are set, allow none accounting for messy data."""
        fields = set(Place.__fields__.keys())
        for field in fields:
            if field not in data:
                data[field] = None
        super().__init__(**data)

    def __str__(self):
        return f"{self.name} - {self.formatted_address} - {self.rating}"

    def __repr__(self):
        return self.name
