from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete
from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException, Depends
from jose import JWTError, jwt
import os
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from . import models, schemas, security, database
import uuid
from typing import List  


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_user(db: AsyncSession, user_id: uuid.UUID):
    result = await db.execute(
        select(models.User)
        .options(joinedload(models.User.profiles).joinedload(models.Profile.social_media_links))
        .filter(models.User.id == user_id)
    )
    user = result.scalars().first()
    if user:
       
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
       
        await db.execute(
            delete(models.user_social_media_links).where(models.user_social_media_links.c.profile_id.in_(
                select(models.Profile.id).where(models.Profile.owner_id == user_id)
            ))
        )
        await db.commit()
        
        await db.execute(
            delete(models.Profile).where(models.Profile.owner_id == user_id)
        )
        await db.commit()
        
        await db.delete(db_user)
        await db.commit()
        
async def create_profile(db: AsyncSession, profile: schemas.ProfileCreate, user_id: uuid.UUID):
    social_media_links = [
        models.SocialMediaLink(url=str(link.url)) for link in profile.social_media_links
    ]

    db_profile = models.Profile(
        bio=profile.bio,
        photo=str(profile.photo) if profile.photo else None,
        address=profile.address,
        owner_id=user_id,
        social_media_links=social_media_links 
    )
    db.add(db_profile)
    await db.commit()
    await db.refresh(db_profile)
    return db_profile

async def update_social_media_links(db: AsyncSession, profile_id: uuid.UUID, social_media_links: List[schemas.SocialMediaLink]):
    db_profile = await db.execute(
        select(models.Profile)
        .options(joinedload(models.Profile.social_media_links))
        .filter(models.Profile.id == profile_id)
    )
    db_profile = db_profile.scalars().first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    existing_links = {link.id: link for link in db_profile.social_media_links}
    updated_links = []

    for link in social_media_links:
        if link.id and link.id in existing_links:
            existing_link = existing_links.pop(link.id)
            existing_link.url = str(link.url)
            updated_links.append(existing_link)
        else:
            new_link = models.SocialMediaLink(id=link.id or uuid.uuid4(), url=str(link.url))
            db.add(new_link)
            updated_links.append(new_link)

    db_profile.social_media_links = updated_links
    db.add(db_profile)
    await db.commit()
    await db.refresh(db_profile)
    return db_profile


async def update_profile_bio_and_address(db: AsyncSession, profile_id: uuid.UUID, profile_update: schemas.ProfileUpdate):
    db_profile = await db.execute(
        select(models.Profile)
        .filter(models.Profile.id == profile_id)
    )
    db_profile = db_profile.scalars().first()
    
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    if profile_update.bio is not None:
        db_profile.bio = profile_update.bio
    if profile_update.address is not None:
        db_profile.address = profile_update.address

    db.add(db_profile)
    await db.commit()
    await db.refresh(db_profile)
    
    return db_profile


async def update_social_media_links(db: AsyncSession, profile_id: uuid.UUID, social_media_links: List[schemas.SocialMediaLink]):
    db_profile = await db.execute(
        select(models.Profile)
        .options(joinedload(models.Profile.social_media_links))
        .filter(models.Profile.id == profile_id)
    )
    db_profile = db_profile.scalars().first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    existing_links = {link.id: link for link in db_profile.social_media_links}
    updated_links = []

    for link in social_media_links:
        if link.id and link.id in existing_links:
            existing_link = existing_links.pop(link.id)
            existing_link.url = str(link.url)
            updated_links.append(existing_link)
        else:
            new_link = models.SocialMediaLink(id=link.id or uuid.uuid4(), url=str(link.url))
            db.add(new_link)
            updated_links.append(new_link)

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
    profiles = result.unique().scalars().all()
    return profiles


async def get_current_user(db: AsyncSession = Depends(database.get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = await get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    
    
    await db.execute(f"SET app.current_user_id = '{user.id}';")
    await db.commit()

    return user
