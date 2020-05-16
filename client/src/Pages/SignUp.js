import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import axios from "axios";

import ErrorText from "../Components/ErrorText";
import { Link, Redirect } from "react-router-dom";

let credentials = null;
let uid = "";

export default class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      isLoggedIn: false,
      hasEmptyEmail: false,
      hasEmptyPassword: false,
      hasEmptyComfirmPassword: false,
      passwordDontMatch: false,
      hasError: false,
      errorText: "",
      hasCredential: null, // variable to check if data is fetch from the server or not
    };
  }

  handleLoginButtonClick = (e) => {
    e.preventDefault();

    this.setState({ hasEmptyEmail: false });
    this.setState({ hasEmptyPassword: false });
    this.setState({ hasError: false });
    this.setState({ passwordDontMatch: false });

    if (this.state.email.length === 0) {
      this.setState({ hasEmptyEmail: true });
      return;
    }
    if (this.state.password.length === 0) {
      this.setState({ hasEmptyPassword: true });
      return;
    }
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ passwordDontMatch: true });
      return;
    }

    console.log("Signing up...");

    axios
      .post("/baseapi/signup", {
        email: this.state.email,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword,
      })
      .then((res) => {
        // TODO handle different type of request
        credentials = res.data.credentials;
        uid = res.data.uid;
        localStorage.setItem("FBIdToken", res.data.token);
        this.setState({ hasCredential: true });
      })
      .catch((err) => {
        if (err.response.status === 400) {
          if (err.response.data.email === "Must be valid") {
            this.setState({
              errorText: "Invalid email address.",
            });
          }
          if (
            err.response.data.password ===
            "Password must be 8 characters long and must contain atleast one number and special character"
          ) {
            this.setState({
              errorText:
                "Password must be 8 characters long and must contain atleast one number and special character.",
            });
          }
        }
        if (err.response.status === 500) {
          if (
            err.response.data.error ===
            "Error with creating account. Error: The email address is already in use by another account."
          ) {
            this.setState({
              errorText:
                "The email address is already in use by another account.",
            });
          }
        }
        this.setState({ hasError: true });
      });
  };

  handleGoogleSignInClick = (e) => {
    e.preventDefault();
    console.log("Signing in with Google...");
    axios
      .post("/baseapi/google/signin")
      .then((res) => {
        localStorage.setItem("FBIdToken", res.data.token);
        this.setState({ isLoggedIn: true });
      })
      .catch((err) => {
        console.log(err.status);
      });
  };

  //TODO check if Email is valid
  handleTextEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };

  //TODO check if Password is strong
  handleTextPasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  handleTextConfirmPasswordChange = (e) => {
    this.setState({ confirmPassword: e.target.value });
  };

  render() {
    if (this.state.hasCredential) {
      return (
        <Redirect
          to={{
            pathname: "/create",
            state: {
              uid: { uid },
              credentials: { credentials },
            },
          }}
        />
      );
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

              {this.state.hasEmptyEmail ? (
                <Grid item xs={12}>
                  <ErrorText text="Email must not be empty" />
                </Grid>
              ) : (
                <div />
              )}

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
              {this.state.hasEmptyPassword ? (
                <Grid item xs={12}>
                  <ErrorText text="Password must not be empty" />
                </Grid>
              ) : (
                <div />
              )}
              <Grid item xs={12}>
                <TextField
                  label="Confirm Password"
                  onChange={this.handleTextConfirmPasswordChange}
                  required
                  fullWidth
                  name="confirm-password"
                  type="password"
                  id="confirm-password"
                  autoComplete="current-password"
                />
              </Grid>
              {this.state.passwordDontMatch ? (
                <Grid item xs={12}>
                  <ErrorText text="Passwords don't match" />
                </Grid>
              ) : (
                <div />
              )}
              {this.state.hasError ? (
                <Grid item xs={12}>
                  <ErrorText text={this.state.errorText} />
                </Grid>
              ) : (
                <div />
              )}
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
                  to="/"
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
