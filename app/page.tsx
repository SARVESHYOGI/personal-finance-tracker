"use client";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      {user && <p>Logged in as: {user.email}</p>}
    </div>
  );
}
