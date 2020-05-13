import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import User from "./Pages/User";
import Create from "./Pages/Create";
import Profile from "./Pages/Profile";
import OtherProfile from "./Pages/OtherProfile";

export default function WireFrame() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/create" component={Create} />
          <Route exact path="/my/profile/" component={Profile} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/user" component={User} />
          <Route exact path="/" component={SignIn} />
          <Route path="/user/:userId/profile" component={OtherProfile} />
        </Switch>
      </div>
    </Router>
  );
}
