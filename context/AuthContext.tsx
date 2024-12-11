"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Adjust the import path

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null; // Current logged-in user
  isLoading: boolean; // State to track if the auth is loading
  logout: () => Promise<void>; // Function to handle logout
  year: string;
  setYear: (year: string) => void;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to provide context to the entire app
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null); // State to store the user object
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [year, setYear] = useState(""); // State to store the selected year

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false); // Set loading state to false once we have the user info
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Function to log out the current user
  const logout = async () => {
    try {
      await signOut(auth); // Logs out from Firebase
      setUser(null); // Reset user to null on logout
    } catch (error) {
      console.error("Error during logout: ", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, year, setYear }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to consume the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
