from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.employee import Employee
from app.schemas.auth import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Employee:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        emp_id: str = payload.get("sub")
        if emp_id is None:
            raise credentials_exception
        token_data = TokenData(emp_id=emp_id)
    except JWTError:
        raise credentials_exception
    
    user = db.query(Employee).filter(Employee.emp_id == token_data.emp_id).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_admin(current_user: Employee = Depends(get_current_user)) -> Employee:
    if current_user.role not in ["admin", "hr"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user