from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from models.transaction import Transaction
from models.schemas import TransactionCreate, TransactionResponse
from datetime import date
from typing import List
from sqlalchemy import extract, func

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


# Get monthly summary (total spent per day in a month)
@router.get("/monthly/{year}/{month}")
def get_monthly_transactions(year: int, month: int, db: Session = Depends(get_db)):
    results = db.query(
        Transaction.date,
        func.sum(Transaction.amount).label("total")
    ).filter(
        extract("year", Transaction.date) == year,
        extract("month", Transaction.date) == month
    ).group_by(Transaction.date).order_by(Transaction.date).all()

    return [{"date": str(r.date), "total": r.total} for r in results]

# Get yearly summary (total spent per month in a year)
@router.get("/yearly/{year}")
def get_yearly_transactions(year: int, db: Session = Depends(get_db)):
    results = db.query(
        extract("month", Transaction.date).label("month"),
        func.sum(Transaction.amount).label("total")
    ).filter(
        extract("year", Transaction.date) == year
    ).group_by("month").order_by("month").all()

    return [{"month": int(r.month), "total": r.total} for r in results]