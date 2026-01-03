from pydantic import BaseModel, EmailStr
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class TokenData(BaseModel):
    emp_id: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str