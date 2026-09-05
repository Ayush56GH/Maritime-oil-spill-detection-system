from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class VesselModel(Base):
    __tablename__ = "vessels"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(64), nullable=False)
    mmsi = Column(String(32), unique=True, index=True, nullable=False)
    imo = Column(String(32), unique=True, index=True, nullable=False)
    speed = Column(String(32), nullable=False)
    heading = Column(String(32), nullable=False)
    draft = Column(String(32), default="11.4 m")
    status = Column(String(32), default="Underway")
    evidence_strength = Column(Integer, default=50)
    risk = Column(String(16), default="Medium")
    last_coords = Column(String(128), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
