from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from . import models, schemas, security
import uuid

async def get_user(db: AsyncSession, user_id: uuid.UUID):
    result = await db.execute(
        select(models.User)
        .options(selectinload(models.User.profiles).selectinload(models.Profile.social_media_links))
        .filter(models.User.id == user_id)
    )
    return result.scalars().first()

async def get_user_by_username(db: AsyncSession, username: str):
    result = await db.execute(
        select(models.User)
        .options(selectinload(models.User.profiles).selectinload(models.Profile.social_media_links))
        .filter(models.User.username == username)
    )
    return result.scalars().first()

async def create_user(db: AsyncSession, user: schemas.UserCreate):
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def update_user(db: AsyncSession, user: schemas.UserUpdate, user_id: uuid.UUID):
    db_user = await get_user(db, user_id)
    if db_user:
        if user.username:
            db_user.username = user.username
        if user.password:
            db_user.hashed_password = security.get_password_hash(user.password)
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
    return db_user

async def delete_user(db: AsyncSession, user_id: uuid.UUID):
    db_user = await get_user(db, user_id)
    if db_user:
        await db.delete(db_user)
        await db.commit()

async def create_profile(db: AsyncSession, profile: schemas.ProfileCreate, user_id: uuid.UUID):
    db_profile = models.Profile(**profile.dict(), owner_id=user_id)
    db.add(db_profile)
    await db.commit()
    await db.refresh(db_profile)
    return db_profile

async def update_profile(db: AsyncSession, profile: schemas.ProfileUpdate, profile_id: uuid.UUID):
    result = await db.execute(
        select(models.Profile)
        .options(selectinload(models.Profile.social_media_links))
        .filter(models.Profile.id == profile_id)
    )
    db_profile = result.scalars().first()
    if db_profile:
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

async def delete_profile(db: AsyncSession, profile_id: uuid.UUID):
    result = await db.execute(
        select(models.Profile)
        .options(selectinload(models.Profile.social_media_links))
        .filter(models.Profile.id == profile_id)
    )
    db_profile = result.scalars().first()
    if db_profile:
        await db.delete(db_profile)
        await db.commit()

async def get_profiles(db: AsyncSession, skip: int = 0, limit: int = 10):
    result = await db.execute(
        select(models.Profile)
        .options(selectinload(models.Profile.social_media_links))
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()