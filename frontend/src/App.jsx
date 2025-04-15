import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import ForgotPassword from "./pages/Auth/Forgotpassword";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import Reports from "./pages/Dashboard/Reports";
import Budgeting from "./pages/Dashboard/Budgeting";
import Layout from "./components/Layout/Layout";
import IncomeVsExpensesChart from "./components/Dashboard/income-expenses-chart";
import {
  ProtectedRoute,
  PublicRoute,
} from "./components/ProtectedRoute/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme="light"
            transition={Bounce}
          />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route
                index
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/income"
                element={
                  <ProtectedRoute>
                    <Income />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/expenses"
                element={
                  <ProtectedRoute>
                    <Expense />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/income-vs-expenses"
                element={
                  <ProtectedRoute>
                    <IncomeVsExpensesChart />
                  </ProtectedRoute>
                }
              />
              <Route path="/forgotpw" element={<ForgotPassword />} />
            </Route>
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/budgeting"
              element={
                <ProtectedRoute>
                  <Budgeting />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
