import React, { Component } from "react";
import { Container, Button } from "@material-ui/core";
import ProjectList from "../Components/ProjectList";
import { Link, Redirect } from "react-router-dom";

import axios from "axios";
import OtherProfile from "./OtherProfile";

let userId = "sUYPCPcbXrajiFjYGCXYrVD0jxE3";
let projectState = "open";

export default class TestingGround extends Component {
  constructor() {
    super();
    this.state = {
      resume: null,
    };
  }

  render() {
    return (
      <Container>
        <Link to={"/user/" + userId + "/profile"}>
          <Button>Profile</Button>
        </Link>
        <Link to={"/my/team/"}>
          <Button>Team</Button>
        </Link>
      </Container>
    );
  }
}
