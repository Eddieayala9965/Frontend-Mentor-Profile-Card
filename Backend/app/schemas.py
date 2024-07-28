import uuid
from typing import List, Optional
from pydantic import BaseModel, HttpUrl

class SocialMediaLink(BaseModel):
    url: HttpUrl
    id: uuid.UUID

    class Config:
        orm_mode = True

class ProfileBase(BaseModel):
    bio: Optional[str] = None
    photo: Optional[HttpUrl] = None
    address: Optional[str] = None

class ProfileCreate(ProfileBase):
    social_media_links: List[SocialMediaLink] = []

class ProfileUpdate(ProfileBase):
    social_media_links: Optional[List[SocialMediaLink]] = None

class Profile(ProfileBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    social_media_links: List[SocialMediaLink] = []

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None

class User(UserBase):
    id: uuid.UUID
    profiles: List[Profile] = []

    class Config:
        orm_mode = True