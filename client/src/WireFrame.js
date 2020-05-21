import React from 'react';
import { BrowserRouter as Router, Switch, Route, BrowserRouter, HashRouter } from "react-router-dom";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Create from "./Pages/Create";
import OtherProfile from "./Pages/OtherProfile";
import TestingGround from "./Pages/TestingGround";
import NavDrawer from "./Components/NavDrawer";
import MyTeam from "./Pages/TeamPage"
import ProjectTeamCard from "./Components/ProjectTeamCard"
import Interested from "./Pages/Interested"
import MyProjects from './Pages/MyProjects';
import Profile from './Pages/Profile';
import Dashboard from './Pages/Dashboard';
import TeamPage from './Pages/TeamPage';

const history = require("history").createHashHistory();
export default function WireFrame() {
  return (
    <HashRouter>
      <div>
        <Switch>
          <Route exact path="/create" component={Create} />
          <Route path="/user/:userId/profile" component={OtherProfile} />
          <Route exact path="/my/team/" component={MyTeam} />
          <Route exact path="/testing" component={TestingGround} />
          <Route exact path="/signin" component={SignIn} />
          <Route exact path="/my/teams" component={TeamPage} />
          <Route exact path="/signup" component={SignUp} />
          <Route path path="/my/profile" component={Profile} />
          <Route exact path="/my/projects" component={MyProjects} />
          <Route exact path="/dashboard" component={NavDrawer} />
          <Route exact path="/interested" component={Interested} />
          <Route exact path="/" component={SignIn} />
        </Switch>
      </div>
    </HashRouter>
  );
}

