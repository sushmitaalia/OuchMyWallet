import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

// Add a transaction
export const createTransaction = async (description, amount, date) => {
  const response = await axios.post(`${API_URL}/transactions/`, {
    description,
    amount,
    date,
  });
  return response.data;
};

// Get transactions for a specific day
export const getDailyTransactions = async (date) => {
  const response = await axios.get(`${API_URL}/transactions/daily/${date}`);
  return response.data;
};

// Delete a transaction
export const deleteTransaction = async (id) => {
  const response = await axios.delete(`${API_URL}/transactions/${id}`);
  return response.data;
};

// Get monthly summary
export const getMonthlyTransactions = async (year, month) => {
  const response = await axios.get(`${API_URL}/transactions/monthly/${year}/${month}`);
  return response.data;
};

// Get yearly summary
export const getYearlyTransactions = async (year) => {
  const response = await axios.get(`${API_URL}/transactions/yearly/${year}`);
  return response.data;
};