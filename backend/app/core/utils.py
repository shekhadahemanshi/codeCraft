from datetime import datetime
from sqlalchemy.orm import Session
from app.models.employee import Employee

def generate_employee_id(
    db: Session,
    company_code: str,
    first_name: str,
    last_name: str,
    year: int = None
) -> str:
    """
    Generate employee ID: CC + FN(2) + LN(2) + YYYY + ####
    Example: ABJO20240001
    """
    if year is None:
        year = datetime.now().year
    
    # Extract 2 letters from first and last name
    fn_part = first_name[:2].upper()
    ln_part = last_name[:2].upper()
    
    # Get the last serial number for this year
    prefix = f"{company_code.upper()}{fn_part}{ln_part}{year}"
    
    last_emp = db.query(Employee).filter(
        Employee.emp_id.like(f"{prefix}%")
    ).order_by(Employee.emp_id.desc()).first()
    
    if last_emp:
        last_serial = int(last_emp.emp_id[-4:])
        new_serial = last_serial + 1
    else:
        new_serial = 1
    
    return f"{prefix}{new_serial:04d}"