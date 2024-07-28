from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid

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

@router.put("/update_profile/{profile_id}", response_model=schemas.Profile)
async def update_profile(profile_id: uuid.UUID, profile: schemas.ProfileUpdate, db: AsyncSession = Depends(database.get_db), current_user: schemas.User = Depends(get_current_user)):
    db_profile = await crud.update_profile(db=db, profile=profile, profile_id=profile_id)
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return db_profile

@router.delete("/delete_profile/{profile_id}", response_model=None)
async def delete_profile(profile_id: uuid.UUID, db: AsyncSession = Depends(database.get_db), current_user: schemas.User = Depends(get_current_user)):
    await crud.delete_profile(db=db, profile_id=profile_id)
    return {"message": "Profile deleted successfully"}
