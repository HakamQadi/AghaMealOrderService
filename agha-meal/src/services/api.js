import axios from "axios";
import { API_URL } from "@env";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// // Request interceptor for adding auth tokens if needed
// api.interceptors.request.use(
//   (config) => {
//     // Add auth token if available
//     // const token = await AsyncStorage.getItem('authToken')
//     // if (token) {
//     //   config.headers.Authorization = `Bearer ${token}`
//     // }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API functions
export const login = async (data) => {

  try {
    const response = await api.post("/login", data);

    return response;
  } catch (error) {
    console.error("Error login:", error);
    throw error;
  }
};

export const register = async (data) => {
  try {
    const response = await api.post("/register", data);
    return response;
  } catch (error) {
    console.error("Error register:", error);
    throw error;
  }
};

export const fetchAllMeals = async () => {
  try {
    const response = await api.get("/admin/meals");
    return response;
  } catch (error) {
    console.error("Error fetching all meals:", error);
    throw error;
  }
};

export const fetchMealsByCategory = async (id) => {
  try {
    const response = await api.get(`/admin/meals/category/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching meals by category:", error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get("/admin/categories");
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// old
// export const fetchMenuItems = async () => {
//   try {
//     const response = await api.get("/menu");
//     return response;
//   } catch (error) {
//     console.error("Error fetching menu items:", error);
//     throw error;
//   }
// };

export const fetchOrderHistory = async () => {
  try {
    const response = await api.get("/orders");
    return response;
  } catch (error) {
    console.error("Error fetching order history:", error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await api.post("/admin/orders/add", orderData);
    return response;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getOrderHistory = async (userId) => {
  try {
    const response = await api.get(`/admin/orders/user/${userId}`);
    return response;
  } catch (error) {
    console.error("Error getting order history:", error);
    throw error;
  }
};

export const updateOrder = async (orderId, updateData) => {
  try {
    const response = await api.put(`/orders/${orderId}`, updateData);
    return response;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await api.delete(`/orders/${orderId}`);
    return response;
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};

export default api;
