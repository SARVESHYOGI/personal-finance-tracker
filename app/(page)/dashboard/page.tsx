"use client";
import { useAuth } from "@/context/AuthContext";
import ExpenseBreakdown from "./components/Expensebreakdown";
import FinancialOverview from "./components/Financial";
import RecentTransactions from "./components/Recenttransactions";
import SavingsGoal from "./components/Savingsgoal";

export default function DashboardPage() {
  const { year } = useAuth(); // Get the logged-in user
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* <AddFields /> */}
      <h1 className="text-3xl font-bold">Financial Dashboard {year}</h1>
      <FinancialOverview />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExpenseBreakdown />
        <SavingsGoal />
      </div>
      <RecentTransactions />
    </div>
  );
}
