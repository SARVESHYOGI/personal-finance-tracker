"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import useSWR from "swr";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";

// const datare = [
//   { name: "Housing", value: 1200 },
//   { name: "Food", value: 500 },
//   { name: "Transportation", value: 300 },
//   { name: "Utilities", valuae: 200 },
//   { name: "Entertainment", value: 150 },
//   { name: "Others", value: 450 },
// ];

const fetcher = async (path: string) => {
  const docRef = doc(db, path);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw new Error("Document not found");
  }
};
const fetcher1 = async (path: string) => {
  const docRef = doc(db, path);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw new Error("Document not found");
  }
};
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
];
type ExpenseItem = {
  name: string;
  value: number;
};
export default function ExpenseBreakdown() {
  const [selectedOption, setSelectedOption] = useState("2024");

  // Handle option change
  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };
  const { user } = useAuth();
  const { data, error, isLoading } = useSWR(
    `users/${user?.uid}/expensesData/${selectedOption}`,
    fetcher
  );
  const {
    data: data1,
    error: error1,
    isLoading: isLoading1,
  } = useSWR(`users/${user?.uid}/expensesData/`, fetcher1);
  console.log(data1);
  const years = [2022, 2025, 2024];
  console.log(data?.items);
  const datare = data?.items;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
      </CardHeader>
      <div>
        <select value={selectedOption} onChange={handleOptionChange}>
          {years.map((year) => {
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>

        <p>Selected Option: {selectedOption}</p>
      </div>

      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data?.items}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data?.items.map((_: ExpenseItem, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
