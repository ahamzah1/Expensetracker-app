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
import "../styles/Dashboard.css"; // External CSS file

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: "",
    date: "",
    category: "",
    notification_period: "",
  });
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null); // Track the expense being edited

  const API_URL = "http://localhost:8080/api/expenses";
  const token = sessionStorage.getItem("token");

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

  const handleAddExpense = async () => {
    if (
      newExpense.name &&
      newExpense.amount &&
      newExpense.date &&
      newExpense.category &&
      newExpense.notification_period
    ) {
      const categoryID = categoryMapping[newExpense.category];
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
            categoryId: categoryID, // Use categoryId
            notificationPeriod: parseFloat(newExpense.notification_period),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setExpenses([...expenses, response.data]);
        setNewExpense({
          name: "",
          amount: "",
          date: "",
          category: "",
          notification_period: "",
        });
        setShowModal(false);
      } catch (error) {
        setError(error.response?.data?.message || "Error adding expense. Please try again.");
      }
    } else {
      setError("Please fill out all fields.");
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense); // Set the expense to be edited
    setNewExpense({
      name: expense.description,
      amount: expense.amount,
      date: expense.date,
      category: Object.keys(categoryMapping).find(
        (key) => categoryMapping[key] === expense.categoryId // Use categoryId
      ),
      notification_period: expense.notificationPeriod,
    });
    setShowModal(true); // Open the modal
  };

  const handleUpdateExpense = async () => {
    if (
      newExpense.name &&
      newExpense.amount &&
      newExpense.date &&
      newExpense.category &&
      newExpense.notification_period
    ) {
      const categoryID = categoryMapping[newExpense.category];
      if (!categoryID) {
        setError("Invalid category selected.");
        return;
      }

      try {
        const response = await axios.put(
          `${API_URL}/${editingExpense.id}`,
          {
            description: newExpense.name,
            amount: parseFloat(newExpense.amount),
            date: newExpense.date,
            categoryId: categoryID, // Use categoryId
            notificationPeriod: parseFloat(newExpense.notification_period),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Update the expenses list
        setExpenses(
          expenses.map((expense) =>
            expense.id === editingExpense.id ? response.data : expense
          )
        );

        // Reset the form and close the modal
        setNewExpense({
          name: "",
          amount: "",
          date: "",
          category: "",
          notification_period: "",
        });
        setEditingExpense(null);
        setShowModal(false);
      } catch (error) {
        setError(error.response?.data?.message || "Error updating expense. Please try again.");
      }
    } else {
      setError("Please fill out all fields.");
    }
  };

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

  const filteredExpenses = expenses.filter((expense) =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExpenses = expenses.reduce((acc, expense) => acc + (parseFloat(expense.amount) || 0), 0);
  const currentMonth = new Date().getMonth();
  const monthlyExpenses = expenses
    .filter((expense) => new Date(expense.date).getMonth() === currentMonth)
    .reduce((acc, expense) => acc + (parseFloat(expense.amount) || 0), 0);

  const chartData = {
    labels: Object.keys(categoryMapping), // Use category names as labels
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.keys(categoryMapping).map((categoryName) => {
          const categoryID = categoryMapping[categoryName];
          // Filter expenses by category and sum their amounts
          return expenses
            .filter((expense) => expense.categoryId === categoryID) // Use categoryId
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

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h3>Total Expenses: ${totalExpenses.toFixed(2)}</h3>
        <h3>Monthly Expenses: ${monthlyExpenses.toFixed(2)}</h3>
      </div>

      <h2>Expense Overview</h2>
      {expenses.length > 0 ? (
        <div style={{ width: "100%", height: "400px" }}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Expenses by Category",
                },
              },
            }}
          />
        </div>
      ) : (
        <p>Loading chart...</p>
      )}

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

      <h2>Expenses</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredExpenses.map((expense) => (
          <li
            key={expense.id}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              marginBottom: "5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>{expense.description}</strong> - ${expense.amount} - {expense.date}
            </div>
            <div>
              <button
                style={{ marginRight: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px" }}
                onClick={() => handleEditExpense(expense)}
              >
                Edit
              </button>
              <button
                style={{ backgroundColor: "#f44336", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px" }}
                onClick={() => handleDeleteExpense(expense.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        style={{
          position: "absolute",
          top: "70px",
          right: "20px",
          borderRadius: "50%",
          backgroundColor: "#4CAF50",
          color: "white",
          fontSize: "20px",
          width: "50px",
          height: "50px",
          border: "none",
        }}
        onClick={() => setShowModal(true)}
      >
        +
      </button>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            animation: "fadeIn 0.3s ease-in-out",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "15px",
              width: "400px",
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            <h2 style={{ marginBottom: "20px", color: "#4CAF50" }}>
              {editingExpense ? "Edit Expense" : "Add Expense"}
            </h2>
            <input
              type="text"
              placeholder="Description"
              value={newExpense.name}
              onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
              style={{
                padding: "10px",
                marginBottom: "10px",
                width: "100%",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            />
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              style={{
                padding: "10px",
                marginBottom: "10px",
                width: "100%",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            />
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              style={{
                padding: "10px",
                marginBottom: "10px",
                width: "100%",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            />
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              style={{
                padding: "10px",
                marginBottom: "10px",
                width: "100%",
                borderRadius: "5px",
                border: "1px solid #ddd",
                backgroundColor: "#f9f9f9",
              }}
            >
              <option value="">Select Category</option>
              {Object.keys(categoryMapping).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Notification Period (days)"
              value={newExpense.notification_period}
              onChange={(e) => setNewExpense({ ...newExpense, notification_period: e.target.value })}
              style={{
                padding: "10px",
                marginBottom: "20px",
                width: "100%",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={editingExpense ? handleUpdateExpense : handleAddExpense}
                style={{
                  padding: "10px 20px",
                  borderRadius: "5px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
              >
                {editingExpense ? "Update" : "Save"}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingExpense(null);
                  setNewExpense({
                    name: "",
                    amount: "",
                    date: "",
                    category: "",
                    notification_period: "",
                  });
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "5px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#d32f2f")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#f44336")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;