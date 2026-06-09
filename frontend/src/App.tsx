import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

import HomePage from './pages/HomePage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProtectedRoute from './components/ProtectedRoute';
import SignUpModal from './components/modals/SignUpModal';
import LoginModal from './components/modals/LoginModal';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./styles/skin.css";

const App: React.FC = () => {
  const [showSignUp, setShowSignUp] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);

  return (
    <div className="app-container">
      <Navbar />
      <main className="app-content">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                setShowSignUp={setShowSignUp}
                setShowLogin={setShowLogin}
              />
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      
      {/* Modal portals */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToSignUp={() => {
            setShowLogin(false);
            setShowSignUp(true);
          }}
        />
      )}

      {showSignUp && (
        <SignUpModal
          onClose={() => setShowSignUp(false)}
          onSwitchToLogin={() => {
            setShowSignUp(false);
            setShowLogin(true);
          }}
        />
      )}
    </div>
  );
};

export default App;