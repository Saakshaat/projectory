import React from "react";
import Typography from "@material-ui/core/Typography";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import { Container, Divider, Grid, Button } from "@material-ui/core";
import SkillChip from "../Components/SkillChip";
import WorkIcon from "@material-ui/icons/Work";
import EmailIcon from "@material-ui/icons/Email";

const ProfileMain = (props) => {
  return (
    <div>
      <div>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12} container>
              <Grid item xs={12}>
                <Typography variant="h4">
                  {props.profile.information.name}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Contact profile={props.profile} />
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

            <Grid item xs={6} container spacing={3}>
              <Grid item xs={12}>
                <Info profile={props.profile} />
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default ProfileMain;

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
      {props.skills.map((skill, index) => (
        <SkillChip skill={skill} key={skill} />
      ))}
    </Container>
  );
};

const Project = (props) => {
  return (
    <Container>
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
          <Button variant="outlined">Download Resume</Button>
        </Grid>
      </Grid>
    </Container>
  );
};

const Contact = (props) => {
  console.log(props);
  return (
    <div>
      {/* TODO hide this if there are no github link */}
      <a style={{ margin: 5 }} href={props.profile.information.socials.github}>
        <GitHubIcon color="primary" />
      </a>

      {/* TODO hide this if there are no linkedin link */}
      <a style={{ margin: 5 }} href={props.profile.information.socials.github}>
        <LinkedInIcon color="primary" />
      </a>

      {/* TODO hide this if there are no email link */}
      <a
        style={{ margin: 5 }}
        href={"mailto:" + props.profile.credentials[0].email}
      >
        <EmailIcon color="primary" />
      </a>
    </div>
  );
};
