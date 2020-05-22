import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import { Card, Grid, Divider, Container, Avatar } from "@material-ui/core";
import SkillChip from "../Components/SkillChip";
import EmailIcon from "@material-ui/icons/Email";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import LanguageIcon from "@material-ui/icons/Language";

const style = {
  name: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "26px",
    lineHeight: "28px",
  },
  headline: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: 200,
    fontSize: "12px",
  },
  top: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "20px",
  },
};

export default class ProfileSnapot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      userId: this.props.userId,
      hadData: false,
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
        console.log(err.response);
      });
  }

  render() {
    if (!this.state.hadData)
      return (
        <Card style={{ maxWidth: "275px" }} aligncontent="center">
          <Grid
            container
            spacing={3}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item>
              <Typography>Loading...</Typography>
            </Grid>
          </Grid>
        </Card>
      );
    else
      return (
        <Card
          elevation={8}
          style={{
            display: "flex",
            borderRadius: 10,
            width: "270px",
            height: "350px",
            paddingTop: "10px",
          }}
        >
          <Grid
            container
            direction="column"
            alignItems="center"
          >
            <Grid item>
              <Avatar
                src={this.state.profile.information.imageUrl}
                style={{
                  width: "100px",
                  height: "100px",
                }}
                alt="Profile Pic"
              ></Avatar>
              <hr style={{ visibility: "hidden" }} />
            </Grid>
            <Grid item>
              {/* TODO add link to profile page */}
              <Typography style={style.name}>
                {this.state.profile.information.name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography style={style.headline}>
                {this.state.profile.experience.headline}
              </Typography>
            </Grid>
            <Grid item>
              <Divider
                variant="middle"
                style={{
                  margin: 5,
                  backgroundColor: "#FFA500",
                }}
              />
              <Grid item>
                <Skill skills={this.state.profile.experience.skills.top} />
                <hr style={{ visibility: "hidden" }} />
              </Grid>

              <Grid item justify="flex-end">
                <Contact profile={this.state.profile} />
              </Grid>
            </Grid>
          </Grid>
        </Card>
      );
  }
}

const Skill = (props) => {
  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Grid item>
        <Typography style={style.top}>Top Skills</Typography>
      </Grid>
      <Grid item>
        <Container>
          {props.skills.map((skill, index) => (
            <SkillChip skill={skill} key={skill} />
          ))}
        </Container>
      </Grid>
    </Grid>
  );
};

const Contact = (props) => {
  return (
    <Grid container alignItems="center" justify="center">
      {!(props.profile.information.socials.github) ? (
        <Grid item>
          <a
            style={{ margin: 5 }}
            href={props.profile.information.socials.github}
          >
            <GitHubIcon style={{ color: "black" }} />
          </a>
        </Grid>
      ) : (
          <div />
        )}

      {!(props.profile.information.socials.linkedin) ? (
        <Grid item>
          <a
            style={{ margin: 5 }}
            href={props.profile.information.socials.linkedin}
          >
            <LinkedInIcon color="primary" />
          </a>
        </Grid>
      ) : (
          <div />
        )}

      {!(props.profile.information.socials.email) ? (
        <Grid item>
          <a
            style={{ margin: 5 }}
            href={"mailto:" + props.profile.information.socials.email}
          >
            <EmailIcon color="primary" style={{ color: "red" }} />
          </a>
        </Grid>
      ) : (
          <div />
        )}

      {!(props.profile.information.socials.website) ? (
        <Grid item>
          <a
            style={{ margin: 5 }}
            href={props.profile.information.socials.website}
          >
            <LanguageIcon color="primary" style={{ color: "green" }} />
          </a>
        </Grid>
      ) : (
          <div />
        )}
    </Grid>
  );
};
