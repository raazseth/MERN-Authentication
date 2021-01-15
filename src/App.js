import "./App.css";
import React, { useEffect } from "react";
import "./App.css";
import Home from "./Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { isuserLoggedIn } from "./Actions/authAction";
import { useDispatch, useSelector } from "react-redux";
import Signup from "./Signup/Signup";
import Login from "./Login/Login";
import ForgetPassword from "./Login/ForgetPassword";
import ResetPassword from "./Login/ResetPassword";

function App() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!auth.authenticate) {
      dispatch(isuserLoggedIn());
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/forgetpassword" component={ForgetPassword} />
          <Route exact path="/signin/reset/:token" component={ResetPassword} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
