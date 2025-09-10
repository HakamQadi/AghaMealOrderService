import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Action types
const ORDER_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_ORDERS: "SET_ORDERS",
  ADD_ORDER: "ADD_ORDER",
  UPDATE_ORDER: "UPDATE_ORDER",
  CLEAR_ORDERS: "CLEAR_ORDERS",
  SET_CART: "SET_CART",
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  CLEAR_CART: "CLEAR_CART",
};

// Initial state
const initialState = {
  orders: [],
  cart: [],
  loading: false,
  error: null,
};

// Reducer
const orderReducer = (state, action) => {
  switch (action.type) {
    case ORDER_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case ORDER_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case ORDER_ACTIONS.SET_ORDERS:
      return { ...state, orders: action.payload, loading: false, error: null };

    case ORDER_ACTIONS.ADD_ORDER:
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        loading: false,
        error: null,
      };

    case ORDER_ACTIONS.UPDATE_ORDER:
      return {
        ...state,
        orders: state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        ),
        loading: false,
        error: null,
      };

    case ORDER_ACTIONS.CLEAR_ORDERS:
      return { ...state, orders: [], loading: false, error: null };

    case ORDER_ACTIONS.SET_CART:
      return { ...state, cart: action.payload };

    case ORDER_ACTIONS.ADD_TO_CART:
      const existingItem = state.cart.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };

    case ORDER_ACTIONS.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter((item) => item._id !== action.payload),
      };

    case ORDER_ACTIONS.CLEAR_CART:
      return { ...state, cart: [] };

    default:
      return state;
  }
};

// Context
const OrderContext = createContext();

// Provider component
export const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Load cart from AsyncStorage on app start
  React.useEffect(() => {
    loadCartFromStorage();
  }, []);

  // Save cart to AsyncStorage whenever cart changes
  React.useEffect(() => {
    saveCartToStorage();
  }, [state.cart]);

  const loadCartFromStorage = async () => {
    try {
      const savedCart = await AsyncStorage.getItem("cart");
      if (savedCart) {
        dispatch({
          type: ORDER_ACTIONS.SET_CART,
          payload: JSON.parse(savedCart),
        });
      }
    } catch (error) {
      console.error("Error loading cart from storage:", error);
    }
  };

  const saveCartToStorage = async () => {
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(state.cart));
    } catch (error) {
      console.error("Error saving cart to storage:", error);
    }
  };

  // Actions
  const setLoading = useCallback((loading) => {
    dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: ORDER_ACTIONS.SET_ERROR, payload: error });
  }, []);

  const setOrders = useCallback((orders) => {
    dispatch({ type: ORDER_ACTIONS.SET_ORDERS, payload: orders });
  }, []);

  const addOrder = useCallback((order) => {
    dispatch({ type: ORDER_ACTIONS.ADD_ORDER, payload: order });
  }, []);

  const updateOrder = useCallback((order) => {
    dispatch({ type: ORDER_ACTIONS.UPDATE_ORDER, payload: order });
  }, []);

  const clearOrders = useCallback(() => {
    dispatch({ type: ORDER_ACTIONS.CLEAR_ORDERS });
  }, []);

  const addToCart = useCallback((item) => {
    dispatch({ type: ORDER_ACTIONS.ADD_TO_CART, payload: item });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    dispatch({ type: ORDER_ACTIONS.REMOVE_FROM_CART, payload: itemId });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: ORDER_ACTIONS.CLEAR_CART });
  }, []);

  const getCartTotal = useCallback(() => {
    return state.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [state.cart]);

  const getCartItemCount = useCallback(() => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  }, [state.cart]);

  const value = {
    ...state,
    setLoading,
    setError,
    setOrders,
    addOrder,
    updateOrder,
    clearOrders,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

// Custom hook
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
