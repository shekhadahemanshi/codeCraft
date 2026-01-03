from sqlalchemy import Column, Integer, String, Date, Time, Boolean, DateTime, ForeignKey, Numeric, CheckConstraint, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Attendance(Base):
    __tablename__ = "attendance"
    
    attendance_id = Column(Integer, primary_key=True, autoincrement=True)
    emp_id = Column(String(20), ForeignKey("employees.emp_id", ondelete="CASCADE"), nullable=False)
    attendance_date = Column(Date, nullable=False)
    check_in_time = Column(Time)
    check_out_time = Column(Time)
    work_hours = Column(Numeric(4, 2), default=0.00)
    extra_hours = Column(Numeric(4, 2), default=0.00)
    status = Column(String(20), CheckConstraint("status IN ('present', 'absent', 'half_day', 'on_leave')"), nullable=False)
    is_paid = Column(Boolean, default=True)
    remarks = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    employee = relationship("Employee", back_populates="attendance_records")
    
    __table_args__ = (
        UniqueConstraint('emp_id', 'attendance_date', name='unique_emp_date'),
    )

class MonthlyAttendanceSummary(Base):
    __tablename__ = "monthly_attendance_summary"
    
    summary_id = Column(Integer, primary_key=True, autoincrement=True)
    emp_id = Column(String(20), ForeignKey("employees.emp_id", ondelete="CASCADE"), nullable=False)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    total_working_days = Column(Integer, nullable=False)
    days_present = Column(Integer, default=0)
    days_absent = Column(Integer, default=0)
    paid_leaves_taken = Column(Numeric(4, 1), default=0.0)
    unpaid_leaves_taken = Column(Numeric(4, 1), default=0.0)
    total_work_hours = Column(Numeric(6, 2), default=0.00)
    total_extra_hours = Column(Numeric(6, 2), default=0.00)
    is_finalized = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        UniqueConstraint('emp_id', 'month', 'year', name='unique_emp_month_year'),
        CheckConstraint('month >= 1 AND month <= 12', name='chk_month_valid'),
        CheckConstraint('year >= 2000 AND year <= 2100', name='chk_year_valid'),
    )