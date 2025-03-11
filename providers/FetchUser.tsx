// File: contexts/UserContext.tsx
import React, { createContext, useContext } from "react";
import { GetServerSideProps } from "next";
import axios from "axios";

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log("getServerSideProps", context);
  try {
    const { accessToken } = context.req.cookies;
    console.log("accessToken", accessToken);
    if (!accessToken) {
      return { props: { user: null } };
    }

    const response = await axios.get("http://localhost:3001/users/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      props: {
        user: response.data,
      },
    };
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return { props: { user: null } };
  }
};

interface User {
  userId: string;
  username: string;
}

interface UserContextType {
  user: User | null;
}

export const UserProvider = ({ children, user }: { children: React.ReactNode; user: User | null }) => {
  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context.user;
};
