import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Attach the stored JWT to every request. The API requires it for placing
// orders and for reading order history.
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("Could not read auth token:", error.message);
    }
    return config;
  },
  (error) => Promise.reject(error)
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

export const registerPushToken = async (pushToken) => {
  try {
    const response = await api.post("/push-token", { pushToken });
    return response;
  } catch (error) {
    console.error("Error registering push token:", error);
    throw error;
  }
};

export const cancelOwnOrder = async (orderId, reason) => {
  try {
    const response = await api.post(`/admin/orders/${orderId}/cancel`, { reason });
    return response;
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};

export const fetchFeaturedMeals = async () => {
  try {
    const response = await api.get("/meals/featured");
    return response;
  } catch (error) {
    console.error("Error fetching featured meals:", error);
    throw error;
  }
};

export const fetchMe = async () => {
  try {
    const response = await api.get("/me");
    return response;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const toggleFavourite = async (mealId) => {
  try {
    const response = await api.post(`/me/favourites/${mealId}`);
    return response;
  } catch (error) {
    console.error("Error toggling favourite:", error);
    throw error;
  }
};

export const submitReview = async (review) => {
  try {
    const response = await api.post("/reviews", review);
    return response;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};

export const fetchMyReviews = async () => {
  try {
    const response = await api.get("/reviews/mine");
    return response;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const validateCoupon = async (code, subtotal) => {
  try {
    const response = await api.post("/coupons/validate", { code, subtotal });
    return response;
  } catch (error) {
    console.error("Error validating coupon:", error);
    throw error;
  }
};

export const fetchSettings = async () => {
  try {
    const response = await api.get("/settings");
    return response;
  } catch (error) {
    console.error("Error fetching settings:", error);
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

export const reorder = async (orderData) => {
  try {
    const response = await api.post("/admin/orders/reorder", orderData);
    return response;
  } catch (error) {
    console.error("Error creating new order:", error);
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
    const response = await api.patch(
      `/admin/orders/update/${orderId}`,
      updateData
    );
    return response;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

export default api;
