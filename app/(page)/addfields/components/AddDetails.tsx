"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddDetails() {
  const { user } = useAuth();
  const { year, setYear } = useAuth();
  const [financialData, setFinancialData] = useState({
    income: 0,
    expenses: 0,
    savings: 0,
    totalBalance: 0,
  });

  // Fetch  from Firestore
  useEffect(() => {
    const fetchFinancialData = async () => {
      if (!user?.uid) {
        console.log("User is not authenticated.");
        return;
      }

      if (!year) {
        console.log("Year is not set. Cannot fetch financial data.");
        return;
      }

      try {
        const userRef = doc(db, `users/${user.uid}/${year}/financialData`);
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
    };

    fetchFinancialData();
  }, [user, year]);

  //  calculatation total balance
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

  const handleSave = async () => {
    if (!user?.uid) {
      alert("User is not authenticated. Please log in.");
      return;
    }

    if (!year) {
      alert("Invalid year. Please select a valid year.");
      return;
    }

    if (!financialData || typeof financialData !== "object") {
      alert("Invalid financial data. Please check your input.");
      return;
    }

    try {
      const userRef = doc(db, `users/${user.uid}/${year}`, "financialData");
      await setDoc(userRef, financialData, { merge: true });
      alert("Financial data updated successfully!");
    } catch (error) {
      console.error("Error saving data: ", error);
      if (error instanceof Error) {
        alert(`Failed to save data: ${error.message}`);
      } else {
        alert("Failed to save data: An unknown error occurred.");
      }
    }
  };

  return (
    <>
      <div>
        <div className="m-10">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Years</SelectLabel>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {year && (
          <p className="mt-4 text-sm text-gray-500">
            You selected: <span className="font-medium">{year}</span>
          </p>
        )}
      </div>
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
    </>
  );
}
