import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase"; // Import your Firebase auth instance
import { onAuthStateChanged, User } from "firebase/auth";

export function useAuthStatus() {
  const [authStatus, setAuthStatus] = useState<{
    isLoading: boolean;
    user: User | null;
  }>({ isLoading: true, user: null });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthStatus({ isLoading: false, user });
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  return authStatus;
}
