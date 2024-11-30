"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust the import path if necessary
import { useAuth } from "@/context/AuthContext"; // Custom hook to get the logged-in user
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";

export default function AddDetails() {
  const { user } = useAuth(); // Get the logged-in user
  const [financialData, setFinancialData] = useState({
    income: 0,
    expenses: 0,
    savings: 0,
    totalBalance: 0, // This will be calculated
  });

  // Fetch financial data from Firestore
  useEffect(() => {
    const fetchFinancialData = async () => {
      if (user) {
        try {
          const userRef = doc(db, `users/${user.uid}/financialData`, "data");
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setFinancialData({
              income: data.income,
              expenses: data.expenses,
              savings: data.savings,
              totalBalance: calculateTotalBalance(
                data.income,
                data.expenses,
                data.savings
              ),
            });
          } else {
            console.log("No financial data found.");
          }
        } catch (error) {
          console.error("Error fetching financial data: ", error);
        }
      }
    };

    fetchFinancialData();
  }, [user]);

  // Function to calculate total balance dynamically
  const calculateTotalBalance = (
    income: number,
    expenses: number,
    savings: number
  ) => {
    return income + savings - expenses;
  };

  // Handle input changes and update the state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFinancialData((prev) => ({
      ...prev,
      [name]: Number(value),
      totalBalance: calculateTotalBalance(
        name === "income" ? Number(value) : prev.income,
        name === "expenses" ? Number(value) : prev.expenses,
        name === "savings" ? Number(value) : prev.savings
      ),
    }));
  };

  // Save updated data to Firestore
  const handleSave = async () => {
    if (user) {
      try {
        const userRef = doc(db, `users/${user.uid}/financialData`, "data");
        await setDoc(userRef, financialData);
        alert("Financial data updated successfully!");
      } catch (error) {
        console.error("Error saving data: ", error);
        alert("Failed to save data.");
      }
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${financialData.totalBalance.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <input
            type="number"
            name="income"
            value={financialData.income}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter income"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <input
            type="number"
            name="expenses"
            value={financialData.expenses}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter expenses"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Savings</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <input
            type="number"
            name="savings"
            value={financialData.savings}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter savings"
          />
        </CardContent>
      </Card>

      <button
        onClick={handleSave}
        className="mt-4 col-span-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Save Data
      </button>
    </div>
  );
}
