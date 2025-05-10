# 💰 AarthikNiti Expense Tracker

<div align="center">

<img src="docs/logo.png" alt="AarthikNiti Logo" width="200"/>

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**AarthikNiti** is a powerful personal finance management application designed to help you track expenses, analyze income patterns, and achieve your financial goals with AI-powered insights.

</div>

## 📋 Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Directory Structure](#directory-structure)
- [Installation & Setup](#installation--setup)
- [Docker Deployment](#docker-deployment)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Technologies](#technologies)
- [Team & Contributors](#team--contributors)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

**AarthikNiti** (Sanskrit for "Financial Policy") is a comprehensive financial management tool designed to help individuals and families take control of their finances. With intuitive interfaces, AI-powered insights, and robust analytics, AarthikNiti makes expense tracking and financial planning accessible to everyone.

### Why AarthikNiti?

- **Holistic Financial View**: Get a complete picture of your income, expenses, and savings
- **Smart Analysis**: AI-powered categorization and trend detection
- **Receipt Scanning**: Automatically extract data from receipts
- **Interactive Visualizations**: Understand your finances through intuitive charts and graphs
- **Secure & Private**: Your financial data stays private with secure authentication

## Features

### User Authentication & Security

- Secure JWT-based authentication
- Google OAuth integration
- Two-factor authentication (OTP)
- Secure password policies

### Financial Dashboard

- Financial summary with net worth calculation
- Spending insights with category breakdown
- Interactive charts for income vs. expense trends
- Monthly/weekly/daily view options

### Income Tracking

- Multiple income source management
- Income categorization (salary, investments, freelance, etc.)
- Recurring income setup
- Income trend analysis
- Income data export (CSV, PDF)

### Expense Management

- Smart expense categorization
- AI-powered receipt scanning and data extraction
- Receipt image storage
- Budget tracking against actual spending
- Expense filtering and search

### Reports & Analytics

- Savings percentage and trends
- Expense vs. income comparison
- Category-wise spending analysis
- Custom date range reports
- Financial health score

### Budgeting & Alerts

- Category-wise budget setting
- Real-time spending alerts
- Budget vs. actual spending analysis
- AI-driven insights on spending habits
- Smart saving recommendations

### Profile & Settings

- User profile management
- Theme preferences (light/dark mode)
- Currency preferences
- Linked bank accounts (future feature)
- Security settings

## Directory Structure

```
AarthikNiti-Expense-Tracker/
├── backend/                 # FastAPI backend
│   ├── chatbot/             # AI chatbot integration
│   ├── core/                # Core utilities and settings
│   ├── models/              # Pydantic data models
│   ├── receipt_information_extractor/ # Receipt scanning AI
│   ├── routes/              # API routes and endpoints
│   ├── services/            # Business logic services
│   ├── static/              # Static files storage
│   ├── database.py          # Database configuration
│   └── main.py              # Application entry point
│
├── frontend/                # React frontend
│   ├── src/                 # Source code
│   ├── public/              # Public static files
│   └── package.json         # Dependencies and scripts
│
├── tests/                   # Test suite
│   ├── simple_test.py       # Simple test suite
│   └── test_backend.py      # Pytest-based test suite
│
├── docker-compose.yaml      # Docker Compose configuration
└── README.md                # Project documentation
```

## Installation & Setup

### Prerequisites

- Node.js (v18+)
- Python 3.10+
- MongoDB account
- Git

### Cloning the Repository

```sh
git clone https://github.com/devrahulbanjara/AarthikNiti-Expense-Tracker.git
cd AarthikNiti-Expense-Tracker
```

### Backend Setup (FastAPI & MongoDB)

1. **Set up virtual environment**:

   ```sh
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows use 'venv\Scripts\activate'
   pip install -r requirements.txt
   ```

2. **Configure environment variables**:

   Create a `.env` file inside the `backend` directory and add the following:

   ```
   # MongoDB Configuration
   MONGODB_URL=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority
   DATABASE_NAME=aarthikniti

   # Security
   SECRET_KEY=your_secret_key_here
   ACCESS_TOKEN_EXPIRE_MINUTES=30

   # Email (for OTP)
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USERNAME=your_email@example.com
   EMAIL_PASSWORD=your_email_password
   EMAIL_FROM=your_email@example.com

   # Frontend URL for CORS
   FRONTEND_URL=http://localhost:5173
   ```

3. **Run the FastAPI server**:

   ```sh
   uvicorn main:app --reload
   ```

   The API will be available at [http://localhost:8000](http://localhost:8000)

### Frontend Setup (React & Tailwind CSS)

1. **Navigate to frontend and install dependencies**:

   ```sh
   cd ../frontend
   npm install
   ```

2. **Start development server**:

   ```sh
   npm run dev
   ```

   The frontend will be available at [http://localhost:5173](http://localhost:5173)

## Docker Deployment

For easier deployment, you can use Docker Compose:

1. **Build and run containers**:

   ```sh
   docker-compose up --build
   ```

2. **Access the application**:

   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

3. **Stop the containers**:
   ```sh
   docker-compose down
   ```

## API Endpoints

AarthikNiti offers a comprehensive set of RESTful API endpoints:

### Authentication

- `POST /auth/signup` - User registration with email
- `POST /auth/complete-signup` - Complete registration with OTP
- `POST /auth/login` - User login
- `GET /auth/google` - Google OAuth login

### Profile Management

- `GET /profile/me` - Get user profile
- `PUT /profile/me` - Update user profile
- `GET /profile/statistics` - Get financial statistics

### Financial Operations

- `POST /profile/add_income` - Add income record
- `POST /profile/add_expense` - Add expense record
- `GET /profile/recent_transactions` - Get recent transactions
- `GET /profile/transactions/{transaction_id}` - Get transaction details

### Receipt Processing

- `POST /profile/upload_receipt` - Upload and process receipt image

## Testing

AarthikNiti includes a comprehensive test suite to ensure code quality and reliability.

### Running Tests

```bash
cd tests
./run_all_tests.sh
```

This will run all tests and save the results to a log file. For more details on testing, see the [tests/README.md](tests/README.md) file.

## Technologies

### Frontend

- React 19.0.0
- Tailwind CSS 4.0.14
- React Router DOM 7.3.0
- Recharts 2.15.1
- Axios for API calls

### Backend

- FastAPI 0.115.8
- Uvicorn 0.34.0
- MongoDB (Motor 3.7.0)
- PyJWT 2.10.1
- Google GenAI 1.13.0

### Development & Deployment

- Docker & Docker Compose
- Git
- Vercel (frontend hosting)

## Team & Contributors

AarthikNiti is developed by a team of skilled developers:

- **Rahul Dev Banjara** - Backend and Machine Learning Engineer
- **Shreeya Pandey** - Frontend Engineer
- **Diwash Adhikari** - Backend and Database Engineer
- **Prajwal Dahal** - Frontend Engineer

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit and push changes
4. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style and patterns
- Add appropriate tests for new features
- Update documentation when necessary
- Keep pull requests focused on a single feature/fix

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For issues or feature requests, open an issue on [GitHub](https://github.com/devrahulbanjara/AarthikNiti-Expense-Tracker/issues).

---

<div align="center">
  <p>Built with ❤️ by the AarthikNiti Team</p>
</div>
