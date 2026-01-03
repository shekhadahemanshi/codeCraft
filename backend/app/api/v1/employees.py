from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.employee import Employee, WorkingSchedule, EmployeeStatusTracker
from app.models.timeoff import TimeOffBalance
from app.schemas.employee import EmployeeCreate, EmployeeResponse, EmployeeWithTempPassword
from app.core.security import get_password_hash, generate_temp_password
from app.core.utils import generate_employee_id
from app.api.deps import get_current_user, get_current_admin
from datetime import datetime, date

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.post("/register", response_model=EmployeeWithTempPassword)
def register_employee(
    employee_data: EmployeeCreate,
    db: Session = Depends(get_db),
    current_admin: Employee = Depends(get_current_admin)
):
    """Only Admin/HR can register new employees"""
    
    # Check if email already exists
    existing = db.query(Employee).filter(Employee.email == employee_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Generate employee ID
    emp_id = generate_employee_id(
        db,
        employee_data.company_code,
        employee_data.first_name,
        employee_data.last_name
    )
    
    # Generate temporary password
    temp_password = generate_temp_password()
    
    # Create employee
    new_employee = Employee(
        emp_id=emp_id,
        company_code=employee_data.company_code,
        first_name=employee_data.first_name,
        last_name=employee_data.last_name,
        email=employee_data.email,
        phone=employee_data.phone,
        password_hash=get_password_hash(temp_password),
        role=employee_data.role,
        department=employee_data.department,
        manager_id=employee_data.manager_id,
        location=employee_data.location,
        date_of_joining=employee_data.date_of_joining
    )
    
    db.add(new_employee)
    db.flush()
    
    # Create working schedule
    schedule = WorkingSchedule(
        emp_id=emp_id,
        total_working_hours=8,
        break_time_hours=1,
        working_days_per_month=22,
        effective_from=employee_data.date_of_joining
    )
    db.add(schedule)
    
    # Create time off balance
    current_year = datetime.now().year
    balance = TimeOffBalance(
        emp_id=emp_id,
        year=current_year,
        paid_time_off_total=12.0,
        sick_leave_total=7.0,
        paid_time_off_available=12.0,
        sick_leave_available=7.0
    )
    db.add(balance)
    
    # Create status tracker
    status_tracker = EmployeeStatusTracker(
        emp_id=emp_id,
        current_status="absent",
        status_indicator="yellow"
    )
    db.add(status_tracker)
    
    db.commit()
    db.refresh(new_employee)
    
    return {
        "employee": new_employee,
        "temporary_password": temp_password
    }

@router.get("/", response_model=List[EmployeeResponse])
def get_all_employees(
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Get all employees (Admin/HR see all, employees see only themselves)"""
    if current_user.role in ["admin", "hr"]:
        employees = db.query(Employee).filter(Employee.is_active == True).all()
    else:
        employees = [current_user]
    
    return employees

@router.get("/{emp_id}", response_model=EmployeeResponse)
def get_employee(
    emp_id: str,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Get employee details"""
    if current_user.role not in ["admin", "hr"] and current_user.emp_id != emp_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    employee = db.query(Employee).filter(Employee.emp_id == emp_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return employee
