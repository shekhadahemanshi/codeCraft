from pydantic import BaseModel
from datetime import date
from typing import Optional
from decimal import Decimal

class TimeOffRequestCreate(BaseModel):
    time_off_type: str
    start_date: date
    end_date: date
    reason: Optional[str] = None
    attachment: Optional[str] = None

class TimeOffRequestResponse(BaseModel):
    request_id: int
    emp_id: str
    time_off_type: str
    start_date: date
    end_date: date
    total_days: Decimal
    status: str
    reason: Optional[str]
    
    class Config:
        from_attributes = True

class TimeOffApproval(BaseModel):
    request_id: int
    status: str  # "approved" or "rejected"
    approval_comments: Optional[str] = None