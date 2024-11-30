"use client";

import React, { useState } from "react";
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
import { doc, setDoc } from "firebase/firestore";

export interface BudgetItem {
  name: string;
  value: number;
}

export interface Budget {
  month: number;
  year: number;
  items: BudgetItem[];
}

const initialData: Budget = {
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
  items: [
    { name: "Housing", value: 1200 },
    { name: "Food", value: 500 },
    { name: "Transportation", value: 300 },
    { name: "Utilities", value: 200 },
    { name: "Entertainment", value: 150 },
    { name: "Others", value: 450 },
  ],
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function ExpensesForm() {
  const { user } = useAuth();
  const [expensesData, setexpensesData] = useState<Budget>(initialData);

  const handleValueChange = (index: number, value: string) => {
    const updatedItems = [...expensesData.items];
    updatedItems[index].value = parseFloat(value) || 0;
    setexpensesData({ ...expensesData, items: updatedItems });
  };

  const handleMonthChange = (value: string) => {
    setexpensesData({ ...expensesData, month: parseInt(value) });
  };

  const handleYearChange = (value: string) => {
    setexpensesData({ ...expensesData, year: parseInt(value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("User not authenticated.");
      return;
    }

    console.log("Submitted budget:", expensesData);

    try {
      const userRef = doc(db, `users/${user.uid}/expensesData`, "data");
      await setDoc(userRef, expensesData);
      alert("Financial data updated successfully!");
    } catch (error) {
      console.error("Error saving data: ", error);
      alert("Failed to save data.");
    }
  };

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Budget Form</CardTitle>
        <CardDescription>
          Enter your budget values for the selected month and year
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="w-1/2">
              <Label htmlFor="budget-month">Month</Label>
              <Select
                value={expensesData.month.toString()}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger id="budget-month">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2">
              <Label htmlFor="budget-year">Year</Label>
              <Input
                id="budget-year"
                type="number"
                value={expensesData.year}
                onChange={(e) => handleYearChange(e.target.value)}
                min={1900}
                max={2100}
              />
            </div>
          </div>

          {expensesData.items.map((item, index) => (
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
          ))}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">Submit</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
