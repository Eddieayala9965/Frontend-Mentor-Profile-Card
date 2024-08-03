import uuid
from typing import List, Optional
from pydantic import BaseModel, HttpUrl

class SocialMediaLink(BaseModel):
    name: Optional[str] = None  
    url:  HttpUrl
    id: Optional[uuid.UUID] = None

    class Config:
        from_attributes = True

class ProfileBase(BaseModel):
    bio: Optional[str] = None
    photo: Optional[HttpUrl] = None
    address: Optional[str] = None

class ProfileCreate(ProfileBase):
    social_media_links: List[SocialMediaLink] = []

class ProfileUpdate(ProfileBase):
    social_media_links: Optional[List[SocialMediaLink]] = None
    photo: Optional[HttpUrl] = None  

class Profile(ProfileBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    social_media_links: List[SocialMediaLink] = []

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    
    class Config:
        from_attributes = True

class User(UserBase):
    id: uuid.UUID
    profiles: List[Profile] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
