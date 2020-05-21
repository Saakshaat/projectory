import React from 'react';
import { BrowserRouter as Router, Switch, Route, BrowserRouter } from "react-router-dom";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Create from "./Pages/Create";
import OtherProfile from "./Pages/OtherProfile";
import TestingGround from "./Pages/TestingGround";
import NavDrawer from "./Components/NavDrawer";
import MyProjects from './Pages/MyProjects';

export default function WireFrame() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

