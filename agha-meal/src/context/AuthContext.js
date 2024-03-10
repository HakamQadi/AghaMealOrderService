import createDataContext from "./createDataContext";

const initialState = {
  token: "",
  user: null,
  isAuthenticated: false,
};

const authReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "set_is_authenticated":
      return { ...state, isAuthenticated: payload };
    case "set_user_token":
      return { ...state, token: payload };
    case "set_user_details":
      return { ...state, user: payload };
    case "logout":
      return initialState;
    default:
      return state;
  }
};

const setIsAuthenticated = (dispatch) => {
  return (payload) => {
    dispatch({ type: "set_is_authenticated", payload });
  };
};

const setUserToken = (dispatch) => {
  return (payload) => {
    dispatch({ type: "set_user_token", payload });
  };
};

const setUserDetails = (dispatch) => {
  return (payload) => {
    dispatch({ type: "set_user_details", payload });
  };
};

export const { Context: AuthContext, Provider } = createDataContext(
  authReducer,
  { setIsAuthenticated, setUserDetails, setUserToken },
  initialState
);
