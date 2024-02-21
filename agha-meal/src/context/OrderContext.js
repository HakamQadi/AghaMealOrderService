import createDataContext from "./createDataContext";

const initialState = {
  names: [],
  order: [],
  // isAuthenticated: false,
};

const orderReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "set_names":
      return { ...state, names: payload };
    case "set_order":
      return { ...state, order: payload };
    default:
      return state;
  }
};

const setNames = (dispatch) => {
  return (payload) => {
    dispatch({ type: "set_names", payload });
  };
};

const setOrder = (dispatch) => {
  return (payload) => {
    dispatch({ type: "set_order", payload });
  };
};

export const { Context: OrderContext, Provider } = createDataContext(
  orderReducer,
  { setNames, setOrder },
  initialState
);
