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
    //TODO don't use alert
    if (this.state.email.length === 0) {
      alert("Email should not be empty!");
      return;
    }
    if (this.state.password.length === 0) {
      alert("Password should not be empty!");
      return;
    }
    console.log("Signing in...");
    axios
      .post("/baseapi/login", {
        email: this.state.email,
        password: this.state.password,
      })
      .then((res) => {
        // TODO handle multiple request
        localStorage.setItem("FBIdToken", res.data.token);
        this.setState({ isLoggedIn: true });
      })
      .catch((err) => {
        // console.log(err.response)
        if (err.response.status === 400) {
          if (err.response.data.email === "Must be valid")
            alert("Invalid Email");
        }
        if (err.response.status === 403) {
          alert(err.response.data.general);
        }
      });
  };

  // TODO fully implement this later
  handleGoogleSignInClick = (e) => {
    e.preventDefault();
    console.log("Signing in with Google...");
    axios
      .post(
        "https://us-central1-projectory-5171c.cloudfunctions.net/baseapi/google/signin"
      )
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
  //TODO add "Remember Me" option
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
