import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import NavBar from '../Components/NavBar'
import ProjectList from "../Components/ProjectList";
import NavDrawer from '../Components/NavDrawer'
import { CssBaseline } from "@material-ui/core";


export default class Dashboard extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <ProjectList endpoint='/aux5/projects/open' header={localStorage.FBIdToken} applicable={true} />
      </div>
    );
  }
}
