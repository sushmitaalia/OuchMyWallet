# Ouch My Wallet

A personal finance tracker web app built to log daily expenses and roll them up into monthly and yearly summaries. This is a personal portfolio project built to learn full-stack development from scratch.

---

## What it does

You log in to your own account and track everything you spend. At the end of the day, your expenses are saved and automatically reflected in your monthly and yearly totals. There's also a bill splitter tool coming soon.

---

## Features

### Daily View
- Add transactions with a name and amount
- Delete transactions
- See your total spending for the day
- After midnight, the day locks and a new day begins

### Monthly View
- See all 12 months with total spent per month
- Click on any month to expand and see a day-by-day breakdown
- Click on any day to see individual transactions

### Yearly View
- See total spending per year with a visual bar chart per month
- Navigate between years using arrow buttons

### Bill Splitter
- Coming soon

### Authentication
- Each user has their own account with a username and password
- Passwords are hashed and stored securely
- JWT token based authentication — stay logged in for 7 days
- All transactions are private and tied to your account

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite | UI and user interactions |
| Backend | FastAPI (Python) | API server and business logic |
| ORM | SQLAlchemy | Connects Python to the database |
| Database | PostgreSQL | Stores all user and transaction data |
| Auth | JWT + Passlib | Secure login and session management |

```
React → FastAPI → SQLAlchemy → PostgreSQL
```

---

## Project Structure

```
OuchMyWallet/
├── backend/
│   ├── main.py
│   ├── auth.py
│   ├── models/
│   │   ├── user.py
│   │   ├── transaction.py
│   │   └── schemas.py
│   ├── routes/
│   │   ├── auth.py
│   │   └── transaction.py
│   ├── database/
│   │   └── database.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   └── transactions.js
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   └── pages/
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── DailyView.jsx
│   │       ├── MonthlyView.jsx
│   │       ├── YearlyView.jsx
│   │       └── BillSplitter.jsx
└── README.md
```

---

## Running Locally

### Prerequisites
- Python 3.x
- Node.js
- PostgreSQL

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create a `.env` file in the `backend` folder:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/ouch_my_wallet
```


---

## What's next

- Deploy the app so it's accessible from anywhere
- Complete the bill splitter feature
- Add spending categories and filters
- Add a weekly summary view