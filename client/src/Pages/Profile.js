import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import { Redirect } from "react-router-dom";
import axios from "axios";
import ProfileMain from "../Components/ProfileMain";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      profile: null,
      hadData: false,
    };
    if (localStorage.FBIdToken) this.state.isLoggedIn = true;
  }

  componentDidMount() {
    this.getProfilePage();
  }

  getProfilePage() {
    axios
      .get("/baseapi/my/profile", {
        headers: {
          Authorization: localStorage.FBIdToken,
        },
      })
      .then((res) => {
        // TODO handle different type of request
        this.setState({
          profile: res.data,
        });
        this.setState({
          hadData: true,
        });
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 403) {
          // Delete the FBIdToken and redirect user to login page.
          localStorage.removeItem("FBIdToken");
          this.setState({ isLoggedIn: false });
        }
      });
  }

  render() {
    if (!this.state.isLoggedIn) return <Redirect to="/" />;
    else {
      if (!this.state.hadData) return <Typography>Loading...</Typography>;
      else return <ProfileMain profile={this.state.profile}></ProfileMain>;
    }
  }
}
