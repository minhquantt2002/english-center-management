from typing import Optional
from datetime import datetime
from uuid import UUID
from .base import BaseSchema

class RoomBase(BaseSchema):
    name: str
    capacity: Optional[int] = None
    address: Optional[str] = None
    description: Optional[str] = None  # Mô tả phòng học
    equipment: Optional[str] = None  # Thiết bị trong phòng
    status: Optional[str] = "available"  # available, occupied, maintenance

class RoomCreate(RoomBase):
    pass

class RoomUpdate(BaseSchema):
    name: Optional[str] = None
    capacity: Optional[int] = None
    address: Optional[str] = None
    description: Optional[str] = None
    equipment: Optional[str] = None
    status: Optional[str] = None

class RoomResponse(RoomBase):
    id: UUID
    created_at: datetime 