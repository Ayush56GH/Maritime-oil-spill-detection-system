from sqlalchemy import Column, String, Float, Integer, DateTime, Text, Boolean
from sqlalchemy.sql import func
from app.core.database import Base


class OilSpillModel(Base):
    __tablename__ = "oil_spills"

    id = Column(String(64), primary_key=True, index=True)
    status = Column(String(32), default="CRITICAL", nullable=False)
    coordinates = Column(String(128), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    detection_time = Column(String(64), nullable=False)
    est_area = Column(String(64), nullable=False)
    sensor_source = Column(String(64), default="Sentinel-1 SAR")
    confidence = Column(String(32), default="98% High")
    evidence_level = Column(Integer, default=5)
    evidence_description = Column(Text, nullable=True)
    area_sq_nm = Column(String(32), default="41.2 SQ NM")
    estimated_origin_status = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
