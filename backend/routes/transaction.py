from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from models.transaction import Transaction
from models.schemas import TransactionCreate, TransactionResponse
from datetime import date
from typing import List

router = APIRouter(prefix="/transactions", tags=["Transactions"])

# Add a transaction
@router.post("/", response_model=TransactionResponse)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    db_transaction = Transaction(
        description=transaction.description,
        amount=transaction.amount,
        date=transaction.date
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

# Get all transactions for a specific day
@router.get("/daily/{day}", response_model=List[TransactionResponse])
def get_daily_transactions(day: date, db: Session = Depends(get_db)):
    return db.query(Transaction).filter(Transaction.date == day).all()

# Delete a transaction
@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(transaction)
    db.commit()
    return {"message": "Transaction deleted"}