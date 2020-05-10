import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import axios from "axios";

import { Link, Redirect } from "react-router-dom";


let credentials = "";

export default class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      isLoggedIn: false,

      // variable to check if data is fetch from the server or not
      hasCredential: null,
    };
  }

  handleLoginButtonClick = (e) => {
    e.preventDefault();

    axios
      .post("/signup", {
        email: "cunbidun@gmail.com",
        password: "abc123",
        confirmPassword: "abc123",
        // email: this.state.email,
        // password: this.state.password,
        // confirmPassword: this.state.confirmPassword,
      })
      .then((res) => {
        console.log(res);
        localStorage.setItem("FBIdToken", res.data.token);
        credentials = res.data.credentials;
        this.setState({
          hasCredential: true,
        });
      })
      .catch((e) => console.log(e));
  };

  handleGoogleSignInClick = (e) => {
    e.preventDefault();
    console.log("Signing in with Google...");
    axios
      .post("/google/signin")
      .then((res) => {
        localStorage.setItem("FBIdToken", res.data.token);
        this.setState({ isLoggedIn: true });
      })
      .catch((e) => console.log(e));
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

  handleTextConfirmPasswordChange = (e) => {
    this.setState({
      confirmPassword: e.target.value,
    });
  };

  render() {
    if (this.state.hasCredential) {
      const cred = credentials;
      return <Redirect to="/create" credentials={cred} />;
    } else
      return (
        <div>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Email Address"
                  onChange={this.handleTextEmailChange}
                  required
                  fullWidth
                  id="email"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
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
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Confirm Password"
                  onChange={this.handleTextConfirmPasswordChange}
                  required
                  fullWidth
                  name="password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  color="primary"
                  onClick={this.handleLoginButtonClick}
                >
                  Sign Up
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  color="primary"
                  onClick={this.handleGoogleSignInClick}
                >
                  Sign In With Google
                </Button>
              </Grid>
            </Grid>

            <Grid container justify="flex-end">
              <Grid item>
                <Link
                  to="/signin"
                  style={{ color: "primary", textDecoration: "none" }}
                >
                  <Typography>Already have an account? Sign in</Typography>
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      );
  }
}
