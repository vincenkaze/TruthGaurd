import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info("You have been logged out.");
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <span className="fw-bold">TruthGuard</span>
        </Link>

        <div className="d-flex">
          {isAuthenticated ? (
            <div className="position-relative">
              <button
                onClick={() => setShowDropdown(prev => !prev)}
                className="btn btn-outline-light dropdown-toggle"
              >
                <i className="bi bi-person-circle me-1"></i>
                {user?.name || "Account"}
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="dropdown-menu show position-absolute end-0 mt-2 shadow"
                    style={{ zIndex: 1000 }}
                  >
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-outline-light">Login</Link>
              <Link to="/signup" className="btn btn-light">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}