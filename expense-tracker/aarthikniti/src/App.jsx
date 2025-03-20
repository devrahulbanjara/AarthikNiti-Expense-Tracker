import React from 'react'

import{
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Income from './pages/Dashboard/Income';
import Expense from './pages/Dashboard/Expense';
import ForgotPassword from './pages/Auth/forgotpassword';
import DashboardPage from './pages/Dashboard/DashboardPage';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Root />} />
          <Route path='/login' exact element={<Login />} />
          <Route path='/signup' exact element={<Signup />} />
          <Route path='/dashboard' exact element={<DashboardPage />} />
          <Route path='/income' exact element={<Income />} />
          <Route path='/expense' exact element={<Expense />} />
          <Route path='/forgotpw' exact element={<ForgotPassword/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? (
    <Navigate to= "/dashboard" />
  ) : (
    <Navigate to= "/login" />
  );
};