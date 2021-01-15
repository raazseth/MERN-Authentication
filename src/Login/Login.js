import React, { useState, useEffect } from "react";
import "./Login.css";
import { Link, Redirect } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { isuserLoggedIn, login, loginViaGoogle } from "../Actions/authAction";
import { useDispatch, useSelector } from "react-redux";
import GoogleLogin from "react-google-login";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const loginFormStyle = {
    border: "none",
    fontSize: "20px",
    width: "80%",
    backgroundColor: "white",
    color: "black",
    padding: "8px",
    marginTop: "1.5em",
    outline: "none",
    marginLeft: "auto",
    marginRight: "auto",
    display: "block",
  };
  
  useEffect(() => {
    if (auth.authenticate) {
      dispatch(isuserLoggedIn());
    }
  }, []);

  const userLogin = (e) => {
    e.preventDefault();
    const user = {
      email,
      password,
    };
    dispatch(login(user));
  };

  if (auth.authenticate) {
    return <Redirect to={"/"} />;
  }

  const responseGoogle = (response) => {
    dispatch(loginViaGoogle(response.tokenId));
  };

  return (
    <div className="main_login_page">
      <div className="login_page">
        <form onSubmit={userLogin} className="login_form_">
          <h2 className="sign_txt_">Login</h2>

          <div className="social_icons">
            <GoogleLogin
              clientId={`Your api key`}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
            >
              <FaGoogle className="sign_Google_" />
            </GoogleLogin>
          </div>
          <h2 className="sign_txt_two_">or use your email account </h2>
          <div>
            <input
              className="login_user_Email"
              type="email"
              placeholder="Email"
              style={loginFormStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>

          <div>
            <input
              className="login_user_Pswrd"
              type="password"
              placeholder="Password"
              style={loginFormStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <Link to={"/forgetpassword"}>
            <h3 className="login_Forgetpassword">Forget Your Password?</h3>
          </Link>
          <div>
            <button className="login_user_Btn">Login</button>
          </div>
        </form>
      </div>

      <div className="signup">
        <h1>Welcome,Friend</h1>
        <p>
          New here? <br />
          Please click on the button to register
        </p>
        <Link to="/signup">
          <button className="sign_two_btn">Sign up</button>
        </Link>
      </div>
    </div>
  );
}
export default Login;
