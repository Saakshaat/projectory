import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { Link, Redirect } from "react-router-dom";
import { Typography, CssBaseline, Paper, CardMedia, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core";
import ErrorText from "../Components/ErrorText";
import axios from "axios";
import Dashboard from "./Dashboard";

const history = require("history").createHashHistory();

export default class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      resetEmail: '',
      email: "",
      password: "",
      hasEmptyEmail: false,
      hasEmptyPassword: false,
      isLoggedIn: false,
      hasError: false,
      errorText: "",
      hasProflie: true,
    };
  }

  componentDidMount() {
    if (localStorage.FBIdToken) {
      axios
        .get("/baseapi/valid", {
          headers: {
            Authorization: localStorage.FBIdToken,
          },
        })
        .then((response) => {
          if (response.status === 200)
            this.setState({
              isLoggedIn: true,
            });
        })
        .catch((error) => {
          console.log(error);
          if (error.status === 429) {
            axios
              .get("/aux1/valid", {
                headers: {
                  Authorization: localStorage.FBIdToken,
                },
              })
              .then((response) => {
                if (response.status === 200)
                  this.setState({
                    isLoggedIn: true,
                  });
              })
              .catch((error) => {
                console.log(error);
                if (error.status === 429) {
                  axios
                    .get("/aux2/valid", {
                      headers: {
                        Authorization: localStorage.FBIdToken,
                      },
                    })
                    .then((response) => {
                      if (response.status === 200)
                        this.setState({
                          isLoggedIn: true,
                        });
                    })
                    .catch((error) => {
                      this.setState({ isLoggedIn: false });
                      console.log(error);
                    });
                } else {
                  this.setState({ isLoggedIn: false });
                }
              });
          } else {
            this.setState({ isLoggedIn: false });
          }
        });
    } else {
      this.setState({ isLoggedIn: false });
    }
  }

  // Handlle submit button
  handleLoginButtonClick = (e) => {
    e.preventDefault();
    this.setState({ hasEmptyEmail: false });
    this.setState({ hasEmptyPassword: false });
    this.setState({ hasError: false });

    if (this.state.email.length === 0) {
      this.setState({ hasEmptyEmail: true });
      return;
    }
    if (this.state.password.length === 0) {
      this.setState({ hasEmptyPassword: true });
      return;
    }

    console.log("Signing in...");
    axios
      .post("/baseapi/login", {
        email: this.state.email,
        password: this.state.password,
      })
      .then((res) => {
        console.log(res);
        // TODO handle multiple request
        localStorage.setItem("FBIdToken", res.data.token);
        this.setState({ isLoggedIn: true });
      })
      .catch((err) => {
        console.log(err.response);

        if (err.response.status === 404) {
          this.setState({ hasProflie: false });
          return;
        }

        if (err.response.status === 400) {
          if (err.response.data.email === "Must be valid")
            this.setState({ errorText: "Invalid Email" });
        }
        if (err.response.status === 403) {
          this.setState({ errorText: err.response.data.general });
        }

        this.setState({ hasError: true });
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
    this.setState({ email: e.target.value });
  };

  handleTextPasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  handleResetEmail = (e) => {
    this.setState({ resetEmail: e.target.value });
  }

  handlePasswordReset = () => {
    const request = {
      email: this.state.resetEmail,
    }
    axios
      .post("/baseapi/password_reset", request, {})
      .then((res) => {
        console.log(res);
        this.handleClose();
        // TODO handle multiple request                
      })
      .catch((err) => {
        this.handleClose();
        console.log(err.response);
      });

  };

  //TODO add "Remember Me" option
  render() {
    if (!this.state.hasProflie) return <Redirect to="/create" />;

    // Already isLoggedIn user get to the user page
    if (this.state.isLoggedIn) {
      return <Redirect to="/dashboard" />;
    } else
      return (
        <div
          style={{
            backgroundImage:
              "url(https://i.pinimg.com/originals/3b/d5/a7/3bd5a78fede2560fc13ed5d55aa42538.jpg)",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            height: "100vh",
          }}
        >
          <CssBaseline />
          <Grid
            justify="center"
            container
            component={Paper}
            elevation={15}
            style={{
              width: "70%",
              borderRadius: 20,
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <Grid
              item
              xs={false}
              style={{ width: "40%", marginRight: 50, marginTop: 50 }}
            >
              <Typography
                variant="h2"
                style={{
                  justifyItems: "center",
                  alignItems: "center",
                  marginLeft: "20%",
                  marginBottom: 20,
                }}
              >
                Projectory
              </Typography>
              <CardMedia
                image={require("../auth_ill.png")}
                title="Login"
                style={{
                  padding: "40%",
                  paddingLeft: "70%",
                  paddinRight: "50%",
                  marginRight: "50%",
                  marginBottom: 20,
                }}
              />
            </Grid>
            <Grid item xs>
              <div style={{ padding: 30, borderRadius: 20, paddingTop: 50 }}>
                <Typography
                  component="h1"
                  variant="h5"
                  style={{ justifySelf: "center", flexDirection: "row" }}
                >
                  Sign in
                </Typography>
                <form>
                  {/* Email */}
                  <div>
                    {this.state.hasEmptyEmail ? (
                      <TextField
                        error
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
                        helperText="Email must not be empty"
                      />
                    ) : (
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
                      )}
                  </div>

                  {/* Password */}
                  <div>
                    {this.state.hasEmptyPassword ? (
                      <TextField
                        error
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
                        helperText="Password must not be empty"
                      />
                    ) : (
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
                      )}
                  </div>

                  {this.state.hasError ? (
                    <Grid item xs={12}>
                      <ErrorText text={this.state.errorText} />
                    </Grid>
                  ) : (
                      <div />
                    )}

                  {/* Submit*/}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{ marginTop: 20 }}
                    onClick={this.handleLoginButtonClick}
                  >
                    Sign In
                  </Button>

                  {/* Google Sign In */}
                  <Button
                    fullWidth
                    type="submit"
                    variant="outlined"
                    color="primary"
                    style={{ marginTop: 10 }}
                    onClick={this.handleGoogleSignInClick}
                  >
                    Sign In With Google
                  </Button>

                  <Grid
                    container
                    direction="row"
                    spacing={3}
                    alignItems="center"
                    justify="center"
                    style={{ padding: 25 }}
                  >
                    <Grid item xs={6}>
                      <Link
                        onClick={this.handleClickOpen}
                        style={{ color: "black", textDecoration: "none" }}
                      >
                        <Typography variant="caption" gutterBottom>
                          Forgot password?
                        </Typography>
                      </Link>
                      <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Password Reset</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            A password reset email will be sent to the your email.
                          </DialogContentText>
                          <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Email Address"
                            type="email"
                            fullWidth
                            placeholder='Email cannot be empty'
                            onChange={this.handleResetEmail}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={this.handleClose} color="primary">
                            Cancel
                          </Button>
                          <Button onClick={this.handlePasswordReset} color="primary" disabled={this.state.resetEmail.length === 0}>
                            Confirm
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Grid>

                    <Grid>
                      <Link
                        to="/signup"
                        style={{ color: "black", textDecoration: "none" }}
                      >
                        <Typography
                          variant="caption"
                          color="black"
                          gutterBottom
                        >
                          Don't have an account? Sign Up
                        </Typography>
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
