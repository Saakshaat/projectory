import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Grid, GridItem } from "@material-ui/core";
import SkillBoard from "../Components/SkillBoard";
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
      .get(
        "https://us-central1-projectory-5171c.cloudfunctions.net/baseapi/my/profile",
        {
          headers: {
            Authorization: localStorage.FBIdToken,
          },
        }
      )
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
      else
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div>
              <Typography variant="h3">
                {this.state.profile.information.name}
              </Typography>
              <p />

              <Typography>
                {this.state.profile.information.institution}
              </Typography>
              {/* TODO hide this if there are no github link */}
              <a href={this.state.profile.information.socials.github}>
                <GitHubIcon color="primary" />
              </a>

              {/* TODO hide this if there are no linkedin link */}
              <a href={this.state.profile.information.socials.linkedin}>
                <LinkedInIcon color="primary" />
              </a>
              <p />

              <Typography variant="caption">
                {this.state.profile.information.bio}
              </Typography>

              <p />
              <Typography>Technologies and Skills</Typography>
              <SkillBoard
                skills={this.state.profile.experience.skills}
              ></SkillBoard>
            </div>
          </div>
        );
    }
  }
}
