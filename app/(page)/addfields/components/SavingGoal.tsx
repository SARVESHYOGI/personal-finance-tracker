"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SavingGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export default function SavingGoals() {
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalAmount, setNewGoalAmount] = useState("");

  const addGoal = () => {
    if (newGoalName && newGoalAmount) {
      const newGoal: SavingGoal = {
        id: Date.now(),
        name: newGoalName,
        targetAmount: Number.parseFloat(newGoalAmount),
        currentAmount: 0,
      };
      setGoals([...goals, newGoal]);
      setNewGoalName("");
      setNewGoalAmount("");
    }
  };

  const updateGoalProgress = (id: number, amount: number) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id
          ? { ...goal, currentAmount: goal.currentAmount + amount }
          : goal
      )
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Saving Goal</CardTitle>
          <CardDescription>
            Set a new financial goal to work towards.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Goal Name"
            value={newGoalName}
            onChange={(e) => setNewGoalName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Target Amount"
            value={newGoalAmount}
            onChange={(e) => setNewGoalAmount(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={addGoal}>
            <Plus className="mr-2 h-4 w-4" /> Add Goal
          </Button>
        </CardFooter>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader>
              <CardTitle>{goal.name}</CardTitle>
              <CardDescription>
                Target: ${goal.targetAmount.toFixed(2)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress
                value={(goal.currentAmount / goal.targetAmount) * 100}
              />
              <p className="text-sm text-muted-foreground">
                Current: ${goal.currentAmount.toFixed(2)} (
                {((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}
                %)
              </p>
              <Input
                type="number"
                placeholder="Add amount"
                onChange={(e) =>
                  updateGoalProgress(goal.id, Number.parseFloat(e.target.value))
                }
              />
            </CardContent>
            <CardFooter>
              <Button onClick={() => updateGoalProgress(goal.id, 0)}>
                Update Progress
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
