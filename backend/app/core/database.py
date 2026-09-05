from app.core.config import settings

try:
    from sqlalchemy import create_engine
    from sqlalchemy.orm import declarative_base, sessionmaker
    Base = declarative_base()
    HAS_SQLALCHEMY = True
except ImportError:
    class DummyBase:
        pass
    Base = DummyBase
    HAS_SQLALCHEMY = False

# Lazy database engine initialization
engine = None
SessionLocal = None

def get_db():
    global engine, SessionLocal
    if HAS_SQLALCHEMY and engine is None and not settings.USE_MOCK_DATA:
        try:
            engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, pool_pre_ping=True)
            SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        except Exception:
            pass

    if SessionLocal is not None:
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()
    else:
        yield None
