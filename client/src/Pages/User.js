import React, { Component } from "react";
import { Button, Container } from "@material-ui/core";
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

  render() {
    if (!this.state.isLoggedIn) return <Redirect to="/" />;
    else
      return (
        <Container>
          <div>User Logged In!</div>
          <Link to="/my/profile" style={{ textDecoration: "none" }}>
            <Button>My Profile</Button>
          </Link>
          <Button onClick={this.handleClick}>Logout</Button>
        </Container>
      );
  }
}


