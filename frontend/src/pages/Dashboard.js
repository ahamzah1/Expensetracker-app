import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ name: "", amount: "", date: "", category: "" });
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = `${process.env.REACT_APP_BACKEND}/expenses`;
  const token = sessionStorage.getItem("token");

  // Fetch expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching expenses. Please log in again.");
      }
    };
    fetchExpenses();
  }, [API_URL, token]);

  const categoryMapping = {
    Food: 1,
    Transport: 2,
    Rent: 3,
    Utilities: 4,
    Miscellaneous: 5,
  };

  // Add Expense
  const handleAddExpense = async () => {
    if (newExpense.name && newExpense.amount && newExpense.date && newExpense.category) {
      const categoryID = categoryMapping[newExpense.category]; // Map category name to ID
      if (!categoryID) {
        setError("Invalid category selected.");
        return;
      }

      try {
        const response = await axios.post(
          API_URL,
          {
            description: newExpense.name,
            amount: parseFloat(newExpense.amount),
            date: newExpense.date,
            category_id: categoryID, // Send the ID instead of the name
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setExpenses([...expenses, response.data]);
        setNewExpense({ name: "", amount: "", date: "", category: "" });
      } catch (error) {
        setError(error.response?.data?.message || "Error adding expense. Please try again.");
      }
    } else {
      setError("Please fill out all fields.");
    }
  };

  // Delete Expense
  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch (error) {
      setError(error.response?.data?.message || "Error deleting expense. Please try again.");
    }
  };

  // Filter expenses based on search term
  const filteredExpenses = expenses.filter((expense) =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total and monthly expenses
  const totalExpenses = expenses.reduce((acc, expense) => acc + (parseFloat(expense.amount) || 0), 0);
  const currentMonth = new Date().getMonth();
  const monthlyExpenses = expenses
    .filter((expense) => new Date(expense.date).getMonth() === currentMonth)
    .reduce((acc, expense) => acc + (parseFloat(expense.amount) || 0), 0);

  // Chart data for category breakdown
  const chartData = {
    labels: Object.keys(categoryMapping), // Display category names
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.keys(categoryMapping).map((categoryName) => {
          const categoryID = categoryMapping[categoryName];
          return expenses
            .filter((expense) => expense.category_id === categoryID)
            .reduce((acc, expense) => acc + parseFloat(expense.amount || 0), 0);
        }),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#4CAF50" }}>Expense Tracker Dashboard</h1>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {/* Summary */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h3>Total Expenses: ${totalExpenses.toFixed(2)}</h3>
        <h3>Monthly Expenses: ${monthlyExpenses.toFixed(2)}</h3>
      </div>

      {/* Chart */}
      <h2>Expense Overview</h2>
      {expenses.length > 0 ? (
        <div style={{ width: "100%", height: "400px" }}>
          <Bar data={chartData} />
        </div>
      ) : (
        <p>Loading chart...</p>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="Search expenses"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "10px",
          margin: "10px 0",
          width: "100%",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      {/* Expense List */}
      <h2>Expenses</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredExpenses.map((expense) => (
          <li key={expense.id} style={{ padding: "10px", border: "1px solid #ddd", marginBottom: "5px" }}>
            {expense.description} - ${expense.amount} - {expense.category} - {expense.date}
            <button onClick={() => handleDeleteExpense(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Add Expense Form */}
      <h2>Add Expense</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddExpense();
        }}
      >
        <input
          type="text"
          placeholder="Description"
          value={newExpense.name}
          onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
        />
        <input
          type="date"
          value={newExpense.date}
          onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
        />
        <select
          value={newExpense.category}
          onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {Object.keys(categoryMapping).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default Dashboard;
