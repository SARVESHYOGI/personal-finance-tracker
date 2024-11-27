"use client";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust the import path as necessary
import { useAuth } from "@/context/AuthContext"; // Custom hook to get logged-in user

export default function FinancialForm() {
  const { user } = useAuth(); // Assumes you have a user object with user.uid
  const [financialData, setFinancialData] = useState({
    totalBalance: 0,
    income: 0,
    expenses: 0,
    savings: 0,
  });

  // Fetch existing data from Firebase
  useEffect(() => {
    const fetchFinancialData = async () => {
      if (user) {
        const userRef = doc(db, `users/${user.uid}/financialData`, "data");
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setFinancialData(docSnap.data() as typeof financialData); // Populate the form with existing data
        }
      }
    };

    fetchFinancialData();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFinancialData({
      ...financialData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("User is not logged in.");
      return;
    }

    try {
      // Save or update financial data under `users/{uid}/financialData/data`
      const userRef = doc(db, `users/${user.uid}/financialData`, "data");
      await setDoc(userRef, financialData, { merge: true }); // Merge existing data with new data
      alert("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data: ", error);
      alert("Failed to save data.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-semibold text-gray-700 text-center">
        Financial Form
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Total Balance
          </label>
          <input
            type="number"
            name="totalBalance"
            value={financialData.totalBalance}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter total balance"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Income
          </label>
          <input
            type="number"
            name="income"
            value={financialData.income}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter income"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Expenses
          </label>
          <input
            type="number"
            name="expenses"
            value={financialData.expenses}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter expenses"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Savings
          </label>
          <input
            type="number"
            name="savings"
            value={financialData.savings}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter savings"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Save Data
      </button>
    </form>
  );
}
