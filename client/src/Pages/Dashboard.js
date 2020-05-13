import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import NavBar from '../Components/NavBar'
import ProjectList from "../Components/ProjectList";


export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
    };
    if (localStorage.FBIdToken) this.state.isLoggedIn = true;
  }

  handleClick = (e) => {
    e.preventDefault();
    console.log("Logging out...");
    localStorage.removeItem("FBIdToken");
    this.setState({ isLoggedIn: false });
    console.log(this.state);
  };

  // handleShowProject = (e) => {
  //   e.preventDefault();
  //   console.log("Showing Projects ...");
  //   axios
  //     .post("/project")
  //     .then((res) => {
  //       console.log(res);
  //       this.state = {
  //         isLoggedIn: false,
  //       };
  //     })
  //     .catch((e) => console.log(e));
  // };

  render() {
    return (
      <div>
        <NavBar />
        <ProjectList />
        {/* TODO implement this latter */}
        {/* <Button onClick={this.handleShowProject}>Show project</Button> */}
      </div>
    );
  }
}
