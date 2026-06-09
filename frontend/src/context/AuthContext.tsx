import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { User } from "../types";
import {
  getCurrentUser,
  registerUser,
  loginUser,
  logoutUser as serviceLogoutUser,
} from "../services/authService";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // On mount, load user from localStorage
  useEffect(() => {
    const storedUser = getCurrentUser();
    setUser(storedUser);
    setLoading(false);
  }, []);

  // Async login using your loginUser service
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await loginUser(email, password);
      setUser(userData);
    } finally {
      setLoading(false);
    }
  };


  // Async signup using your registerUser service
  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const userData = await registerUser(email, password, name);
      if (!userData) throw new Error("User registration failed");
      setUser(userData);
      // localStorage is already set in registerUser
    } finally {
      setLoading(false);
    }
  };

  // Logout: clear state, localStorage, and redirect
  const logout = () => {
    setUser(null);
    serviceLogoutUser(); // clears localStorage
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        signup,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}