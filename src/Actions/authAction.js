import axios from "../Helper/axios";
import { authConstants, userConstants } from "./constants";

export const login = (user) => {
  return async (dispatch) => {
    dispatch({ type: authConstants.LOGIN_REQUEST });
    const res = await axios.post("/signin", {
      ...user,
    });

    if (res.status === 200) {
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({
        type: authConstants.LOGIN_SUCESS,
        payload: {
          token,
          user,
        },
      });
    } else {
      if (res.status === 400) {
        dispatch({
          type: authConstants.LOGIN_FAILURE,
          payload: { error: res.data.error },
        });
      }
    }
  };
};

export const isuserLoggedIn = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = JSON.parse(localStorage.getItem("user"));
      dispatch({
        type: authConstants.LOGIN_SUCESS,
        payload: {
          token,
          user,
        },
      });
    } else {
      dispatch({
        type: authConstants.LOGIN_FAILURE,
        payload: { error: "Failed to login" },
      });
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    dispatch({
      type: authConstants.LOGOUT_REQUEST,
    });
    localStorage.clear();
    dispatch({
      type: authConstants.LOGOUT_SUCESS,
    });
  };
};

export const sendResetLink = (email) => {
  return async (dispatch) => {
    dispatch({ type: authConstants.FORGET_REQUEST });
    try {
      const res = await axios.post("/forget", { email });
      dispatch({
        type: authConstants.FORGET_SUCESS,
        payload: res,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
      dispatch({
        type: authConstants.FORGET_FAILURE,
        payload: { error },
      });
    }
  };
};

export const resetPassword = (token, password) => {
  return async (dispatch) => {
    dispatch({ type: authConstants.RESET_REQUEST });
    try {
      const res = await axios.post("/signin/reset/", { token, password });
      dispatch({
        type: authConstants.RESET_SUCESS,
        payload: res,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
      dispatch({
        type: authConstants.RESET_FAILURE,
        payload: { error },
      });
    }
  };
};

export const loginViaGoogle = (tokenId) => {
  return async (dispatch) => {
    dispatch({ type: authConstants.LOGIN_VIA_GOOGLE_FAILURE });
    const res = await axios.post("/googlelogin", {
      idToken: tokenId,
    });
    if (res.status === 200) {
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({
        type: authConstants.LOGIN_VIA_GOOGLE_SUCESS,
        payload: {
          token,
          user,
        },
      });
    } else {
      if (res.status === 400) {
        dispatch({
          type: authConstants.LOGIN_VIA_GOOGLE_FAILURE,
          payload: { error: res.data.error },
        });
      }
    }
  };
};

export const signup = (user) => {
  return async (dispatch) => {
    dispatch({ type: userConstants.USER_REGISTER_REQUEST });
    const res = await axios.post("/signup", {
      ...user,
    });
    if (res.status === 200) {
      dispatch({ type: authConstants.SIGNUP_SUCCESS });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({
        type: authConstants.LOGIN_SUCCESS,
        payload: {
          token,
          user,
        },
      });
      dispatch({
        type: userConstants.USER_REGISTER_SUCESS,
        payload: { message: "User Created Successfully" },
      });
    } else {
      if (res.status === 400) {
        dispatch({
          type: userConstants.USER_REGISTER_FAILURE,
          payload: { error: res.data.error },
        });
      }
    }
  };
};
