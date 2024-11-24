"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function SavingsGoal() {
  const goal = 10000;
  const current = 7500;

  const percentage = (current / goal) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={percentage} className="w-full" />
          <div className="flex justify-between text-sm">
            <span>Current: ${current.toLocaleString()}</span>
            <span>Goal: ${goal.toLocaleString()}</span>
          </div>
          <p className="text-center text-lg font-semibold">
            {percentage.toFixed(1)}% of goal reached
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
