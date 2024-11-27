"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface UserData {
  balance: number;
  income: number;
  expense: number;
  saving: number;
  transaction: string;
}

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          } else {
            setError(
              "No user data found. Please add your financial information."
            );
          }
        } else {
          setError(
            "User is not logged in. Please log in to view your dashboard."
          );
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(
          "An error occurred while fetching your data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-3/4" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-6 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="w-full max-w-2xl mx-auto">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Financial Dashboard</CardTitle>
        <CardDescription>Your current financial overview</CardDescription>
      </CardHeader>
      <CardContent>
        {userData && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Balance:</span>
              <span className="text-2xl font-bold">
                ${userData.balance.toFixed(2)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-100 p-4 rounded-lg">
                <span className="block text-sm text-green-800">Income</span>
                <span className="block text-xl font-semibold text-green-600">
                  ${userData.income.toFixed(2)}
                </span>
              </div>
              <div className="bg-red-100 p-4 rounded-lg">
                <span className="block text-sm text-red-800">Expense</span>
                <span className="block text-xl font-semibold text-red-600">
                  ${userData.expense.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <span className="block text-sm text-blue-800">Savings</span>
              <span className="block text-xl font-semibold text-blue-600">
                ${userData.saving.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="block text-sm font-medium mb-1">
                Recent Transaction
              </span>
              <span className="block p-2 bg-gray-100 rounded">
                {userData.transaction}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
