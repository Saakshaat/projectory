import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import axios from "axios";

import ErrorText from "../Components/ErrorText";
import { Link, Redirect } from "react-router-dom";
import { Paper, CardMedia, CssBaseline } from "@material-ui/core";

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
        <div style={{
          backgroundImage: "url(" + "https://i.pinimg.com/originals/3b/d5/a7/3bd5a78fede2560fc13ed5d55aa42538.jpg" + ")",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
        }}>
          <CssBaseline />
          <Grid container component="main" justify='center' container component={Paper} elevation={15} style={{
            width: '70%',
            borderRadius: 20, position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            paddingLeft: 20,
            paddingRight: 20,
          }}>
            <Grid item xs={false} style={{ width: '40%', marginRight: 50, marginTop: 50 }}>
              <Typography variant='h2' style={{ justifyItems: 'center', alignItems: 'center', marginLeft: '20%', marginBottom: 20 }}>
                Projectory
      </Typography>
              <CardMedia
                image={require('../auth_ill.png')}
                title="Login"
                style={{
                  padding: '40%',
                  paddingLeft: '70%',
                  paddinRight: '50%',
                  marginRight: '50%',
                  marginBottom: 20
                }}
              />
            </Grid>
            <Grid item xs>
              <div style={{ padding: 30, borderRadius: 20, paddingTop: 50 }}>
                <Typography component="h1" variant="h5" style={{ justifySelf: 'center', flexDirection: 'row' }}>
                  Sign Up
        </Typography>
                <form>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    onChange={this.handleTextEmailChange}
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                  />
                  {this.state.hasEmptyEmail ? (
                    <Grid item xs={12}>
                      <ErrorText text="Email must not be empty" />
                    </Grid>
                  ) : (
                      <div />
                    )}

                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={this.handleTextPasswordChange}
                  />
                  {this.state.hasEmptyPassword ? (
                    <Grid item xs={12}>
                      <ErrorText text="Password must not be empty" />
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
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="confirm-password"
                    label="Confirm Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={this.handleTextConfirmPasswordChange}
                  />
                  {this.state.hasEmptyPassword ? (
                    <Grid item xs={12}>
                      <ErrorText text="Password must not be empty" />
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
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{ marginTop: 20 }}
                    onClick={this.handleLoginButtonClick}
                  >
                    Sign Up
          </Button>
                  <Button
                    fullWidth
                    type="submit"
                    variant='outlined'
                    color='primary'
                    style={{ marginTop: 10, }}
                    onClick={this.handleGoogleSignInClick}
                  >
                    Sign In With Google
                  </Button>
                  <Grid container spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center">
                    <Grid item xs style={{ marginTop: 40, marginBottom: 10 }}>
                      <Link
                        to="/"
                        style={{ color: "black", textDecoration: "none" }}
                      >
                        <Typography variant='caption' color='black' gutterBottom>Already have an account? Sign in</Typography>
                      </Link>
                    </Grid>
                  </Grid>
                </form>
              </div>
            </Grid>
          </Grid>
        </div>
      );
  }
}
