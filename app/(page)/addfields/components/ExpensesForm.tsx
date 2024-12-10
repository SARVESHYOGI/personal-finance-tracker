"use client";

import React, { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";

import { db } from "@/lib/firebase"; // Adjust the import path if necessary
import { useAuth } from "@/context/AuthContext"; // Custom hook to get the logged-in user
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export interface ExpensesItem {
  name: string;
  value: number;
}

export interface Expenses {
  year: number;
  totalExpenses: number;
  items: ExpensesItem[];
}

const initialData: Expenses = {
  year: new Date().getFullYear(),
  totalExpenses: 3000, // Example total expenses
  items: [
    { name: "Housing", value: 1200 },
    { name: "Food", value: 500 },
    { name: "Transportation", value: 300 },
    { name: "Utilities", value: 200 },
    { name: "Entertainment", value: 150 },
    { name: "Others", value: 450 },
  ],
};

export default function ExpensesForm() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expenses>(initialData);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const fetchexpenses = async (user: { uid: string } | undefined) => {
    if (user) {
      try {
        const userRef1 = doc(
          db,
          `users/${user.uid}/expensesData`,
          `${expenses.year}`
        );
        const userRef2 = doc(db, `users/${user.uid}/financialData`, "data");

        const docSnap1 = await getDoc(userRef1);
        const docSnap2 = await getDoc(userRef2);

        if (docSnap2.exists()) {
          const data = docSnap2.data();
          // console.log(data.expenses);
          setTotalExpenses(data.expenses);
          updateDoc(userRef1, { totalExpenses: data.expenses });
          setExpenses({ ...expenses, totalExpenses: data.expenses });
        } else {
          console.warn("No financial data found, initializing with defaults.");
          setTotalExpenses(1111110);
        }
        if (docSnap1.exists()) {
          const data = docSnap1.data() as Expenses;
          // console.log(data.totalExpenses, "total expenses");
        } else {
          console.warn("No expenses data found, initializing with defaults.");
          setExpenses({
            year: new Date().getFullYear(),
            totalExpenses: 9999, // Default value if not found in Firestore
            items: [
              { name: "Housing", value: 1200 },
              { name: "Food", value: 500 },
              { name: "Transportation", value: 300 },
              { name: "Utilities", value: 200 },
              { name: "Entertainment", value: 150 },
              { name: "Others", value: 450 },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching expenses data:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    if (user) {
      fetchexpenses(user);
    }
  }, [user]);

  const handleValueChange = (index: number, value: string) => {
    const updatedItems = [...expenses.items];
    updatedItems[index].value = parseFloat(value) || 0;
    setExpenses({ ...expenses, items: updatedItems });
    const newTotal = updatedItems.reduce((sum, item) => sum + item.value, 0);
    if (newTotal != totalExpenses) {
      setFormError(
        `Error: Total expenses cannot be less than the sum of individual expenses ($${newTotal}).`
      );
      return;
    }
    setExpenses({ ...expenses, items: updatedItems, totalExpenses: newTotal });
  };

  const handleYearChange = (value: string) => {
    setExpenses({ ...expenses, year: parseInt(value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const totalExpenses = expenses.items.reduce(
      (sum, item) => sum + item.value,
      0
    );

    if (expenses.totalExpenses !== totalExpenses) {
      setFormError(
        `Error: Total expenses ($${totalExpenses}) exceed the expenses ($${expenses.totalExpenses}).`
      );
      return;
    }

    setFormError(null); // Clear previous errors

    if (user) {
      try {
        const userRef = doc(
          db,
          `users/${user.uid}/expensesData`,
          `${expenses.year}`
        );
        await setDoc(userRef, expenses);
        alert("expenses data saved successfully!");
      } catch (error) {
        console.error("Error saving data: ", error);
        alert("Failed to save data.");
      }
    }
  };
  let sum = 0;

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Expenses Form</CardTitle>
        <CardDescription>
          Enter your expense values for the selected month and year
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {formError && <p className="text-red-500 text-sm">{formError}</p>}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <Label htmlFor="expenses-year">Year</Label>
              <Input
                id="expenses-year"
                type="number"
                value={expenses.year}
                onChange={(e) => handleYearChange(e.target.value)}
                min={1900}
                max={2100}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="total-expenses">Total Expenses</Label>
            <Input
              id="total-expenses"
              type="number"
              value={totalExpenses}
              readOnly
            />
          </div>
          {expenses.items.map((item, index) => {
            sum += item.value;
            if (sum > totalExpenses) {
              return (
                <div key={index} className="flex items-center space-x-4">
                  <Label
                    htmlFor={`item-value-${index}`}
                    className="w-1/3 text-right"
                  >
                    {item.name}
                  </Label>
                  <Input
                    id={`item-value-${index}`}
                    type="number"
                    value={item.value}
                    onChange={(e) => handleValueChange(index, e.target.value)}
                    required
                    className="w-2/3"
                    aria-label={`Value for ${item.name}`}
                    style={{ borderColor: "red" }}
                  />
                </div>
              );
            }
            return (
              <div key={index} className="flex items-center space-x-4">
                <Label
                  htmlFor={`item-value-${index}`}
                  className="w-1/3 text-right"
                >
                  {item.name}
                </Label>
                <Input
                  id={`item-value-${index}`}
                  type="number"
                  value={item.value}
                  onChange={(e) => handleValueChange(index, e.target.value)}
                  required
                  className="w-2/3"
                  aria-label={`Value for ${item.name}`}
                />
              </div>
            );
          })}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">Submit</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
