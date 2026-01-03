from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date
from decimal import Decimal

class EmployeeCreate(BaseModel):
    company_code: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    role: str = "employee"
    department: Optional[str] = None
    manager_id: Optional[str] = None
    location: Optional[str] = None
    date_of_joining: date

class EmployeeResponse(BaseModel):
    emp_id: str
    company_code: str
    first_name: str
    last_name: str
    email: str
    phone: str
    role: str
    department: Optional[str]
    location: Optional[str]
    date_of_joining: date
    profile_picture: Optional[str]
    is_active: bool
    
    class Config:
        from_attributes = True

class EmployeeWithTempPassword(BaseModel):
    employee: EmployeeResponse
    temporary_password: str

# Personal Info Schemas
class EmployeePersonalInfoCreate(BaseModel):
    about: Optional[str] = None
    what_i_love_about_my_job: Optional[str] = None
    interests_and_hobbies: Optional[str] = None
    skills: Optional[str] = None
    certifications: Optional[str] = None
    date_of_birth: Optional[date] = None
    residing_address: Optional[str] = None
    nationality: Optional[str] = None
    personal_email: Optional[str] = None
    gender: Optional[str] = None
    marital_status: Optional[str] = None

class EmployeePersonalInfoResponse(EmployeePersonalInfoCreate):
    personal_info_id: int
    emp_id: str
    
    class Config:
        from_attributes = True

# Bank Details Schemas
class EmployeeBankDetailsCreate(BaseModel):
    account_number: str
    bank_name: str
    ifsc_code: str
    pan_no: Optional[str] = None
    uan_no: Optional[str] = None
    emp_code: Optional[str] = None
    branch_name: Optional[str] = None
    account_holder_name: Optional[str] = None
    account_type: Optional[str] = None

class EmployeeBankDetailsResponse(EmployeeBankDetailsCreate):
    bank_detail_id: int
    emp_id: str
    is_verified: bool
    
    class Config:
        from_attributes = True

# Salary Structure Schemas
class EmployeeSalaryStructureCreate(BaseModel):
    monthly_wage: Decimal
    no_of_working_days_in_week: int = 5
    standard_allowance: Decimal = Decimal("4167.00")
    fixed_allowance: Decimal = Decimal("0.00")
    effective_from: date

class EmployeeSalaryStructureResponse(BaseModel):
    salary_structure_id: int
    emp_id: str
    monthly_wage: Decimal
    no_of_working_days_in_week: int
    standard_allowance: Decimal
    fixed_allowance: Decimal
    effective_from: date
    effective_to: Optional[date]
    is_active: bool
    
    class Config:
        from_attributes = True