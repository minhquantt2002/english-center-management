from sqlalchemy.orm import Session
from ..models.achievement import Achievement
from ..schemas.achievement import AchievementCreate, AchievementUpdate
from typing import List, Optional

def get_achievements_by_student(db: Session, student_id: str, skip: int = 0, limit: int = 100) -> List[Achievement]:
    """
    Lấy danh sách thành tích của học sinh
    """
    return db.query(Achievement).filter(Achievement.student_id == student_id).offset(skip).limit(limit).all()

def get_achievement(db: Session, achievement_id: str) -> Optional[Achievement]:
    """
    Lấy thành tích theo ID
    """
    return db.query(Achievement).filter(Achievement.id == achievement_id).first()

def create_achievement(db: Session, achievement: AchievementCreate) -> Achievement:
    """
    Tạo thành tích mới
    """
    db_achievement = Achievement(**achievement.model_dump())
    db.add(db_achievement)
    db.commit()
    db.refresh(db_achievement)
    return db_achievement

def update_achievement(db: Session, achievement_id: str, achievement: AchievementUpdate) -> Optional[Achievement]:
    """
    Cập nhật thành tích
    """
    db_achievement = get_achievement(db, achievement_id)
    if not db_achievement:
        return None
    
    update_data = achievement.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_achievement, field, value)
    
    db.commit()
    db.refresh(db_achievement)
    return db_achievement

def delete_achievement(db: Session, achievement_id: str) -> bool:
    """
    Xóa thành tích
    """
    db_achievement = get_achievement(db, achievement_id)
    if not db_achievement:
        return False
    
    db.delete(db_achievement)
    db.commit()
    return True 