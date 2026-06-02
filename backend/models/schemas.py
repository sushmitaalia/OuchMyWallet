from pydantic import BaseModel
from datetime import date, datetime

class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TransactionCreate(BaseModel):
    description: str
    amount: float
    date: date

class TransactionResponse(BaseModel):
    id: int
    description: str
    amount: float
    date: date
    created_at: datetime

    class Config:
        from_attributes = True