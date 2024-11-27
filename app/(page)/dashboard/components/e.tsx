"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FinancialData {
  totalBalance: number;
  income: number;
  expenses: number;
  savings: number;
  recentTransactions: {
    id: number;
    description: string;
    amount: number;
    date: string;
  }[];
}

export default function FinancialDataForm() {
  const [financialData, setFinancialData] = useState<FinancialData>({
    totalBalance: 0,
    income: 0,
    expenses: 0,
    savings: 0,
    recentTransactions: [],
  });

  const [transaction, setTransaction] = useState({
    description: "",
    amount: "",
    date: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFinancialData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleTransactionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTransaction = () => {
    setFinancialData((prev) => ({
      ...prev,
      recentTransactions: [
        ...prev.recentTransactions,
        {
          id: prev.recentTransactions.length + 1,
          description: transaction.description,
          amount: parseFloat(transaction.amount),
          date: transaction.date,
        },
      ],
    }));

    // Clear transaction input fields
    setTransaction({
      description: "",
      amount: "",
      date: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter Financial Data</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <Label htmlFor="totalBalance">Total Balance</Label>
            <Input
              type="number"
              name="totalBalance"
              value={financialData.totalBalance}
              onChange={handleInputChange}
              placeholder="Enter total balance"
            />
          </div>
          <div>
            <Label htmlFor="income">Income</Label>
            <Input
              type="number"
              name="income"
              value={financialData.income}
              onChange={handleInputChange}
              placeholder="Enter income"
            />
          </div>
          <div>
            <Label htmlFor="expenses">Expenses</Label>
            <Input
              type="number"
              name="expenses"
              value={financialData.expenses}
              onChange={handleInputChange}
              placeholder="Enter expenses"
            />
          </div>
          <div>
            <Label htmlFor="savings">Savings</Label>
            <Input
              type="number"
              name="savings"
              value={financialData.savings}
              onChange={handleInputChange}
              placeholder="Enter savings"
            />
          </div>
          <div>
            <Label htmlFor="description">Transaction Description</Label>
            <Input
              type="text"
              name="description"
              value={transaction.description}
              onChange={handleTransactionChange}
              placeholder="Enter transaction description"
            />
          </div>
          <div>
            <Label htmlFor="amount">Transaction Amount</Label>
            <Input
              type="number"
              name="amount"
              value={transaction.amount}
              onChange={handleTransactionChange}
              placeholder="Enter transaction amount"
            />
          </div>
          <div>
            <Label htmlFor="date">Transaction Date</Label>
            <Input
              type="date"
              name="date"
              value={transaction.date}
              onChange={handleTransactionChange}
            />
          </div>
          <Button onClick={handleAddTransaction} type="button">
            Add Transaction
          </Button>
        </form>
      </CardContent>

      {/* Display Financial Data */}
      <CardContent>
        <div>
          <h3>Total Balance: ${financialData.totalBalance.toLocaleString()}</h3>
          <h3>Income: ${financialData.income.toLocaleString()}</h3>
          <h3>Expenses: ${financialData.expenses.toLocaleString()}</h3>
          <h3>Savings: ${financialData.savings.toLocaleString()}</h3>
        </div>

        <h3 className="mt-4">Recent Transactions</h3>
        <ul>
          {financialData.recentTransactions.map((tx) => (
            <li key={tx.id}>
              {tx.description} - ${tx.amount.toFixed(2)} on {tx.date}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
