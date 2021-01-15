import React, { useState } from "react";
import "./signup.css";
import { Link, Redirect } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { loginViaGoogle, signup } from "../Actions/authAction";
import GoogleLogin from "react-google-login";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactnumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user);

  const formstyle = {
    fontSize: "20px",
    width: "100%",
    backgroundColor: "white",
    color: "black",
    border: "1px solid black",
    padding: "8px",
    marginTop: "1.2em",
    outline: "none",
  };

  const userSignup = (e) => {
    e.preventDefault();
    const user = {
      name,
      email,
      address,
      state,
      city,
      contactnumber,
      password,
    };
    dispatch(signup(user));
  };

  if (user.authenticate) {
    return <Redirect to={"/signin"} />;
  }
  if (auth.authenticate) {
    return <Redirect to={"/"} />;
  }

  const responseGoogle = (response) => {
    dispatch(loginViaGoogle(response.tokenId));
  };

  return (
    <div className="main_sign_page">
      <div className="signup_page">
        <form onSubmit={userSignup} className="form_">
          <h2 className="sign_txt">Sign Up</h2>

          <div className="social_icons">
            <GoogleLogin
              clientId={`Your api key `}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
            >
              <FaGoogle className="sign_Google_" />
            </GoogleLogin>
          </div>
          <h2 className="sign_txt_two">or create your account </h2>
          <div>
            <input
              style={formstyle}
              className="user_Name"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
          </div>

          <div>
            <input
              className="user_Email"
              type="email"
              placeholder="Email"
              name="email"
              style={formstyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div>
            <input
              className="user_Cnfm_Pswrd"
              type="number"
              placeholder="Contact Number"
              style={formstyle}
              value={contactnumber}
              onChange={(e) => setContactNumber(e.target.value)}
            ></input>
          </div>
          <div>
            <input
              className="user_Adrs"
              type="text"
              placeholder="Residental Address"
              style={formstyle}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></input>
          </div>
          <div className="state_city">
            <input
              className="user_State"
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            ></input>

            <input
              className="user_City"
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            ></input>
          </div>
          <div>
            <input
              className="user_Pswrd"
              type="password"
              placeholder="Password"
              style={formstyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>

          <div>
            <button className="user_Btn">Create Account</button>
          </div>
        </form>
      </div>

      <div className="login">
        <h1>Hello,Friend</h1>
        <p>
          Already a member? <br />
          Please click on the button to sign in
        </p>
        <Link to="/signin">
          <button className="sign_two_btn">Login</button>
        </Link>
      </div>
    </div>
  );
}
export default Signup;
