from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Numeric, Text, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class TimeOffBalance(Base):
    __tablename__ = "time_off_balance"
    
    balance_id = Column(Integer, primary_key=True, autoincrement=True)
    emp_id = Column(String(20), ForeignKey("employees.emp_id", ondelete="CASCADE"), nullable=False)
    year = Column(Integer, nullable=False)
    paid_time_off_total = Column(Numeric(4, 1), nullable=False)
    paid_time_off_used = Column(Numeric(4, 1), default=0.0)
    sick_leave_total = Column(Numeric(4, 1), nullable=False)
    sick_leave_used = Column(Numeric(4, 1), default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    employee = relationship("Employee", back_populates="timeoff_balance")
    
    __table_args__ = (
        UniqueConstraint('emp_id', 'year', name='unique_emp_year'),
    )

class TimeOffRequest(Base):
    __tablename__ = "time_off_requests"
    
    request_id = Column(Integer, primary_key=True, autoincrement=True)
    emp_id = Column(String(20), ForeignKey("employees.emp_id", ondelete="CASCADE"), nullable=False)
    time_off_type = Column(String(20), CheckConstraint("time_off_type IN ('paid_time_off', 'sick_leave', 'unpaid_leave')"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    total_days = Column(Numeric(4, 1))
    reason = Column(Text)
    attachment = Column(String(255))
    status = Column(String(20), CheckConstraint("status IN ('pending', 'approved', 'rejected')"), default="pending", nullable=False)
    approved_by = Column(String(20), ForeignKey("employees.emp_id", ondelete="SET NULL"))
    approval_date = Column(DateTime)
    approval_comments = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    employee = relationship("Employee", back_populates="timeoff_requests", foreign_keys=[emp_id])