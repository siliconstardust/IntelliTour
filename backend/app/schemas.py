from datetime import date
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field, model_validator


class DestinationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    state: str
    category: str
    tags: list[str]
    budget_per_day: int | None
    rating: float | None = None
    description: str
    latitude: float
    longitude: float
    wiki: str | None
    image_url: str | None
    highlights: list[str] = []


class ActivityOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    description: str
    cost: int
    duration_hours: float
    latitude: float
    longitude: float


class EventOut(BaseModel):
    id: int
    title: str
    category: str
    date: date
    time: str
    location: str
    is_sample: bool


class PlanRequest(BaseModel):
    start_city: str | None = None
    destination: str | None = None
    start_date: date
    end_date: date
    travellers: int = Field(1, ge=1, le=50)
    budget: float | None = Field(None, ge=0)  # total trip budget in INR for the whole group
    interests: list[str] = []
    travel_style: Literal["Relaxed", "Balanced", "Packed"] = "Balanced"

    @model_validator(mode="after")
    def check_dates(self):
        if self.end_date < self.start_date:
            raise ValueError("The end date must be on or after the start date.")
        if (self.end_date - self.start_date).days > 13:
            raise ValueError("Trips are limited to 14 days.")
        return self
