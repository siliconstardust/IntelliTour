from datetime import date
from sqlalchemy import JSON, Boolean, Date, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base


class Destination(Base):
    __tablename__ = "destinations"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), index=True)
    state: Mapped[str] = mapped_column(String(120))
    category: Mapped[str] = mapped_column(String(40), index=True)
    tags: Mapped[list] = mapped_column(JSON)
    budget_per_day: Mapped[int | None] = mapped_column(Integer, nullable=True)  # approximate, INR per person
    description: Mapped[str] = mapped_column(Text)
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    wiki: Mapped[str | None] = mapped_column(String(160), nullable=True)  # Wikipedia title used by the frontend for a photo
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    activities: Mapped[list["Activity"]] = relationship(back_populates="destination", cascade="all, delete-orphan", order_by="Activity.id")


class Activity(Base):
    __tablename__ = "activities"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    destination_id: Mapped[int] = mapped_column(ForeignKey("destinations.id"), index=True)
    name: Mapped[str] = mapped_column(String(160))
    description: Mapped[str] = mapped_column(Text, default="")
    interest: Mapped[list] = mapped_column(JSON)  # weights 0..1: history, nature, food, adventure, spiritual, shopping
    cost: Mapped[int] = mapped_column(Integer, default=0)  # approximate, INR per person
    duration_hours: Mapped[float] = mapped_column(Float, default=1.5)
    popularity: Mapped[float] = mapped_column(Float, default=4.2)  # approximate 0..5 score used for ranking only
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    destination: Mapped[Destination] = relationship(back_populates="activities")


class Event(Base):
    __tablename__ = "events"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(160))
    category: Mapped[str] = mapped_column(String(40))
    event_date: Mapped[date] = mapped_column(Date, index=True)
    event_time: Mapped[str] = mapped_column(String(8), default="")
    location: Mapped[str] = mapped_column(String(160), default="")
    is_sample: Mapped[bool] = mapped_column(Boolean, default=False)
