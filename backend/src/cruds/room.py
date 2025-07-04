from sqlalchemy.orm import Session
from typing import Optional, List
from uuid import UUID
from ..models.room import Room
from ..schemas.room import RoomCreate, RoomUpdate

def get_room(db: Session, room_id: UUID) -> Optional[Room]:
    """Get room by UUID"""
    return db.query(Room).filter(Room.id == room_id).first()

def get_rooms(db: Session, skip: int = 0, limit: int = 100) -> List[Room]:
    """Get rooms with pagination"""
    return db.query(Room).offset(skip).limit(limit).all()

def get_rooms_by_capacity(db: Session, min_capacity: int) -> List[Room]:
    """Get rooms with minimum capacity"""
    return db.query(Room).filter(Room.capacity >= min_capacity).all()

def create_room(db: Session, room_data: RoomCreate) -> Room:
    """Create new room"""
    db_room = Room(
        name=room_data.name,
        capacity=room_data.capacity,
        address=room_data.address
    )
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

def update_room(db: Session, room_id: UUID, room_update: RoomUpdate) -> Optional[Room]:
    """Update room"""
    db_room = get_room(db, room_id)
    if not db_room:
        return None
    
    update_data = room_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_room, field, value)
    
    db.commit()
    db.refresh(db_room)
    return db_room

def delete_room(db: Session, room_id: UUID) -> bool:
    """Delete room"""
    db_room = get_room(db, room_id)
    if not db_room:
        return False
    
    db.delete(db_room)
    db.commit()
    return True

def count_total_rooms(db: Session) -> int:
    """Count total rooms"""
    return db.query(Room).count() 