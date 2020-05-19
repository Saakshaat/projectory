import React, { useState, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import User from "./Pages/User";
import Create from "./Pages/Create";
import Dashboard from './Pages/Dashboard';
import Profile from "./Pages/Profile";
import OtherProfile from "./Pages/OtherProfile";
import TestingGround from "./Pages/TestingGround";
import NavDrawer from "./Components/NavDrawer";
import axios from 'axios';

export default function WireFrame() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/create" component={Create} />
          <Route path="/user/:userId/profile" component={OtherProfile} />
          <Route exact path="/testing" component={TestingGround} />
          <Route exact path="/signin" component={SignIn} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/dashboard" component={NavDrawer} />
          <Route exact path="/" component={SignIn} />
        </Switch>
      </div>
    </Router>
  );
}

