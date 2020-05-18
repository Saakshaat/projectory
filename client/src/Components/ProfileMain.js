import React from "react";
import Typography from "@material-ui/core/Typography";

import {
  Container,
  Divider,
  Grid,
  Button,
  Avatar,
  IconButton,
  Dialog,
  Chip,
  TextField,
  CircularProgress,
  Card,
  CardMedia,
  Tooltip,
  Menu,
  MenuItem,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";

import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";

import SkillChip from "../Components/SkillChip";

import WorkIcon from "@material-ui/icons/Work";
import EmailIcon from "@material-ui/icons/Email";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import LanguageIcon from "@material-ui/icons/Language";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import axios from "axios";

const skills = require("../Utils/Skill");

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

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const getSkillList = (skillArr) => {
  //TODO impove searching process\
  let res = [];
  for (let j = 0; j < skillArr.length; j++) {
    for (let i = 0; i < skills.length; i++) {
      if (skills[i].name === skillArr[j]) {
        res.push(skills[i]);
        break;
      }
    }
  }
  return res;
};

const ProfileMain = (props) => {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(props.profile.information.name);
  const [institution, setInstituion] = React.useState(
    props.profile.information.institution
  );
  const [headline, setHeadline] = React.useState(
    props.profile.experience.headline
  );
  const [bio, setBio] = React.useState(props.profile.information.bio);
  const [github, setGithub] = React.useState(
    props.profile.information.socials.github
  );
  const [linkedin, setLinkedin] = React.useState(
    props.profile.information.socials.linkedin
  );
  const [website, setWebsite] = React.useState(
    props.profile.information.socials.website
  );
  const [topSkills, setTopSkills] = React.useState(
    props.profile.experience.skills.top
  );
  const [otherSkills, setOtherSkills] = React.useState(
    props.profile.experience.skills.other
  );
  const [emtyName, setEmptyName] = React.useState(false);
  const [emptyInstitution, setEmptyInstitution] = React.useState(false);
  const [emptyHeadline, setEmptyHeadline] = React.useState(false);
  const [emptyBio, setEmptyBio] = React.useState(false);
  const [emptyTopSkills, setEmptyTopSkills] = React.useState(false);
  const [headlineTooLong, setHeadlineTooLong] = React.useState(false);
  const [topSkillsTooLong, setTopSkillsTooLong] = React.useState(false);
  const [waiting, setWaiting] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setEmptyName(false);
    if (name.length === 0) {
      setEmptyName(true);
      return;
    }

    setEmptyInstitution(false);
    if (institution.length === 0) {
      setEmptyInstitution(true);
      return;
    }

    setEmptyHeadline(false);
    if (headline.length === 0) {
      setEmptyHeadline(true);
      return;
    }

    setHeadlineTooLong(false);
    if (headline.length > 100) {
      setHeadlineTooLong(true);
      return;
    }

    setEmptyBio(false);
    if (bio.length === 0) {
      setEmptyBio(true);
      return;
    }

    setEmptyTopSkills(false);
    if (topSkills.length === 0) {
      setEmptyTopSkills(true);
      return;
    }

    setTopSkillsTooLong(false);
    if (topSkills.length > 5) {
      setTopSkillsTooLong(true);
      return;
    }

    for (let i = 0; i < topSkills.length; i++)
      for (let j = 0; j < otherSkills.length; j++)
        if (otherSkills[j] === topSkills[i])
          setOtherSkills(otherSkills.splice(j, 1));

    const request = {
      information: {
        name: name,
        bio: bio,
        socials: {
          github: github,
          linkedin: linkedin,
          website: website,
          email: props.profile.information.socials.email,
        },
        institution: institution,
      },
      experience: {
        skills: {
          top: topSkills,
          others: otherSkills,
        },
        headline: headline,
      },
    };

    console.log("Editing Profile ...");
    axios
      .post("/baseapi/edit/profile", request, {
        headers: {
          Authorization: localStorage.FBIdToken,
        },
      })
      .then((res) => {
        setOpen(false);
        window.location.reload(false);
      })
      // TODO handle different type of errors
      .catch((err) => {
        console.log("Create Profile Error");
        console.log(err.response);
      });
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleInstitutionChange = (e) => {
    setInstituion(e.target.value);
  };

  const handleHeadlineChange = (e) => {
    setHeadline(e.target.value);
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleGithubChange = (e) => {
    setGithub(e.target.value);
  };

  const handleLinkedinChange = (e) => {
    setLinkedin(e.target.value);
  };

  const handleWebsiteChange = (e) => {
    setWebsite(e.target.value);
  };

  const handleTopSkillChange = (e, data) => {
    let tmpSkill = [];
    for (let i = 0; i < data.length; i++) tmpSkill.push(data[i].name);
    setTopSkills(tmpSkill);
  };

  const handleOtherSkillChange = (e, data) => {
    let tmpSkill = [];
    for (let i = 0; i < data.length; i++) tmpSkill.push(data[i].name);
    setOtherSkills(tmpSkill);
  };

  return (
    <div>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} container>
            <Grid item xs={12}>
              <Header profile={props.profile} auth={props.auth} />
            </Grid>
          </Grid>

          {/* Skills and Project */}
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
            <Grid item>
              <Info profile={props.profile} auth={props.auth} />
            </Grid>

            {/*Edit Profile*/}
            {props.auth ? (
              <Grid
                item
                container
                direction="column"
                alignItems="center"
                justify="center"
              >
                <Grid item>
                  <Chip
                    variant="outlined"
                    color="secondary"
                    icon={<EditIcon />}
                    label="Edit Profile"
                    clickable
                    onClick={handleClickOpen}
                  />
                </Grid>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
      </Container>

      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          style={{ marginBottom: -15 }}
        >
          Edit Profile
        </DialogTitle>

        <DialogContent style={{ margin: 0 }}>
          <Grid container spacing={2}>
            {/* name */}
            <Grid item xs={12}>
              {!emtyName ? (
                <TextField
                  label="Name"
                  required
                  fullWidth
                  onChange={handleNameChange}
                  defaultValue={props.profile.information.name}
                />
              ) : (
                <TextField
                  label="Name"
                  required
                  fullWidth
                  onChange={handleNameChange}
                  error
                  helperText="Name cannot be empty."
                />
              )}
            </Grid>

            {/* institution */}
            <Grid item xs={12}>
              {!emptyInstitution ? (
                <TextField
                  label="Institution"
                  required
                  fullWidth
                  onChange={handleInstitutionChange}
                  defaultValue={props.profile.information.institution}
                />
              ) : (
                <TextField
                  label="Institution"
                  required
                  fullWidth
                  onChange={handleInstitutionChange}
                  error
                  helperText="Instituition cannot be empty."
                />
              )}
            </Grid>

            {/* headline */}
            <Grid item xs={12}>
              {!emptyHeadline && !headlineTooLong ? (
                <TextField
                  label="Headline"
                  multiline
                  required
                  fullWidth
                  placeholder="Describe yourself in just a few words"
                  onChange={handleHeadlineChange}
                  defaultValue={props.profile.experience.headline}
                />
              ) : (
                <TextField
                  label="Headline"
                  multiline
                  required
                  fullWidth
                  placeholder="Describe yourself in just a few words"
                  onChange={handleHeadlineChange}
                  error
                  helperText="Headline should have between 1 and 100 characters"
                />
              )}
            </Grid>

            {/* bio */}
            <Grid item xs={12}>
              {!emptyBio ? (
                <TextField
                  label="Bio"
                  multiline
                  required
                  fullWidth
                  onChange={handleBioChange}
                  defaultValue={props.profile.information.bio}
                />
              ) : (
                <TextField
                  label="Bio"
                  multiline
                  required
                  fullWidth
                  onChange={handleBioChange}
                  error
                  helperText="Bio cannot be empty."
                />
              )}
            </Grid>

            {/* github */}
            <Grid item xs={12}>
              <TextField
                label="Github"
                fullWidth
                onChange={handleGithubChange}
                defaultValue={props.profile.information.socials.github}
              />
            </Grid>

            {/* github */}
            <Grid item xs={12}>
              <TextField
                label="LinkedIn"
                fullWidth
                onChange={handleLinkedinChange}
                defaultValue={props.profile.information.socials.linkedin}
              />
            </Grid>

            {/* website */}
            <Grid item xs={12}>
              <TextField
                label="Website"
                fullWidth
                onChange={handleWebsiteChange}
                defaultValue={props.profile.information.socials.website}
              />
            </Grid>

            {/* top skills */}
            <Grid item xs={12}>
              {!emptyTopSkills && !topSkillsTooLong ? (
                <Autocomplete
                  multiple
                  options={skills}
                  getOptionLabel={(option) => option.name}
                  defaultValue={getSkillList(
                    props.profile.experience.skills.top
                  )}
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
                      required
                      {...params}
                      variant="standard"
                      label="Best Skills"
                      placeholder="You best at"
                    />
                  )}
                  onChange={handleTopSkillChange}
                />
              ) : (
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
                      required
                      {...params}
                      variant="standard"
                      label="Best Skills"
                      placeholder="You best at"
                      error
                      helperText="Top Skills should have between 1 to 5 skills"
                    />
                  )}
                  onChange={handleTopSkillChange}
                />
              )}
            </Grid>

            {/* other skills */}
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={skills}
                getOptionLabel={(option) => option.name}
                defaultValue={getSkillList(
                  props.profile.experience.skills.other
                )}
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
                  />
                )}
                onChange={handleOtherSkillChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button autoFocus onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProfileMain;

const avaStyles = makeStyles((theme) => ({
  hover: {
    "&:hover": {
      backgroundColor: "#FF0000",
    },
  },
}));

const Header = (props) => {
  const hanldeUploadAvatar = (e) => {
    if (e.target.files[0] === undefined) return;
    const data = new FormData();
    data.append("picture", e.target.files[0], e.target.files[0].name);
    axios
      .post("/baseapi/my/profile/image", data, {
        headers: {
          Authorization: localStorage.FBIdToken,
        },
      })
      .then((res) => {
        window.location.reload(false);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const ava = avaStyles();
  const classes = useStyles();
  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Grid item xs={12}>
        {props.auth ? (
          <div>
            <Tooltip title="Edit Profile Picture" placement="right">
              <IconButton
                size="small"
                component="label"
                className={ava.hover}
                onChange={hanldeUploadAvatar}
              >
                <Avatar
                  className={classes.large}
                  src={props.profile.information.imageUrl}
                  alt="Profile Picture"
                />
                <input
                  accept="image/*"
                  type="file"
                  style={{ display: "none" }}
                />
              </IconButton>
            </Tooltip>
          </div>
        ) : (
          <div>
            <Avatar
              className={classes.large}
              src={props.profile.information.imageUrl}
              alt="Profile Picture"
            />
          </div>
        )}
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
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const hanldeUploadResume = (e) => {
    if (e.target.files[0] === undefined) return;
    const data = new FormData();
    data.append("resume", e.target.files[0], e.target.files[0].name);
    axios
      .post("/baseapi/my/profile/resume", data, {
        headers: {
          Authorization: localStorage.FBIdToken,
        },
      })
      .then((res) => {
        setAnchorEl(null);
        window.location.reload(false);
      })
      .catch((err) => {
        console.log("uploadResume Error");
      });
  };

  const handleViewButton = (e) => {
    window.open(props.profile.experience.resume);
  };

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
          {props.auth ? (
            <div>
              <Button
                variant="outlined"
                // onClick={handleDownloadButton}
                value={props.profile.experience.resume}
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                View Resume
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleViewButton}>View Resume</MenuItem>
                <MenuItem onChange={hanldeUploadResume} component="label">
                  Edit Resume
                  <input type="file" style={{ display: "none" }} />
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Button variant="outlined" onClick={handleViewButton}>
              View Resume
            </Button>
          )}
        </Grid>

        {/* <Grid item xs={1}>
          <IconButton>
            <EditIcon color="primary" />
          </IconButton>
        </Grid> */}
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
