import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import { Redirect } from "react-router-dom";
import axios from "axios";
import ProfileMain from "../Components/ProfileMain";
import ProjectTeamCard from "../Components/ProjectTeamCard";
import { Card, Grid, Divider, Container, Avatar, CircularProgress } from "@material-ui/core";

let projectId = "Skxq8GI9DFwq9bmv3z2B";

export default class Interested extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      data: false,
      hadData: false,
    };
    if (localStorage.FBIdToken) this.state.isLoggedIn = true;
  }

  componentDidMount() {
    this.getCreatedProject();
  }

  getCreatedProject() {
    axios
      .get("/baseapi/my/projects/open/created/", {
        headers: {
          Authorization: localStorage.FBIdToken,
        },
      })
      .then((res) => {
        // TODO handle different type of request
        console.log(res.data);
        this.setState({
          data: res.data,
        });
        this.setState({
          hadData: true,
        });
      })
      .catch((err) => {
        if (err.response.status === 403) this.setState({ isLoggedIn: false });
        this.setState({
          hadData: true,
        });
        console.log(err.response);
      });
  }

  //TODO add edit my profile option
  render() {
    if (!this.state.isLoggedIn) return <Redirect to="/" />;
    else {
      if (!this.state.hadData) return (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress size={50} /></div>);
      else
        return (
          <Container>
            <Grid container spacing={3}>
              {this.state.data.map((project) => (
                <Grid item xs={12}>
                  <ProjectTeamCard
                    interested={true}
                    project={project.name}
                    projectId={project.id}
                    creator={project.creator}
                    state="open"
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        );
    }
  }
}
