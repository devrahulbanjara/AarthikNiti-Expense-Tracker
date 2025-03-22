# AarthikNiti - Expense Tracker

AarthikNiti is a financial management tool designed for tracking expenses, analyzing income, and managing budgets effectively.

## Features
- **Authentication**: Secure JWT-based login, Google OAuth.
- **Dashboard**: Financial summary, spending insights, interactive charts.
- **Income Tracking**: Income categorization, trend analysis, export options.
- **Expense Management**: Smart categorization, AI-powered receipt scanning, budgeting.
- **Reports & Analytics**: Savings trends, expense vs. income comparison, custom reports.
- **Budgeting & Alerts**: Real-time spending alerts, AI-driven insights.
- **Profile & Settings**: Account management, linked bank accounts, security settings.

## Roles
- **Rahul Dev Banjara** - Backend and Machine Learning Engineer
- **Shreeya Pandey** - Frontend Engineer
- **Diwash Adhikari** - Backend and Database Engineer
- **Prajwal Dahal** - Frontend Engineer

## Directory Structure
```
AarthikNiti-Expense-Tracker/
│── backend/
│── frontend/
│── expense-tracker/
│── docker-compose.yaml
│── LICENSE
│── README.md
```

## Installation & Setup

### Prerequisites
- Node.js & npm
- Python 3.x
- Docker (optional)
- MongoDB

### Cloning the Repository
```sh
git clone https://github.com/devrahulbanjara/AarthikNiti-Expense-Tracker.git
cd AarthikNiti-Expense-Tracker
```

### Backend Setup (FastAPI & MongoDB)
```sh
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use 'venv\Scripts\activate'
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` directory and add the following:
```
MONGO_URI="mongodb+srv://<db_username>:<db_password>@cluster0.uydmy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
MONGO_DB_NAME=<your_cluster_name>
SECRET_KEY=<your_secret_key>
JWT_ALGORITHM=<your_jwt_algorithm>
```

Run the FastAPI server:
```sh
uvicorn main:app --reload
```

### Frontend Setup (React & Tailwind CSS)
```sh
cd ../frontend
npm install
npm run dev
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
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: FastAPI, MongoDB
- **Authentication**: JWT, OAuth 2.0
- **Deployment**: Docker

## Contact
For issues or feature requests, open an issue on [GitHub](https://github.com/devrahulbanjara/AarthikNiti-Expense-Tracker/issues).

