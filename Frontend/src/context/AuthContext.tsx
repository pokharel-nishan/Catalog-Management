import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

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

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        const userData: AuthUser = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("authUser");
      }
    }
  }, []);

  const login = (userData: Partial<AuthUser>) => {
    if (!userData.token) {
      console.error("No token provided in user data");
      throw new Error("Authentication token is required");
    }

    // Ensure all required fields are present, or throw an error
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
    localStorage.setItem("authUser", JSON.stringify(completeUserData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
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
