import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useParams, useHistory } from "react-router";
import { isuserLoggedIn, resetPassword } from "../Actions/authAction";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [isSubmited, setIsSubmited] = useState(false);
  const [serverError, setServerError] = useState("");

  const auth = useSelector((state) => state.auth);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.authenticate) {
      dispatch(isuserLoggedIn());
    }
  }, []);

  const confirmPassword = (e) => {
    e.preventDefault();
    dispatch(resetPassword(token, password))
      .then(() => setIsSubmited(true))
      .catch((error) => {
        if (error.response) {
          setServerError(error.response.data.message);
        }
      });
    history.push("/signin");
  };

  if (auth.authenticate) {
    return <Redirect to={"/"} />;
  }

  return (
    <div>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>
        <button onClick={confirmPassword}>Change Password</button>
      </div>
    </div>
  );
}

export default ResetPassword;
