import uuid
from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

user_social_media_links = Table(
    'user_social_media_links',
    Base.metadata,
    Column('user_id', UUID(as_uuid=True), ForeignKey('users.id')), 
    Column('social_meedia_link_id', UUID(as_uuid=True), ForeignKey('social_media_links.id'))
)

class User(Base):
    __tablename__ = 'users'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    profiles = relationship("Profile" , back_populates="owner")

class Profile(Base):
    __tablename__ = 'profiles'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    bio = Column(String)
    photo = Column(String)
    address = Column(String)
    owner_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    
    owner = relationship("User", back_populates="profiles")
    social_media_links = relationship("SocialMediaLink",
                                      
    secondary=user_social_media_links,
        back_populates="profiles"
        
    )
    
    class SocialMediaLink(Base):
        __tablename__ = 'social_media_links'
        
        id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
        url = Column(String)
        
        profiles = relationship("Profile",
                                 
            secondary=user_social_media_links,
                back_populates="social_media_links"
        )