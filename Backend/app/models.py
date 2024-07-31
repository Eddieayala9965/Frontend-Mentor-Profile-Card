import uuid
from typing import List
from sqlalchemy import Column, String, ForeignKey, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, selectinload
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(AsyncAttrs, DeclarativeBase):
    pass

user_social_media_links = Table(
    'user_social_media_links',
    Base.metadata,
    Column('profile_id', UUID(as_uuid=True), ForeignKey('profiles.id')), 
    Column('social_media_link_id', UUID(as_uuid=True), ForeignKey('social_media_links.id'))
)

class User(Base):
    __tablename__ = 'users'
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    username: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)
    profiles: Mapped[List['Profile']] = relationship("Profile", back_populates="owner", lazy="selectin")

class Profile(Base):
    __tablename__ = 'profiles'

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    bio: Mapped[str] = mapped_column(String)
    photo: Mapped[str] = mapped_column(String, nullable=True) 
    address: Mapped[str] = mapped_column(String)
    owner_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id'))

    owner: Mapped[User] = relationship("User", back_populates="profiles")
    social_media_links: Mapped[List['SocialMediaLink']] = relationship(
        "SocialMediaLink",
        secondary=user_social_media_links,
        back_populates="profiles",
        lazy="selectin"
    )

class SocialMediaLink(Base):
    __tablename__ = 'social_media_links'
        
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    url: Mapped[str] = mapped_column(String)
        
    profiles: Mapped[List['Profile']] = relationship(
        "Profile",
        secondary=user_social_media_links,
        back_populates="social_media_links",
        lazy="selectin"
    )