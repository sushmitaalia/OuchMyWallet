import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

// Auth
export const registerUser = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, { username, password });
  return response.data;
};

export const loginUser = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { username, password });
  return response.data;
};

// Transactions
export const createTransaction = async (description, amount, date) => {
  const response = await axios.post(`${API_URL}/transactions/`, { description, amount, date }, authHeaders());
  return response.data;
};

export const getDailyTransactions = async (date) => {
  const response = await axios.get(`${API_URL}/transactions/daily/${date}`, authHeaders());
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await axios.delete(`${API_URL}/transactions/${id}`, authHeaders());
  return response.data;
};

export const getMonthlyTransactions = async (year, month) => {
  const response = await axios.get(`${API_URL}/transactions/monthly/${year}/${month}`, authHeaders());
  return response.data;
};

export const getYearlyTransactions = async (year) => {
  const response = await axios.get(`${API_URL}/transactions/yearly/${year}`, authHeaders());
  return response.data;
};