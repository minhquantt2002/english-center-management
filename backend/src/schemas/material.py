from typing import Optional
from datetime import datetime
from uuid import UUID
from .base import BaseSchema

class MaterialBase(BaseSchema):
    class_id: UUID
    title: str
    description: Optional[str] = None
    file_url: Optional[str] = None  # URL của file
    file_type: Optional[str] = None  # pdf, doc, video, image
    file_size: Optional[str] = None  # Kích thước file
    uploaded_by: UUID

class MaterialCreate(MaterialBase):
    pass

class MaterialUpdate(BaseSchema):
    title: Optional[str] = None
    description: Optional[str] = None
    file_url: Optional[str] = None
    file_type: Optional[str] = None
    file_size: Optional[str] = None

class MaterialResponse(MaterialBase):
    id: UUID
    created_at: datetime 