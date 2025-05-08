import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import ForgotPassword from "./pages/Auth/Forgotpassword";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import Reports from "./pages/Dashboard/Reports";
import Settings from "./pages/Dashboard/settings";
import ProfilePage from "./pages/Profile/ProfilePage";
import Layout from "./components/Layout/Layout";
import LandingPage from "./pages/Landing/LandingPage";
import IncomeVsExpensesChart from "./components/Dashboard/income-expenses-chart";
import {
  ProtectedRoute,
  PublicRoute,
} from "./components/ProtectedRoute/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ReloadProvider } from "./context/ReloadContext";
import { CurrencyProvider } from "./context/CurrencyContext";

// Main App Router Content
const AppRoutes = () => {
  return (
    <Routes>
      {/* Root Route with Authentication Check */}
      <Route path="/" element={<RootRoute />} />

      {/* Auth Routes - With Layout */}
      <Route element={<Layout />}>
        <Route
          path="/login"
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
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
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
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

// The RootRoute also uses the PublicRoute to redirect based on auth status
const RootRoute = () => {
  return (
    <PublicRoute>
      <LandingPage />
    </PublicRoute>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <CurrencyProvider>
            <ReloadProvider>
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
              <AppRoutes />
            </ReloadProvider>
          </CurrencyProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
