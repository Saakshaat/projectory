import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import User from "./Pages/User";
import Create from "./Pages/Create"

export default function WireFrame() {
  return (
    <Router>
      <div>
        <Switch>
        <Route path="/create">
            <Create />
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path="/user">
            <User />
          </Route>
          <Route path="/">
            <SignIn />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
