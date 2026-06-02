from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import extract, func
from database.database import get_db
from models.transaction import Transaction
from models.schemas import TransactionCreate, TransactionResponse
from models.user import User
from auth import get_current_user
from datetime import date
from typing import List

router = APIRouter(prefix="/transactions", tags=["Transactions"])

# Add a transaction
@router.post("/", response_model=TransactionResponse)
def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_transaction = Transaction(
        description=transaction.description,
        amount=transaction.amount,
        date=transaction.date,
        owner_id=current_user.id
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

# Get all transactions for a specific day
@router.get("/daily/{day}", response_model=List[TransactionResponse])
def get_daily_transactions(
    day: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Transaction).filter(
        Transaction.date == day,
        Transaction.owner_id == current_user.id
    ).all()

# Delete a transaction
@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.owner_id == current_user.id
    ).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(transaction)
    db.commit()
    return {"message": "Transaction deleted"}

# Get monthly summary
@router.get("/monthly/{year}/{month}")
def get_monthly_transactions(
    year: int,
    month: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    results = db.query(
        Transaction.date,
        func.sum(Transaction.amount).label("total")
    ).filter(
        extract("year", Transaction.date) == year,
        extract("month", Transaction.date) == month,
        Transaction.owner_id == current_user.id
    ).group_by(Transaction.date).order_by(Transaction.date).all()

    return [{"date": str(r.date), "total": r.total} for r in results]

# Get yearly summary
@router.get("/yearly/{year}")
def get_yearly_transactions(
    year: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    results = db.query(
        extract("month", Transaction.date).label("month"),
        func.sum(Transaction.amount).label("total")
    ).filter(
        extract("year", Transaction.date) == year,
        Transaction.owner_id == current_user.id
    ).group_by("month").order_by("month").all()

    return [{"month": int(r.month), "total": r.total} for r in results]