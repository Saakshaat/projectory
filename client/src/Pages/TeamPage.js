import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import { Redirect } from "react-router-dom";
import axios from "axios";
import ProfileMain from "../Components/ProfileMain";
import ProjectTeamCard from "../Components/ProjectTeamCard";
import { Card, Grid, Divider, Container, Avatar, CircularProgress } from "@material-ui/core";

let projectId = "Skxq8GI9DFwq9bmv3z2B";

export default class TeamPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      open: [],
      closed: [],
      hadData: false,
    };
    if (localStorage.FBIdToken) this.state.isLoggedIn = true;
  }

  componentDidMount() {
    this.getOpen();
    this.getClosed();
  }

  getOpen() {
    axios
      .get("/aux2/my/projects/open/all/", {
        headers: {
          Authorization: localStorage.FBIdToken,
        },
      })
      .then((res) => {
        // TODO handle different type of request
        this.setState({
          open: res.data,
        });
      })
      .catch((err) => {
        this.setState({
          hadData: true,
        });
        console.log(err.response);
      });
  }

  getClosed() {
    axios
      .get("/aux2/my/projects/closed/all/", {
        headers: {
          Authorization: localStorage.FBIdToken,
        },
      })
      .then((res) => {
        // TODO handle different type of request
        this.setState({
          closed: res.data,
        });
        this.setState({
          hadData: true,
        });
      })
      .catch((err) => {
        this.setState({
          hadData: true,
        });
        console.log(err.response);
      });
  } 
  //TODO Add closed projects
  render() {
    if (!this.state.isLoggedIn) return <Redirect to="/" />;
    else {
      if (!this.state.hadData) return (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress size={50} /></div>);
      else
        return (
          <Container>
            <Typography variant="h5" style={{ marginTop: 20 }}>Open Projects: </Typography>
            <Grid container spacing={3}>
              {this.state.open.map((project) => (
                <Grid item xs={12}>
                  <ProjectTeamCard
                    interested={false}
                    projectId={project.id}
                    state="open"
                    creator={project.creator}
                    project={project.name}
                  />
                </Grid>
              ))}
            </Grid>

            <Typography variant="h5" style={{ marginTop: 20 }}>Closed Projects: </Typography>

            <Grid container spacing={3}>
              {this.state.closed.map((project) => (
                <Grid item xs={12}>
                  <ProjectTeamCard
                    interested={false}
                    projectId={project.id}
                    state="closed"
                    creator={project.creator}
                    project={project.name}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        );
    }
  }
}
