import React, { Component } from "react";
import { Button } from "@material-ui/core";
import firebase from "firebase";
import { Redirect } from "react-router-dom";

export default class User extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: true,
      externalData: null
    };
    firebase.auth().onAuthStateChanged((user) => {
      if (!user)
        this.setState({
          isLoggedIn: false,
        });
      this.setState({
        externalData: true,
      });
    });
  }

  handleClick = (e) => {
    e.preventDefault();
    console.log("Logging out...");
    const promise = firebase.auth().signOut();
    promise.then(
      firebase.auth().onAuthStateChanged(() => {
        this.setState({
          isLoggedIn: false,
        });
      })
    );
  };

  render() {
    if (!this.state.externalData) {
      return <div>Loading...</div>;
    }
    if (this.state.isLoggedIn === false) return <Redirect to="/" />;
    else
      return (
        <div>
          <div>User Logged In!</div>
          <Button onClick={this.handleClick}>Logout</Button>
        </div>
      );
  }
}
