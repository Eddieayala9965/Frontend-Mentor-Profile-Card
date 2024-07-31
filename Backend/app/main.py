from sqlalchemy import select
from . import models
from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from .utils.s3_utils import upload_file_to_s3, create_presigned_url
from sqlalchemy.ext.asyncio import AsyncSession
from .api import users, profiles
from . import crud, schemas, database
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware  

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

@app.post("/uploadfile/", response_model=schemas.Profile)
async def upload_file(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(database.get_db),
    current_user: schemas.User = Depends(crud.get_current_user)
):
    try:
        file_url = upload_file_to_s3(file)
        if "error" in file_url:
            raise HTTPException(status_code=500, detail=file_url["error"])

        # Find the current user's profile
        db_profile = await db.execute(
            select(models.Profile).where(models.Profile.owner_id == current_user.id)
        )
        db_profile = db_profile.scalars().first()

        if db_profile:
            db_profile.photo = file_url  
            db.add(db_profile)
            await db.commit()
            await db.refresh(db_profile)
            return db_profile
        else:
            raise HTTPException(status_code=404, detail="Profile not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))