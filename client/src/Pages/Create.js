import React, { Component } from "react";
import { Button } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

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
      github: "",
      linkedin: "",
      skill: [],
      created: false,
    };
  }

  handleSummitButton = (e) => {
    e.preventDefault();
    let credentials = this.props.location.state.credentials;
    let uid = this.props.location.state.uid;

    const request = {
      uid,
      credentials,
      information: {
        name: this.state.name,
        bio: this.state.bio,
        institution: this.state.institution,
        socials: {
          github: this.state.github,
          linkedin: this.state.linkedin,
        },
      },
      experience: {
        skills: this.state.skill,
      },
    };

    axios
      .post("/create", request)
      .then((res) => {
        // TODO handle different type of request
        this.setState({ created: true });
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value,
    });
  };

  handleInstitutionChange = (e) => {
    this.setState({
      institution: e.target.value,
    });
  };

  handleBioChange = (e) => {
    this.setState({
      bio: e.target.value,
    });
  };

  handleGithubChange = (e) => {
    this.setState({
      github: e.target.value,
    });
  };

  handleLinkedinChange = (e) => {
    this.setState({
      linkedin: e.target.value,
    });
  };

  handleSkillChange = (e, data) => {
    let tmpSkill = [];
    for (let i = 0; i < data.length; i++) {
      tmpSkill.push(data[i].name);
    }
    this.setState({
      skill: tmpSkill,
    });
  };

  render() {
    if (this.state.created) {
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
              <Grid item xs={12}>
                <TextField
                  label="Institution"
                  required
                  fullWidth
                  onChange={this.handleInstitutionChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Bio"
                  required
                  fullWidth
                  onChange={this.handleBioChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="GitHub"
                  required
                  fullWidth
                  onChange={this.handleGithubChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="LinkedIn"
                  required
                  fullWidth
                  onChange={this.handleLinkedinChange}
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
                        label={option.name}
                        style={{ backgroundColor: option.color }}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Skills *"
                      placeholder="Add a skill"
                    />
                  )}
                  onChange={this.handleSkillChange}
                />
              </Grid>
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
            </Grid>
          </form>
        </div>
      );
    }
  }
}
