import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import { Redirect } from "react-router-dom";
import {
  Card,
  Grid,
  Divider,
  Container,
  Avatar,
  Link,
  CardContent,
  IconButton,
  Tooltip,
  Button,
} from "@material-ui/core";
import ProfileSnapshot from "../Components/ProfileSnapshot";
import axios from "axios";

export default class ProjectTeamCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectState: this.props.state,
      projectId: this.props.projectId,
      data: null,
      hadData: false,
    };
  }

  componentDidMount() {
    console.log(this.props.interested);
    if (this.props.interested) this.getInterested();
    else this.getAllProject();
  }

  getInterested() {
    axios
      .get("/baseapi/interested/" + this.state.projectId, {
        headers: {
          Authorization: localStorage.FBIdToken,
        },
      })
      .then((res) => {
        // TODO handle different type of request
        console.log(res.data);
        this.setState({
          data: res.data.users,
        });
        this.setState({
          hadData: true,
        });
      })
      .catch((err) => {
        this.setState({
          hadData: true,
        });
        console.log(err);
      });
  }

  getAllProject() {
    axios
      .get(
        "/baseapi/my/team/" +
          this.state.projectState +
          "/" +
          this.state.projectId,
        {
          headers: {
            Authorization: localStorage.FBIdToken,
          },
        }
      )
      .then((res) => {
        // TODO handle different type of request
        this.setState({
          data: res.data.users,
        });
        this.setState({
          hadData: true,
        });
      })
      .catch((err) => {
        this.setState({
          hadData: true,
        });
        console.log(err);
      });
  }

  //TODO add edit my profile option
  render() {
    if (!this.state.hadData) return <Typography>Loading...</Typography>;
    else
      return (
        <Container style={{ padding: "-100px" }} disableGutters={true}>
          <Card
            style={{
              backgroundColor: "#e0f7fa",
              borderRadius: 10,
              height: "100%",
              maxWidth: "1500",
              marginTop: "20px",
            }}
          >
            <CardContent>
              <Typography
                gutterBottom
                variant="h4"
                component="h2"
                style={{ marginTop: 0, marginBottom: 0 }}
              >
                {this.props.project}
              </Typography>
              <Typography
                noWrap
                textSize={14}
                color="textSecondary"
                variant="caption"
                display="block"
                gutterBottom
              >
                {/* TODO Change this to actual link */}
                <Link href="#" variant="body2">
                  by {this.props.creator}
                </Link>
              </Typography>

              {this.props.interested ? (
                <Grid container>
                  {this.state.data.map((user) => (
                    <Tooltip title="Click to select">
                      <Button
                      disableRipple={true}
                        style={{
                          margin: 7  ,
                        }}
                      >
                        <Grid item >
                          <ProfileSnapshot userId={user.id} />
                        </Grid>
                      </Button>
                    </Tooltip>
                  ))}
                </Grid>
              ) : (
                <Grid container>
                  {this.state.data.map((user) => (
                    <Grid item style={{ margin: 15 }}>
                      <ProfileSnapshot userId={user.id} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Container>
      );
  }
}
