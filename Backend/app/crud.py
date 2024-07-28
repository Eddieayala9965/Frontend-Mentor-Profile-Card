from sqlalchemy.orm import Session
from sqlalchemy.future import select
from . import models, schemas, security
import uuid

async def get_user(db: Session, user_id: uuid.UUID):
    result = await db.execute(select(models.User).filter(models.User.id == user_id))
    return result.scalars().first()

async def get_user_by_username(db: Session, username: str):
    result = await db.execute(select(models.User).filter(models.User.username == username))
    return result.scalars().first()

async def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def update_user(db: Session, user: schemas.UserUpdate, user_id: uuid.UUID):
    db_user = await get_user(db, user_id)
    if user.username:
        db_user.username = user.username
    if user.password:
        db_user.hashed_password = security.get_password_hash(user.password)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def delete_user(db: Session, user_id: uuid.UUID):
    db_user = await get_user(db, user_id)
    await db.delete(db_user)
    await db.commit()

async def create_profile(db: Session, profile: schemas.ProfileCreate, user_id: uuid.UUID):
    db_profile = models.Profile(**profile.dict(), owner_id=user_id)
    db.add(db_profile)
    await db.commit()
    await db.refresh(db_profile)
    return db_profile

async def update_profile(db: Session, profile: schemas.ProfileUpdate, profile_id: uuid.UUID):
    db_profile = await db.execute(select(models.Profile).filter(models.Profile.id == profile_id))
    db_profile = db_profile.scalars().first()
    if profile.bio is not None:
        db_profile.bio = profile.bio
    if profile.photo is not None:
        db_profile.photo = profile.photo
    if profile.address is not None:
        db_profile.address = profile.address
    if profile.social_media_links is not None:
        db_profile.social_media_links = [
            models.SocialMediaLink(url=link.url) for link in profile.social_media_links
        ]
    db.add(db_profile)
    await db.commit()
    await db.refresh(db_profile)
    return db_profile

async def delete_profile(db: Session, profile_id: uuid.UUID):
    db_profile = await db.execute(select(models.Profile).filter(models.Profile.id == profile_id))
    db_profile = db_profile.scalars().first()
    await db.delete(db_profile)
    await db.commit()

async def get_profiles(db: Session, skip: int = 0, limit: int = 10):
    result = await db.execute(select(models.Profile).offset(skip).limit(limit))
    return result.scalars().all()
