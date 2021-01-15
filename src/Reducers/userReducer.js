import { userConstants } from "../Actions/constants";

const initState = {
  user: {
    name: "",
    email: "",
    address: "",
    state: "",
    city: "",
    contactnumber: "",
    password: "",
  },
  error: null,
  message: "",
  loading: "",
  authenticate: false,
}

export default (state = initState, action) => {
  switch (action.type) {
    case userConstants.USER_REGISTER_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case userConstants.USER_REGISTER_SUCESS:
      state = {
        ...state,
        loading: false,
        message: action.payload.message,
        authenticate: true,
      };
      break;
    case userConstants.USER_REGISTER_FAILURE:
      state = {
        ...state,
        error: action.payload.error,
        loading: false,
      };
      break;
    default:
  }
  return state;
};
