import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { Link, Redirect } from "react-router-dom";
import { Typography } from "@material-ui/core";
import axios from "axios";

export default class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      isLoggedIn: false,
    };
    if (localStorage.FBIdToken) this.state.isLoggedIn = true;
  }

  // Handlle submit button
  handleLoginButtonClick = (e) => {
    e.preventDefault();
    console.log("Signing in...");
    axios
      .post("/login", {
        email: this.state.email,
        password: this.state.password,
      })
      .then((res) => {
        // TODO handle multiple request
        localStorage.setItem("FBIdToken", res.data.token);
        this.setState({ isLoggedIn: true });
      })
      .catch((e) => console.log(e));
  };

  // TODO fully implement this later
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

  render() {
    // Already isLoggedIn user get to the user page
    if (this.state.isLoggedIn) {
      return <Redirect to="/user" />;
    } else
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

          <Button
            fullWidth
            type="submit"
            color="primary"
            onClick={this.handleGoogleSignInClick}
          >
            Sign In With Google
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                style={{ color: "primary", textDecoration: "none" }}
                href="#"
              >
                <Typography gutterBottom>Forgot password?</Typography>
              </Link>
            </Grid>
            <Grid item>
              <Link
                to="/signup"
                style={{ color: "primary", textDecoration: "none" }}
              >
                <Typography gutterBottom>
                  Don't have an account? Sign Up
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </div>
      );
  }
}
