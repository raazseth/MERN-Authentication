import { authConstants } from "../Actions/constants";

const initState = {
  token: null,
  tokenId:null,
  user: {
      name:"",
      email:"",
      address:"",
      state:"",
      city:"",
      contactnumber:"",
      password:"",
      
  },
  authenticate: false,
  authenticating: false,
  loading:false,
  error:"",
  message:""
};

export default (state = initState, action) => {
  switch (action.type) {
    case authConstants.LOGIN_REQUEST:
      state = {
        ...state,
        authenticating: true,
      };
      break;
    case authConstants.LOGIN_SUCESS:
      state = {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        authenticate: true,
        authenticating: false,
      };
      break;
      case authConstants.LOGOUT_REQUEST:
      state={
        ...state,
        loading:true
      }
      break;
      case authConstants.LOGOUT_FAILURE:
        state={
          ...state,
          error:action.payload.error,
          loading:false
        }
        break;
        case authConstants.LOGOUT_SUCESS:
          state={
            ...initState
          }
          break;
          case authConstants.LOGIN_VIA_GOOGLE_FAILURE:
      state = {
        ...state,
        authenticating: true,
      };
      break;
    case authConstants.LOGIN_VIA_GOOGLE_SUCESS:
      state = {
        ...state,
        user: action.payload.user,
        tokenId: action.payload.tokenId,
        authenticate: true,
        authenticating: false,
      };
      break;
      case authConstants.LOGIN_VIA_GOOGLE_REQUEST:
      state={
        ...state,
        loading:true
      }
      break;
      default:
  }
  return state;
};
