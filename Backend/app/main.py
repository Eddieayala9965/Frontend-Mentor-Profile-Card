from sqlalchemy import select
from . import models
from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from .utils.s3_utils import upload_file_to_s3, create_presigned_url
from sqlalchemy.ext.asyncio import AsyncSession
from .api import users, profiles
from . import crud, schemas, database
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware  
from .api.users import get_current_user
import uuid 

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5174", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(users.router)
app.include_router(profiles.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Social Media Card API!"}

import logging

@app.post("/uploadfile/{profile_id}", response_model=schemas.Profile)
async def upload_file(
    profile_id: uuid.UUID,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(database.get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    try:
        # Log the profile ID and file information
        logging.info(f"Uploading file for profile ID: {profile_id}")
        logging.info(f"File details: {file.filename}")

        # Check if the profile exists
        profile = await crud.get_profile_by_id(db=db, profile_id=profile_id)
        if not profile:
            logging.error(f"Profile ID: {profile_id} not found")
            raise HTTPException(status_code=404, detail="Profile not found")

        # Generate filename
        filename = f"{profile_id}/profile_picture.{file.filename.split('.')[-1]}"
        file_url = upload_file_to_s3(file, filename)
        if "error" in file_url:
            raise HTTPException(status_code=500, detail=file_url["error"])

        # Update profile photo URL
        profile = await crud.update_profile_photo(db=db, profile_id=profile_id, photo_url=file_url)
        
        return profile

    except Exception as e:
        logging.error(f"Error uploading file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))






