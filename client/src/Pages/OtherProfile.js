import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import axios from "axios";
import SkillBoard from "../Components/SkillBoard";
import ErrorText from "../Components/ErrorText";

export default class OtherProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      userId: this.props.match.params.userId,
      hadData: false,
      hasError: false,
      errorText: "",
    };
  }

  componentDidMount() {
    this.getProfilePage();
  }

  getProfilePage() {
    axios
      .get("/baseapi/user/" + this.state.userId + "/profile")
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
        if (err.response.status === 404) {
          this.setState({ errorText: "User does not exist." });
          this.setState({ hasError: true });
          this.setState({ hadData: true });
          console.log(this.state.hasError);
        }
      });
  }

  render() {
    if (!this.state.hadData) return <Typography>Loading...</Typography>;
    else if (this.state.hasError)
      return <ErrorText text={this.state.errorText} />;
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
