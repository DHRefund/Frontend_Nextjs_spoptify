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
  setUser: (user: User) => void;
  accessToken: string | null;
  loading: boolean;

  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Hàm để lưu tokens vào localStorage
  const saveTokens = (access: string, refresh: string) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    setAccessToken(access);
    setRefreshToken(refresh);
  };

  // Hàm để xóa tokens khỏi localStorage
  const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
    setRefreshToken(null);
  };

  // Hàm để refresh token
  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      if (!refreshToken) return null;

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        refreshToken,
      });

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

      saveTokens(newAccessToken, newRefreshToken);
      return newAccessToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      clearTokens();
      setUser(null);
      return null;
    }
  };

  // Thiết lập axios interceptor để tự động refresh token
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 và chưa thử refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const newToken = await refreshAccessToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshToken]);

  // Kiểm tra người dùng đã đăng nhập khi tải trang
  useEffect(() => {
    const initializeAuth = async () => {
      const storedAccessToken = localStorage.getItem("accessToken");
      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (storedAccessToken && storedRefreshToken) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);

        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${storedAccessToken}`,
            },
          });

          // Response từ /users/me sẽ trả về trực tiếp user data
          setUser(response.data);
        } catch (error) {
          // Nếu token hết hạn, thử refresh
          const newToken = await refreshAccessToken();

          if (newToken) {
            try {
              const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
                headers: {
                  Authorization: `Bearer ${newToken}`,
                },
              });

              // Response từ /users/me sẽ trả về trực tiếp user data
              setUser(response.data);
            } catch (error) {
              clearTokens();
              setUser(null);
            }
          } else {
            clearTokens();
            setUser(null);
          }
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Hàm đăng nhập

  // Hàm đăng ký

  // Hàm đăng xuất
  const logout = () => {
    clearTokens();
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        loading,

        logout,
        refreshAccessToken,
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
