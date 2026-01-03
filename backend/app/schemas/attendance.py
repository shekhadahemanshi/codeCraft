from pydantic import BaseModel
from datetime import date, time
from typing import Optional
from decimal import Decimal

class AttendanceCheckIn(BaseModel):
    emp_id: str
    check_in_time: Optional[time] = None

class AttendanceCheckOut(BaseModel):
    emp_id: str
    check_out_time: Optional[time] = None

class AttendanceResponse(BaseModel):
    attendance_id: int
    emp_id: str
    attendance_date: date
    check_in_time: Optional[time]
    check_out_time: Optional[time]
    work_hours: Decimal
    extra_hours: Decimal
    status: str
    
    class Config:
        from_attributes = True