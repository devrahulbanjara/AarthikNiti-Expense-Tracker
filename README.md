# SpendWise - Expense Tracker

SpendWise is a financial management tool designed for tracking expenses, analyzing income, and managing budgets effectively.

## Features
- **Authentication**: Secure JWT-based login, Google OAuth.
- **Dashboard**: Financial summary, spending insights, interactive charts.
- **Income Tracking**: Income categorization, trend analysis, export options.
- **Expense Management**: Smart categorization, AI-powered receipt scanning, budgeting.
- **Reports & Analytics**: Savings trends, expense vs. income comparison, custom reports.
- **Budgeting & Alerts**: Real-time spending alerts, AI-driven insights.
- **Profile & Settings**: Account management, linked bank accounts, security settings.

## Directory Structure
```
SpendWise---Expense-Tracker/
│── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── budgeting.py
│   │   │   ├── expenses.py
│   │   │   ├── income.py
│   │   │   ├── reports.py
│   │   │   └── settings.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── utils.py
│   │   ├── models/
│   │   │   ├── budgeting.py
│   │   │   ├── expense.py
│   │   │   ├── income.py
│   │   │   ├── report.py
│   │   │   └── user.py
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── budgeting.py
│   │   │   ├── expense.py
│   │   │   ├── income.py
│   │   │   ├── report.py
│   │   │   └── user.py
│   │   ├── services/
│   │   │   ├── auth.py
│   │   │   ├── budgeting.py
│   │   │   ├── expense.py
│   │   │   ├── income.py
│   │   │   └── report.py
│   │   ├── main.py
│   │   ├── requirements.txt
│   ├── docker-compose.yml
│   ├── Dockerfile
│── frontend/
│── expense-tracker/
│── docker-compose.yaml
│── LICENSE
│── README.md
```

## Installation & Setup

### Prerequisites
- Node.js, pnpm
- Docker (optional)
- MongoDB

### Backend (FastAPI)
```sh
cd backend
pip install -r app/requirements.txt
uvicorn app.main:app --reload
```

### Frontend (Next.js & Tailwind CSS)
```sh
cd frontend
pnpm install
pnpm dev
```

### Docker Deployment
```sh
docker-compose up --build
```

## Contribution
1. Fork the repository
2. Create a feature branch
3. Commit and push changes
4. Open a Pull Request

## License
MIT License - see [LICENSE](LICENSE).

## Tech Stack
- **Frontend**: Next.js, Tailwind CSS
- **Backend**: FastAPI, MongoDB
- **Authentication**: JWT, OAuth 2.0
- **Deployment**: Docker, Vercel

## Contact
For issues or feature requests, open an issue on [GitHub](https://github.com/devrahulbanjara/SpendWise---Expense-Tracker/issues).

