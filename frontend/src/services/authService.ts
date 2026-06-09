import axios from "axios";
import type { User } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: User;
}

export const registerUser = async (
  email: string,
  password: string,
  name: string
): Promise<User | null> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, {
      email,
      password,
      name,
    });

    const data = response.data;

    if (data.access_token && data.user) {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("user_id", data.user.id);
      return data.user;
    }

    throw new Error("Registration failed");
  } catch (error: any) {
    if (error?.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("An unexpected error occurred");
  }
};

interface LoginResponse {
  access_token: string;
  token_type: string;
  user?: User;
}

export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/auth/login`,
      new URLSearchParams({ username: email, password }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = response.data;

    if (data.access_token && data.user) {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("user_id", data.user.id);
      return data.user;
    }

    throw new Error("Login failed");
  } catch (error: any) {
    if (error?.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const logoutUser = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("user_id");
};

export const getCurrentUser = (): User | null => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    // If parsing fails, clear the corrupted user data
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    return null;
  }
};

export const getCurrentUserId = (): string | null => {
  return localStorage.getItem("user_id");
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/refresh`, {}, {
      withCredentials: true,
    });

    const data = response.data;

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      return data.access_token;
    }

    return null;
  } catch {
    logoutUser();
    return null;
  }
};

export async function requestPasswordReset(email: string) {
  const response = await axios.post(`${API_URL}/auth/request-password-reset`, { email });
  return response.data;
}