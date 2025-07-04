from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from ..cruds import room as room_crud
from ..schemas.room import RoomCreate, RoomUpdate
from ..models.room import Room

def get_room(db: Session, room_id: UUID) -> Optional[Room]:
    """Get room by ID"""
    return room_crud.get_room(db, room_id)

def get_rooms(db: Session, skip: int = 0, limit: int = 100) -> List[Room]:
    """Get list of rooms with pagination"""
    return room_crud.get_rooms(db, skip=skip, limit=limit)

def get_rooms_by_capacity(db: Session, min_capacity: int) -> List[Room]:
    """Get rooms with minimum capacity"""
    return room_crud.get_rooms_by_capacity(db, min_capacity)

def create_room(db: Session, room_data: RoomCreate) -> Room:
    """Create new room"""
    return room_crud.create_room(db, room_data)

def update_room(db: Session, room_id: UUID, room_data: RoomUpdate) -> Optional[Room]:
    """Update room"""
    return room_crud.update_room(db, room_id, room_data)

def delete_room(db: Session, room_id: UUID) -> bool:
    """Delete room"""
    return room_crud.delete_room(db, room_id)

def count_total_rooms(db: Session) -> int:
    """Count total rooms"""
    return room_crud.count_total_rooms(db) 