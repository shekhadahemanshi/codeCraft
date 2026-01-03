from sqlalchemy import Column, String, Boolean, DateTime, Enum as SQLEnum, ForeignKey, Integer, Date, Numeric, Text, CheckConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import enum

class RoleEnum(str, enum.Enum):
    employee = "employee"
    hr = "hr"
    admin = "admin"

class Employee(Base):
    __tablename__ = "employees"
    
    emp_id = Column(String(20), primary_key=True)
    company_code = Column(String(2), nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(15), nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(SQLEnum(RoleEnum), nullable=False, default=RoleEnum.employee)
    department = Column(String(50))
    manager_id = Column(String(20), ForeignKey("employees.emp_id"))
    location = Column(String(100))
    date_of_joining = Column(Date, nullable=False)
    profile_picture = Column(String(255))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    attendance_records = relationship("Attendance", back_populates="employee")
    timeoff_requests = relationship("TimeOffRequest", back_populates="employee", foreign_keys="TimeOffRequest.emp_id")
    timeoff_balance = relationship("TimeOffBalance", back_populates="employee")
    working_schedule = relationship("WorkingSchedule", back_populates="employee")
    status = relationship("EmployeeStatusTracker", back_populates="employee", uselist=False)
    personal_info = relationship("EmployeePersonalInfo", back_populates="employee", uselist=False)
    bank_details = relationship("EmployeeBankDetails", back_populates="employee", uselist=False)
    salary_structure = relationship("EmployeeSalaryStructure", back_populates="employee")
    pf_contributions = relationship("EmployeePFContribution", back_populates="employee")
    tax_deductions = relationship("EmployeeTaxDeductions", back_populates="employee")

class WorkingSchedule(Base):
    __tablename__ = "schedules"
    
    schedule_id = Column(Integer, primary_key=True, autoincrement=True)
    emp_id = Column(String(20), ForeignKey("employees.emp_id", ondelete="CASCADE"), nullable=False)
    total_working_hours = Column(Numeric(4, 2), nullable=False)
    break_time_hours = Column(Numeric(4, 2), default=1.00)
    working_days_per_month = Column(Integer, default=22)
    effective_from = Column(Date, nullable=False)
    effective_to = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    employee = relationship("Employee", back_populates="working_schedule")

class EmployeeStatusTracker(Base):
    __tablename__ = "employee_status_tracker"
    
    status_id = Column(Integer, primary_key=True, autoincrement=True)
    emp_id = Column(String(20), ForeignKey("employees.emp_id", ondelete="CASCADE"), unique=True, nullable=False)
    current_status = Column(String(20), CheckConstraint("current_status IN ('in_office', 'on_leave', 'absent')"), nullable=False)
    status_indicator = Column(String(20), CheckConstraint("status_indicator IN ('green', 'airplane', 'yellow')"), nullable=False)
    last_check_in = Column(DateTime)
    last_check_out = Column(DateTime)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    employee = relationship("Employee", back_populates="status")

class EmployeePersonalInfo(Base):
    __tablename__ = "employee_personal_info"
    
    personal_info_id = Column(Integer, primary_key=True, autoincrement=True)
    emp_id = Column(String(20), ForeignKey("employees.emp_id", ondelete="CASCADE"), unique=True, nullable=False)
    about = Column(Text)
    what_i_love_about_my_job = Column(Text)
    interests_and_hobbies = Column(Text)
    skills = Column(Text)
    certifications = Column(Text)
    date_of_birth = Column(Date)
    residing_address = Column(Text)
    nationality = Column(String(50))
    personal_email = Column(String(100))
    gender = Column(String(20), CheckConstraint("gender IN ('Male', 'Female', 'Other', 'Prefer not to say')"))
    marital_status = Column(String(20), CheckConstraint("marital_status IN ('Single', 'Married', 'Divorced', 'Widowed', 'Prefer not to say')"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    employee = relationship("Employee", back_populates="personal_info")

class EmployeeBankDetails(Base):
    __tablename__ = "employee_bank_details"
    
    bank_detail_id = Column(Integer, primary_key=True, autoincrement=True)
    emp_id = Column(String(20), ForeignKey("employees.emp_id", ondelete="CASCADE"), unique=True, nullable=False)
    account_number = Column(String(50), nullable=False)
    bank_name = Column(String(100), nullable=False)
    ifsc_code = Column(String(11), nullable=False)
    pan_no = Column(String(10), unique=True)
    uan_no = Column(String(12), unique=True)
    emp_code = Column(String(50))
    branch_name = Column(String(100))
    account_holder_name = Column(String(100))
    account_type = Column(String(20), CheckConstraint("account_type IN ('Savings', 'Current', 'Salary')"))
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    employee = relationship("Employee", back_populates="bank_details")

class EmployeeSalaryStructure(Base):
    __tablename__ = "employee_salary_structure"
    
    salary_structure_id = Column(Integer, primary_key=True, autoincrement=True)
    emp_id = Column(String(20), ForeignKey("employees.emp_id", ondelete="CASCADE"), nullable=False)
    monthly_wage = Column(Numeric(10, 2), nullable=False)
    no_of_working_days_in_week = Column(Integer, default=5)
    standard_allowance = Column(Numeric(10, 2), default=4167.00)
    fixed_allowance = Column(Numeric(10, 2), default=0.00)
    effective_from = Column(Date, nullable=False)
    effective_to = Column(Date)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    employee = relationship("Employee", back_populates="salary_structure")

class EmployeePFContribution(Base):
    __tablename__ = "employee_pf_contribution"
    
    pf_contribution_id = Column(Integer, primary_key=True, autoincrement=True)
    emp_id = Column(String(20), ForeignKey("employees.emp_id", ondelete="CASCADE"), nullable=False)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    basic_salary = Column(Numeric(10, 2), nullable=False)
    is_processed = Column(Boolean, default=False)
    payment_date = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    employee = relationship("Employee", back_populates="pf_contributions")
    
    __table_args__ = (
        CheckConstraint('month >= 1 AND month <= 12', name='chk_pf_month_valid'),
        CheckConstraint('year >= 2000 AND year <= 2100', name='chk_pf_year_valid'),
        CheckConstraint('basic_salary > 0', name='chk_pf_basic_salary_positive'),
    )

class EmployeeTaxDeductions(Base):
    __tablename__ = "employee_tax_deductions"
    
    tax_deduction_id = Column(Integer, primary_key=True, autoincrement=True)
    emp_id = Column(String(20), ForeignKey("employees.emp_id", ondelete="CASCADE"), nullable=False)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    monthly_tax_deduction = Column(Numeric(10, 2), default=200.00)
    professional_tax = Column(Numeric(10, 2), default=0.00)
    tds_deduction = Column(Numeric(10, 2), default=0.00)
    other_deductions = Column(Numeric(10, 2), default=0.00)
    deduction_remarks = Column(Text)
    is_processed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    employee = relationship("Employee", back_populates="tax_deductions")
    
    __table_args__ = (
        CheckConstraint('month >= 1 AND month <= 12', name='chk_tax_month_valid'),
        CheckConstraint('year >= 2000 AND year <= 2100', name='chk_tax_year_valid'),
    )