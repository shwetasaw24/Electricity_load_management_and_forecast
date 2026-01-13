from sqlalchemy import Column, Integer, Float, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()


class Advisory(Base):
    __tablename__ = "advisories"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    city = Column(String, index=True)
    predicted_load = Column(Float)
    risk = Column(String)
    reason = Column(String)

    temperature = Column(Float)
    weather_condition = Column(String)

    def __repr__(self):
        return f"<Advisory city={self.city}, risk={self.risk}, load={self.predicted_load}>"

class LoadHistory(Base):
    __tablename__ = "load_history"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    load = Column(Float)

class Region(Base):
    __tablename__ = "regions"
    id = Column(Integer, primary_key=True)
    city = Column(String)
    region_name = Column(String)
    building_type = Column(String)  # residential, commercial, industrial
    purpose = Column(String)        # hospital, home, factory, school
    priority = Column(Integer)      # 1–5 (criticality)
