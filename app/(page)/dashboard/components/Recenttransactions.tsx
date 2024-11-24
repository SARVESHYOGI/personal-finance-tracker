"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const recentTransactions = [
  {
    id: 1,
    description: "Grocery Shopping",
    amount: -120.5,
    date: "2023-06-01",
  },
  { id: 2, description: "Salary Deposit", amount: 3000, date: "2023-05-31" },
  { id: 3, description: "Electric Bill", amount: -85.2, date: "2023-05-29" },
  { id: 4, description: "Online Purchase", amount: -65.99, date: "2023-05-28" },
  {
    id: 5,
    description: "Restaurant Dinner",
    amount: -45.8,
    date: "2023-05-27",
  },
];

export default function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.description}</TableCell>
                <TableCell
                  className={
                    transaction.amount > 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  ${Math.abs(transaction.amount).toFixed(2)}
                </TableCell>
                <TableCell>{transaction.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
