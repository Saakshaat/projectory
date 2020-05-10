import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { Link, Redirect } from "react-router-dom";
import firebase from "firebase";
import { Typography } from "@material-ui/core";


export default class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      isLoggedIn: false,
      // variable to check if data is fetch from the server or not
      externalData: null,
    };

    // check if there already a logged user
    firebase.auth().onAuthStateChanged((user) => {
      if (user)
        this.setState({
          isLoggedIn: true,
        });
      this.setState({
        externalData: true,
      });
    });
  }

  // Handlle submit button
  handleLoginButtonClick = (e) => {
    e.preventDefault();

    console.log("Siginng In ...");

    // Login
    const promise = firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password);

    promise
      .then(
        // Check if users loggin successfully and move the user page.
        firebase.auth().onAuthStateChanged((user) => {
          if (user)
            this.setState({
              isLoggedIn: true,
            });
        })
      )
      // if there are something wrong with the email/password
      .catch((e) => alert("Password is not correct!"));
  };

  handleTextEmailChange = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  handleTextPasswordChange = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  render() {
    // Wait for the API to fetch data
    if (!this.state.externalData) {
      return <div>Loading...</div>;
    }

    // Already logged user get to the user page
    if (this.state.isLoggedIn === true) return <Redirect to="/user" />;
    else
      return (
        <div>
          <Typography variant="h5" gutterBottom>
            Sign In
          </Typography>
          <TextField
            label="Email Address"
            onChange={this.handleTextEmailChange}
            required
            fullWidth
            id="email"
            name="email"
            autoComplete="email"
            autoFocus
          />

          <TextField
            label="Password"
            onChange={this.handleTextPasswordChange}
            required
            fullWidth
            name="password"
            type="password"
            id="password"
            autoComplete="current-password"
          />

          <Button
            fullWidth
            type="submit"
            color="primary"
            onClick={this.handleLoginButtonClick}
          >
            Sign In
          </Button>

          <Grid container>
            <Grid item xs>
              <Link
                style={{ color: "primary", textDecoration: "none" }}
                href="#"
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link
                to="/signup"
                style={{ color: "primary", textDecoration: "none" }}
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </div>
      );
  }
}
