from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid
from ..schemas import SocialMediaLink

from .. import crud, schemas, database
from .users import get_current_user

router = APIRouter(
    prefix="/profiles",
    tags=["profiles"]
)

@router.post("/create_profile", response_model=schemas.Profile)
async def create_profile(profile: schemas.ProfileCreate, db: AsyncSession = Depends(database.get_db), current_user: schemas.User = Depends(get_current_user)):
    return await crud.create_profile(db=db, profile=profile, user_id=current_user.id)

@router.get("/get_profiles", response_model=List[schemas.Profile])
async def get_profiles(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(database.get_db)):
    profiles = await crud.get_profiles(db, skip=skip, limit=limit)
    return profiles

@router.put("/update_profile/{profile_id}/bio_and_address", response_model=schemas.Profile)
async def update_profile_bio_and_address(
    profile_id: uuid.UUID,
    profile_update: schemas.ProfileUpdate,
    db: AsyncSession = Depends(database.get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    profile = await crud.update_profile_bio_and_address(db=db, profile_id=profile_id, profile_update=profile_update)
    return profile

@router.put("/{profile_id}/social_media_links", response_model=schemas.Profile)
async def update_social_media_links(
    profile_id: uuid.UUID,
    social_media_links: List[SocialMediaLink],
    current_user: schemas.User = Depends(get_current_user), 
    db: AsyncSession = Depends(database.get_db)
):
   
    current_user = current_user
    profile = await crud.update_social_media_links(db=db, profile_id=profile_id, social_media_links=social_media_links)
    return profile