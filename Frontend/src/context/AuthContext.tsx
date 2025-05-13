import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

type UserRole = "Admin" | "Staff" | "Regular";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  token: string;
  address?: string;
}

interface DecodedToken {
  exp: number;
  sub?: string;
  nameid?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (userData: Partial<AuthUser>) => void;
  logout: () => void;
  isAdmin: boolean;
  isStaff: boolean;
  isUser: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAdmin: false,
  isStaff: false,
  isUser: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Validate token by checking its expiration
  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: DecodedToken = jwtDecode(token); // Use named export
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      console.log("Token expiration on load (exp):", decoded.exp, "Current time:", currentTime); // Debug
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token on load:", error);
      return true; // Treat as expired if decoding fails
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        const userData: AuthUser = JSON.parse(storedUser);
        if (!userData.token) {
          console.log("No token found in stored user data. Logging out.");
          localStorage.removeItem('authUser');
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          setUser(null);
          return;
        }

        // Validate the token by checking expiration
        if (isTokenExpired(userData.token)) {
          console.log("Token expired on load. Logging out.");
          localStorage.removeItem('authUser');
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          setUser(null);
        } else {
          setUser(userData);
          // Ensure token is in localStorage or sessionStorage for apiClient
          if (!localStorage.getItem('token') && !sessionStorage.getItem('token')) {
            localStorage.setItem('token', userData.token);
          }
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('authUser');
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  const login = (userData: Partial<AuthUser>) => {
    if (!userData.token) {
      console.error("No token provided in user data");
      throw new Error("Authentication token is required");
    }

    const completeUserData: AuthUser = {
      id: userData.id ?? "",
      name: userData.name ?? "",
      email: userData.email ?? "",
      role: userData.role ?? "Regular",
      token: userData.token,
      avatarUrl: userData.avatarUrl,
      address: userData.address,
    };


    setUser(completeUserData);
    localStorage.setItem('authUser', JSON.stringify(completeUserData));
    localStorage.setItem('token', completeUserData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAdmin: user?.role === "Admin",
    isStaff: user?.role === "Staff",
    isUser: user?.role === "Regular",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
