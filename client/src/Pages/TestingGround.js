import React, { Component } from "react";
import {
  Grid,
  Tooltip,
  Button,
  TextField,
  Chip,
  Typography,
  Container,
} from "@material-ui/core";
import ProfileSnapshot from "../Components/ProfileSnapshot";
import firebase from "firebase";
import axios from "axios";

export default class TestingGround extends Component {
  constructor() {
    super();
    this.state = {
      resume: null,
    };
  }

  handleResumeChange = (e) => {
    this.setState({ resume: e.target.files[0] });
  };

  uploadResume = () => {
    const data = new FormData();

    data.append("resume", this.state.resume, this.state.resume.name);

    console.log("Sending Resume... with file " + this.state.resume.name);
    console.log(this.state.resume);
    console.log(data);

    axios
      .post("/baseapi/my/profile/resume", data, {
        headers: {
          Authorization: localStorage.FBIdToken,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err.response);
        console.log(localStorage.FBIdToken);
        this.setState({ hasError: true });
      });
  };

  render() {
    return (
      <Container>
       

        <ProfileSnapshot userId="8JAj8O2rI7PoyBuzm8Ji"/>
      </Container>
    );
  }
}
