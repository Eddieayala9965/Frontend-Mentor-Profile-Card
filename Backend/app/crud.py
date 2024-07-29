from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from . import models, schemas, security
import uuid

async def get_user(db: AsyncSession, user_id: uuid.UUID):
    result = await db.execute(
        select(models.User)
        .options(joinedload(models.User.profiles).joinedload(models.Profile.social_media_links))
        .filter(models.User.id == user_id)
    )
    user = result.scalars().first()
    if user:
        # Explicitly await the lazy-loaded attributes
        await user.awaitable_attrs.profiles
    return user

async def get_user_by_username(db: AsyncSession, username: str):
    result = await db.execute(
        select(models.User)
        .options(joinedload(models.User.profiles).joinedload(models.Profile.social_media_links))
        .filter(models.User.username == username)
    )
    user = result.scalars().first()
    if user:
        # Explicitly await the lazy-loaded attributes
        await user.awaitable_attrs.profiles
    return user

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
    # Convert dictionaries to SocialMediaLink instances with URLs as strings
    social_media_links = [
        models.SocialMediaLink(url=str(link.url)) for link in profile.social_media_links
    ]
    # Convert photo URL to string
    photo_url = str(profile.photo)
    
    db_profile = models.Profile(
        bio=profile.bio,
        photo=photo_url,
        address=profile.address,
        owner_id=user_id,
        social_media_links=social_media_links  # Add the converted instances
    )
    db.add(db_profile)
    await db.commit()
    await db.refresh(db_profile)
    return db_profile

from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from . import models, schemas
import uuid

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from . import models, schemas
import uuid

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from . import models, schemas
import uuid

async def update_profile(db: AsyncSession, profile: schemas.ProfileUpdate, profile_id: uuid.UUID):
    result = await db.execute(
        select(models.Profile)
        .options(joinedload(models.Profile.social_media_links))
        .filter(models.Profile.id == profile_id)
    )
    db_profile = result.scalars().first()
    
    if db_profile:
        if profile.bio is not None:
            db_profile.bio = profile.bio
        if profile.photo is not None:
            db_profile.photo = str(profile.photo)  # Convert photo URL to string
        if profile.address is not None:
            db_profile.address = profile.address

        if profile.social_media_links is not None:
            # Create a dictionary of existing social media links based on URL
            existing_links = {link.url: link for link in db_profile.social_media_links}
            updated_links = []

            for link_data in profile.social_media_links:
                link_url = str(link_data.url)
                if link_url in existing_links:
                    # Update existing link
                    existing_link = existing_links[link_url]
                    updated_links.append(existing_link)
                else:
                    # Create a new link
                    new_link = models.SocialMediaLink(url=link_url)
                    db.add(new_link)
                    updated_links.append(new_link)

            # Replace profile's social media links with updated/new links
            db_profile.social_media_links = updated_links

        db.add(db_profile)
        await db.commit()
        await db.refresh(db_profile)
    return db_profile


async def get_profiles(db: AsyncSession, skip: int = 0, limit: int = 10):
    result = await db.execute(
        select(models.Profile)
        .options(joinedload(models.Profile.social_media_links))
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()