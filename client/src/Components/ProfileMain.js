import React from "react";
import Typography from "@material-ui/core/Typography";

import { Container, Divider, Grid, Button, Avatar } from "@material-ui/core";
import SkillChip from "../Components/SkillChip";
import WorkIcon from "@material-ui/icons/Work";
import EmailIcon from "@material-ui/icons/Email";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import LanguageIcon from "@material-ui/icons/Language";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
}));

const ProfileMain = (props) => {
  return (
    <div>
      <div>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12} container>
              <Grid item xs={12}>
                <Header profile={props.profile} />
              </Grid>
            </Grid>

            <Grid item xs={3} container spacing={3}>
              <Grid item xs={12}>
                <Skill skills={props.profile.experience.skills} />
              </Grid>
              <Grid item xs={12}>
                <Project projects={props.profile.projects} />
              </Grid>
            </Grid>

            <Grid item>
              <Divider
                orientation="vertical"
                variant="middle"
                style={{
                  margin: 5,
                  backgroundColor: "#4B5BEA",
                  maxHeight: "100%",
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <Info profile={props.profile} />
            </Grid>
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default ProfileMain;

const Header = (props) => {
  const classes = useStyles();

  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Grid item xs={12}>
        <Avatar
          className={classes.large}
          src={props.profile.information.imageUrl}
          alt="Profile Picture"
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h4">{props.profile.information.name}</Typography>
        <Divider
          variant="middle"
          style={{
            margin: 5,
            backgroundColor: "#4B5BEA",
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography>{props.profile.experience.headline}</Typography>
        <hr style={{ visibility: "hidden" }} />
      </Grid>
    </Grid>
  );
};

const Skill = (props) => {
  return (
    <Container>
      <Typography variant="h4">Skills</Typography>
      <Divider
        variant="middle"
        style={{
          margin: 5,
          backgroundColor: "#4B5BEA",
          maxWidth: "20%",
        }}
      />
      <p />
      {props.skills.top.map((skill, index) => (
        <SkillChip skill={skill} key={skill} />
      ))}

      {props.skills.other.map((skill, index) => (
        <SkillChip skill={skill} key={skill} />
      ))}
    </Container>
  );
};

const Project = (props) => {
  return (
    <Container>
      {/* TODO make this click able */}
      <Typography variant="h4">Project</Typography>
      <Divider
        variant="middle"
        style={{
          margin: 5,
          backgroundColor: "#4B5BEA",
          maxWidth: "20%",
        }}
      />
      <p />
      <Grid item xs={12} container spacing={3} alignContent="center">
        <Grid item xs={6}>
          <Typography>Owned: {props.projects.projects_created}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Selected: {props.projects.projects_selected}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Open: {props.projects.open}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Closed: {props.projects.closed}</Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

const Info = (props) => {
  return (
    <Container>
      <Typography variant="h4">About Me</Typography>
      <Divider
        variant="middle"
        style={{
          margin: 5,
          backgroundColor: "#4B5BEA",
          maxWidth: "20%",
        }}
      />
      <p />
      <Contact profile={props.profile} />

      <p />

      <Typography>{props.profile.information.bio}</Typography>

      <p />
      <Grid item xs={12} container>
        <Grid item xs={9} container spacing={3}>
          <Grid item xs={1}>
            <WorkIcon />
          </Grid>
          <Grid item xs={8}>
            <Typography>{props.profile.information.institution}</Typography>
          </Grid>
        </Grid>

        <Grid item xs={2}>
          <Button
            variant="outlined"
            onClick={handleDownloadButton}
            value={props.profile.experience.resume}
          >
            Download Resume
          </Button>
        </Grid>
        <a href={props.profile.experience.resume} download="proposed_file_name">Download</a>
      </Grid>
    </Container>
  );
};

const Contact = (props) => {
  return (
    <Grid container>
      {!(props.profile.information.socials.github.length === 0) ? (
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

      {!(props.profile.information.socials.linkedin.length === 0) ? (
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

      {!(props.profile.information.socials.email.length === 0) ? (
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

      {!(props.profile.information.socials.website.length === 0) ? (
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

const handleDownloadButton = (e) => {
  var link = document.createElement("a");
  link.download = "file.pdf";

  link.href = e.currentTarget.value;
  link.dispatchEvent(new MouseEvent("click"));
};
