import AddDetails from "./components/AddDetails";
import ExpensesForm from "./components/ExpensesForm";
import SavingGoals from "./components/SavingGoal";

function page() {
  return (
    <div>
      <AddDetails />
      <ExpensesForm />
      <SavingGoals />
    </div>
  );
}

export default page;
