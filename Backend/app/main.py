from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from .utils.s3_utils import upload_file_to_s3, create_presigned_url
from sqlalchemy.ext.asyncio import AsyncSession
from .api import users, profiles
from . import crud, schemas, database
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware  

load_dotenv()

app = FastAPI()

# Add CORSMiddleware to enable CORS
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
        
        profile_data = schemas.ProfileCreate(
            bio="This is a test bio",
            photo=file_url,
            address="123 Test Street",
            social_media_links=[],
        )
        profile = await crud.create_profile(db=db, profile=profile_data, user_id=current_user.id)
        
        return profile

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/presigned_url/")
def get_presigned_url(file_name: str):
    url = create_presigned_url(bucket_name=os.getenv("AWS_BUCKET_NAME"), object_name=file_name)
    if url:
        return {"url": url}
    else:
        raise HTTPException(status_code=500, detail="Could not generate pre-signed URL")