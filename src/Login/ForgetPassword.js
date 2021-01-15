import React, { useEffect, useState } from "react";
import "./ForgetPassword";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router";
import { sendResetLink, isuserLoggedIn } from "../Actions/authAction";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [isSubmited, setIsSubmited] = useState(false);
  const [serverError, setServerError] = useState("");
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.authenticate) {
      dispatch(isuserLoggedIn());
    }
  }, []);

  const confirmEmail = (e) => {
    e.preventDefault();
    dispatch(sendResetLink(email))
      .then(() => setIsSubmited(true))
      .catch((error) => {
        if (error.response) {
          setServerError(error.response.data.message);
        }
      });
  };

  if (auth.authenticate) {
    return <Redirect to={"/"} />;
  }

  return (
    <div>
      <input
        type="email"
        placeholder="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
         <div>
        <button onClick={confirmEmail}>Send Mail</button>
      </div>
    </div>
  );
}

export default ForgetPassword;
