import React, { Component } from "react";
import { Button } from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";

export default class User extends Component {
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

  //TODO move this to dashboard
  render() {
    if (!this.state.isLoggedIn) return <Redirect to="/" />;
    else
      return (
        <div>
          <div>User Logged In!</div>
          <Link to="/my/profile" style={{ textDecoration: "none" }}>
            <Button>My Profile</Button>
          </Link>
          <Button onClick={this.handleClick}>Logout</Button>
          {/* <Link to>Saakshaat Awesome Profile</Button> */}
          {/* TODO implement this latter */}
          {/* <Button onClick={this.handleShowProject}>Show project</Button> */}
        </div>
      );
  }
}
