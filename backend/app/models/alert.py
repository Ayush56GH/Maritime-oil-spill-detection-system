from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text
from sqlalchemy.sql import func
from app.core.database import Base


class AlertModel(Base):
    __tablename__ = "alerts"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    subtitle = Column(Text, nullable=True)
    timestamp = Column(String(64), nullable=False)
    severity = Column(String(16), nullable=False)
    coordinates = Column(String(128), nullable=True)
    action_label = Column(String(64), nullable=True)
    match_confidence = Column(Integer, nullable=True)
    imo = Column(String(32), nullable=True)
    speed = Column(String(32), nullable=True)
    acknowledged = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
