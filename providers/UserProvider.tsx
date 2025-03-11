"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: string;
  name?: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  accessToken: string | null;
  loading: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Thử lấy user với access token hiện tại
        const storedToken = localStorage.getItem("access_token");
        if (!storedToken) {
          setLoading(false);
          return;
        }

        setAccessToken(storedToken);

        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          // Nếu access token hết hạn, thử refresh
          // Refresh token được gửi tự động qua cookie
          const refreshResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            {},
            { withCredentials: true } // Quan trọng để gửi và nhận cookies
          );

          const { access_token } = refreshResponse.data;
          localStorage.setItem("access_token", access_token);
          setAccessToken(access_token);

          const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });
          setUser(userResponse.data);
        }
      } catch (error) {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem("access_token");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const logout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {}, { withCredentials: true });
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("access_token");
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        loading,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
