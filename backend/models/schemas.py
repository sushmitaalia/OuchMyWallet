from pydantic import BaseModel
from datetime import date, datetime

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