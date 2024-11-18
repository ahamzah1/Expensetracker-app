import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ name: "", amount: "", date: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [error, setError] = useState("");

  const API_URL = `${process.env.REACT_APP_BACKEND}/expenses`
  const token = sessionStorage.getItem("token"); // Fetch the token from session storage

  // Axios instance with authorization header
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch expenses from the backend
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axiosInstance.get("/");
        setExpenses(response.data);
      } catch (error) {
        setError("Error fetching expenses. Please log in again.");
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, [axiosInstance]);

  // Add a new expense
  const handleAddExpense = async () => {
    if (newExpense.name && newExpense.amount && newExpense.date) {
      try {
        const response = await axiosInstance.post("/", {
          description: newExpense.name,
          amount: parseFloat(newExpense.amount),
          date: newExpense.date,
        });
        setExpenses([...expenses, response.data]);
        setNewExpense({ name: "", amount: "", date: "" });
      } catch (error) {
        setError("Error adding expense. Please try again.");
        console.error("Error adding expense:", error);
      }
    }
  };

  // Edit an existing expense
  const handleEditExpense = (expense) => {
    setIsEditing(true);
    setCurrentExpense(expense);
    setNewExpense({
      name: expense.description,
      amount: expense.amount,
      date: expense.date,
    });
  };

  const handleUpdateExpense = async () => {
    if (currentExpense && newExpense.name && newExpense.amount && newExpense.date) {
      try {
        const response = await axiosInstance.put(`/${currentExpense.id}`, {
          description: newExpense.name,
          amount: parseFloat(newExpense.amount),
          date: newExpense.date,
        });
        setExpenses(
          expenses.map((expense) =>
            expense.id === currentExpense.id ? response.data : expense
          )
        );
        setIsEditing(false);
        setNewExpense({ name: "", amount: "", date: "" });
        setCurrentExpense(null);
      } catch (error) {
        setError("Error updating expense. Please try again.");
        console.error("Error updating expense:", error);
      }
    }
  };

  // Delete an expense
  const handleDeleteExpense = async (id) => {
    try {
      await axiosInstance.delete(`/${id}`);
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch (error) {
      setError("Error deleting expense. Please try again.");
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <p>Manage your expenses below.</p>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* List of Expenses */}
      <h2>Expenses</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id} style={{ marginBottom: "10px" }}>
            <strong>{expense.description}</strong>: $
            {Number(expense.amount).toFixed(2)} on {expense.date}
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
        <input
          type="date"
          value={newExpense.date}
          onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
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
