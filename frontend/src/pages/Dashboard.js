import React, { useState } from "react";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([
    { id: 1, name: "Groceries", amount: 50 },
    { id: 2, name: "Utilities", amount: 75 },
  ]); // Initial list of expenses
  const [newExpense, setNewExpense] = useState({ name: "", amount: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);

  // Add a new expense
  const handleAddExpense = () => {
    if (newExpense.name && newExpense.amount) {
      setExpenses([
        ...expenses,
        { id: Date.now(), name: newExpense.name, amount: parseFloat(newExpense.amount) },
      ]);
      setNewExpense({ name: "", amount: "" });
    }
  };

  // Edit an existing expense
  const handleEditExpense = (expense) => {
    setIsEditing(true);
    setCurrentExpense(expense);
    setNewExpense({ name: expense.name, amount: expense.amount });
  };

  const handleUpdateExpense = () => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === currentExpense.id
          ? { ...expense, name: newExpense.name, amount: parseFloat(newExpense.amount) }
          : expense
      )
    );
    setIsEditing(false);
    setNewExpense({ name: "", amount: "" });
    setCurrentExpense(null);
  };

  // Delete an expense
  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <p>Manage your expenses below.</p>

      {/* List of Expenses */}
      <h2>Expenses</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id} style={{ marginBottom: "10px" }}>
            <strong>{expense.name}</strong>: ${expense.amount.toFixed(2)}
            <button onClick={() => handleEditExpense(expense)} style={{ marginLeft: "10px" }}>
              Edit
            </button>
            <button onClick={() => handleDeleteExpense(expense.id)} style={{ marginLeft: "5px" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Add or Edit Expense Form */}
      <h2>{isEditing ? "Edit Expense" : "Add Expense"}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          isEditing ? handleUpdateExpense() : handleAddExpense();
        }}
      >
        <input
          type="text"
          placeholder="Expense Name"
          value={newExpense.name}
          onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          required
          style={{ marginLeft: "5px" }}
        />
        <button type="submit" style={{ marginLeft: "10px" }}>
          {isEditing ? "Update" : "Add"}
        </button>
      </form>
    </div>
  );
};

export default Dashboard;
