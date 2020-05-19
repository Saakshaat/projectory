import React, { Component } from "react";
import {
  Grid,
  Button,
  TextField,
  Chip,
  Typography,
} from "@material-ui/core";
import ErrorText from "../Components/ErrorText";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Redirect } from "react-router-dom";
import axios from "axios";

const skills = require("../Utils/Skill");

export default class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      institution: "",
      bio: "",
      headline: "",
      github: "",
      linkedin: "",
      website: "",
      topSkill: [],
      otherSkill: [],
      resume: undefined,

      hasEmptyName: false,
      hasEmptyInstitution: false,
      hasEmptyHeadline: false,
      hasEmptyBio: false,
      hasEmptyGitHub: false,
      hasEmptyLinkedIn: false,
      hasEmptyTopSkill: false,
      hasTooManyTopSkill: false,
      hasNoResume: false,

      isHeadlineTooLong: false,

      resumeUpLoaded: false,
      created: false,
      isLoggedIn: false,

      hasError: false,
      errorText: "",
    };
    if (localStorage.FBIdToken) this.state.isLoggedIn = true;
  }

  handleSummitButton = (e) => {
    e.preventDefault();
    this.setState({
      hasEmptyName: false,
      hasEmptyInstitution: false,
      hasEmptyHeadline: false,
      hasEmptyBio: false,
      hasEmptyGitHub: false,
      hasEmptyLinkedIn: false,
      hasEmptyTopSkill: false,
      hasTooManyTopSkill: false,
      hasNoResume: false,
      isHeadlineTooLong: false,
      hasError: false,
    });
    if (this.state.name.length === 0) {
      this.setState({ hasEmptyName: true });
      return;
    }
    if (this.state.institution.length === 0) {
      this.setState({ hasEmptyInstitution: true });
      return;
    }
    if (this.state.headline.length === 0) {
      this.setState({ hasEmptyHeadline: true });
      return;
    }
    if (this.state.headline.length > 120) {
      this.setState({ isHeadlineTooLong: true });
      return;
    }
    if (this.state.bio.length === 0) {
      this.setState({ hasEmptyBio: true });
      return;
    }
    if (this.state.github.length === 0) {
      this.setState({ hasEmptyGitHub: true });
      return;
    }
    if (this.state.linkedin.length === 0) {
      this.setState({ hasEmptyLinkedIn: true });
      return;
    }
    if (this.state.topSkill.length > 5) {
      this.setState({ hasTooManyTopSkill: true });
      return;
    }
    if (this.state.topSkill.length === 0) {
      this.setState({ hasEmptyTopSkill: true });
      return;
    }
    if (this.state.resume === undefined) {
      this.setState({ hasNoResume: true });
      return;
    }

    for (let i = 0; i < this.state.topSkill.length; i++)
      for (let j = 0; j < this.state.otherSkill.length; j++)
        if (this.state.otherSkill[j] === this.state.topSkill[i])
          this.setState({ otherSkill: this.state.otherSkill.splice(j, 1) });

    let credentials = this.props.location.state.credentials.credentials;
    let uid = this.props.location.state.uid.uid;
    const request = {
      uid: uid,
      credentials,
      information: {
        name: this.state.name,
        bio: this.state.bio,
        socials: {
          github: this.state.github,
          linkedin: this.state.linkedin,
          website: this.state.website,
        },
        institution: this.state.institution,
      },
      experience: {
        skills: {
          top: this.state.topSkill,
          others: this.state.otherSkill,
        },
        headline: this.state.headline,
      },
    };

    axios
      .post("/baseapi/create", request)
      .then((res) => {
        // TODO handle different type of request
        this.setState({ created: true });
        this.uploadResume();
      })
      // TODO handle different type of errors
      .catch((err) => {
        console.log("Create Profile Error");
        console.log(err.response);
        this.setState({ hasError: true });
        return;
      });
  };

  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  };

  handleInstitutionChange = (e) => {
    this.setState({ institution: e.target.value });
  };

  handleBioChange = (e) => {
    this.setState({ bio: e.target.value });
  };

  handleHeadlineChange = (e) => {
    this.setState({ headline: e.target.value });
  };

  handleGithubChange = (e) => {
    this.setState({ github: e.target.value });
  };

  handleLinkedinChange = (e) => {
    this.setState({ linkedin: e.target.value });
  };

  handleWebsiteChange = (e) => {
    this.setState({ website: e.target.value });
  };

  handleTopSkillChange = (e, data) => {
    let tmpSkill = [];
    for (let i = 0; i < data.length; i++) tmpSkill.push(data[i].name);
    this.setState({ topSkill: tmpSkill });
  };

  handleOtherSkillChange = (e, data) => {
    let tmpSkill = [];
    for (let i = 0; i < data.length; i++) {
      tmpSkill.push(data[i].name);
    }
    this.setState({
      otherSkill: tmpSkill,
    });
  };

  handleResumeChange = (e) => {
    this.setState({ resume: e.target.files[0] });
    if (e.target.files[0] !== undefined) this.setState({ hasNoResume: false });
  };

  // handleProfilePicChange = (e) => {
  //   this.setState({ profilePic: e.target.files[0] });
  // };



  uploadResume = () => {
    const data = new FormData();
    data.append("resume", this.state.resume, this.state.resume.name);
    axios
      .post("/baseapi/my/profile/resume", data, {
        headers: {
          Authorization: localStorage.FBIdToken,
        },
      })
      .then((res) => {
        this.setState({ resumeUpLoaded: true });
      })
      .catch((err) => {
        console.log("uploadResume Error");
        this.setState({ hasError: true });
      });
  };

  render() {
    if (!this.state.isLoggedIn) return <Redirect to="/" />;
    if (this.state.created && this.state.resumeUpLoaded) {
      return <Redirect to="/user" />;
    } else {
      return (
        <div>
          <Typography component="h1" variant="h5">
            More about you
          </Typography>
          <form noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  required
                  fullWidth
                  onChange={this.handleNameChange}
                />
              </Grid>
              {this.state.hasEmptyName ? (
                <Grid item xs={12}>
                  <ErrorText text="Name cannot be empty!" />
                </Grid>
              ) : (
                <div />
              )}

              <Grid item xs={12}>
                <TextField
                  label="Institution"
                  required
                  fullWidth
                  onChange={this.handleInstitutionChange}
                />
              </Grid>
              {this.state.hasEmptyInstitution ? (
                <Grid item xs={12}>
                  <ErrorText text="Institutuion cannot be empty!" />
                </Grid>
              ) : (
                <div />
              )}

              <Grid item xs={12}>
                <TextField
                  label="Headline"
                  placeholder="Describe yourself in just a few words"
                  required
                  fullWidth
                  multiline
                  onChange={this.handleHeadlineChange}
                />
              </Grid>
              {this.state.isHeadlineTooLong ? (
                <Grid item xs={12}>
                  <ErrorText text="Headline cannot contain more than 100 characters!" />
                </Grid>
              ) : (
                <div />
              )}
              {this.state.hasEmptyHeadline ? (
                <Grid item xs={12}>
                  <ErrorText text="Headline cannot be empty!" />
                </Grid>
              ) : (
                <div />
              )}

              <Grid item xs={12}>
                <TextField
                  label="Bio"
                  required
                  fullWidth
                  onChange={this.handleBioChange}
                  multiline
                />
              </Grid>
              {this.state.hasEmptyBio ? (
                <Grid item xs={12}>
                  <ErrorText text="Bio cannot be empty!" />
                </Grid>
              ) : (
                <div />
              )}

              <Grid item xs={12}>
                <TextField
                  label="GitHub"
                  required
                  fullWidth
                  onChange={this.handleGithubChange}
                />
              </Grid>
              {this.state.hasEmptyGitHub ? (
                <Grid item xs={12}>
                  <ErrorText text="Github cannot be empty!" />
                </Grid>
              ) : (
                <div />
              )}

              <Grid item xs={12}>
                <TextField
                  label="LinkedIn"
                  fullWidth
                  onChange={this.handleLinkedinChange}
                />
              </Grid>
              {this.state.hasEmptyLinkedIn ? (
                <Grid item xs={12}>
                  <ErrorText text="LinkedIn cannot be empty!" />
                </Grid>
              ) : (
                <div />
              )}

              <Grid item xs={12}>
                <TextField
                  label="Website"
                  fullWidth
                  onChange={this.handleWebsiteChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={skills}
                  getOptionLabel={(option) => option.name}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        size="small"
                        variant="outlined"
                        label={option.name}
                        style={{
                          margin: 5,
                          borderColor: option.color,
                          color: option.color,
                        }}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      variant="standard"
                      label="Best Skills"
                      placeholder="You best at"
                    />
                  )}
                  onChange={this.handleTopSkillChange}
                />
              </Grid>
              {this.state.hasTooManyTopSkill ? (
                <Grid item xs={12}>
                  <ErrorText text="You can select at most 5 top skills" />
                </Grid>
              ) : (
                <div />
              )}
              {this.state.hasEmptyTopSkill ? (
                <Grid item xs={12}>
                  <ErrorText text="Top Skills cannot be empty!" />
                </Grid>
              ) : (
                <div />
              )}
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={skills}
                  getOptionLabel={(option) => option.name}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        size="small"
                        variant="outlined"
                        label={option.name}
                        style={{
                          margin: 5,
                          borderColor: option.color,
                          color: option.color,
                        }}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Other Skills"
                      placeholder="Add some skill"
                    />
                  )}
                  onChange={this.handleOtherSkillChange}
                />
              </Grid>

              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  component="label"
                  onChange={this.handleResumeChange}
                >
                  Upload Your Resume
                  <input type="file" style={{ display: "none" }} />
                </Button>
                {this.state.resume !== undefined ? (
                  <Grid item xs={12}>
                    <Typography variant="caption">
                      {this.state.resume.name} selected!
                    </Typography>
                  </Grid>
                ) : (
                  <div />
                )}
              </Grid>

              {this.state.hasNoResume ? (
                <Grid item xs={12}>
                  <ErrorText text="You must upload a resume" />
                </Grid>
              ) : (
                <div />
              )}

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  color="primary"
                  onClick={this.handleSummitButton}
                >
                  Submit
                </Button>
              </Grid>
              {this.state.hasError ? (
                <Grid item xs={12}>
                  <ErrorText text={this.state.errorText} />
                </Grid>
              ) : (
                <div />
              )}
            </Grid>
          </form>
        </div>
      );
    }
  }
}
