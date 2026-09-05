from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.core.database import Base


class BacktrackingRunModel(Base):
    __tablename__ = "backtracking_runs"

    id = Column(String(64), primary_key=True, index=True)
    spill_id = Column(String(64), ForeignKey("oil_spills.id"), nullable=False)
    origin_lat = Column(Float, nullable=False)
    origin_lng = Column(Float, nullable=False)
    origin_timestamp = Column(String(64), nullable=False)
    drift_trajectory_json = Column(Text, nullable=True)
    status = Column(String(32), default="COMPLETED")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
