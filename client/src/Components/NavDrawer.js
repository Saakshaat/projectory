import React, { useState, Fragment } from 'react';
import clsx from 'clsx';
import { Router, Route, Link, BrowserRouter, Switch, Redirect, NavLink, useHistory, HashRouter } from "react-router-dom";
import { createBrowserHistory } from "history";

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import SignUp from "../Pages/SignUp";
import User from "../Pages/User";
import Create from "../Pages/Create";
import Dashboard from '../Pages/Dashboard';
import Profile from "../Pages/Profile";
import DashboardIcon from '@material-ui/icons/Dashboard';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import DescriptionIcon from '@material-ui/icons/Description';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import GroupIcon from '@material-ui/icons/Group';
import OtherProfile from "../Pages/OtherProfile";
import ProjectList from './ProjectList'
import MyApplications from '../Pages/MyApplications'
import MyProjects from '../Pages/MyProjects'
import NavBar from './NavBar';
import { CssBaseline, makeStyles, ListItemIcon, Dialog, DialogTitle, DialogContent, Grid, TextField, Chip, DialogActions, Button } from '@material-ui/core';
import SignIn from '../Pages/SignIn';
import axios from 'axios';
import Autocomplete from '@material-ui/lab/Autocomplete';


const drawerWidth = 250;
const skills = require("../Utils/Skill");
const history = require("history").createHashHistory();

const styles = makeStyles({
    root: {
        flexGrow: 1
    },
    flex: {
        flex: 1
    },
    drawerPaper: {
        position: "relative",
        width: drawerWidth
    },
});


function NavDrawer() {
    const [open, setOpen] = React.useState(false);
    const classes = styles();
    const [drawer, setDrawer] = useState(false);
    const [title, setTitle] = useState('Dashboard')
    const [isLoggedIn, setLogIn] = useState(true);

    const [name, setName] = React.useState('');
    const [emptyName, setEmptyName] = React.useState(false);

    const [gitHub, setGitHub] = React.useState('');
    const [emptyGitHub, setEmptyGitHub] = React.useState(false);

    const [description, setDescription] = React.useState('');
    const [emptyDescription, setEmptyDescription] = React.useState(false);

    const [needed, setNeeded] = React.useState('');
    const [emptyNeeded, setEmptyNeeded] = React.useState(false);

    const [links, setLinks] = React.useState('');
    const [emptyLink, setEmptyLinks] = React.useState(false);

    const history = useHistory();

    const handleValidate = () => {
        if (localStorage.FBIdToken) {
            axios
                .get("/baseapi/valid", {
                    headers: {
                        Authorization: localStorage.FBIdToken,
                    },
                })
                .then((response) => {
                    console.log(response)
                    if (response.status === 200) { } else {
                        history.push('/');
                    }
                })
                .catch((error) => {
                    console.log(error);
                    if (error.status === 429) {
                        axios
                            .get("/aux1/valid", {
                                headers: {
                                    Authorization: localStorage.FBIdToken,
                                },
                            })
                            .then((response) => {
                                console.log(response)
                                if (response.status === 200) { } else {
                                    history.push('/');
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                                if (error.status === 429) {
                                    axios
                                        .get("/aux2/valid", {
                                            headers: {
                                                Authorization: localStorage.FBIdToken,
                                            },
                                        })
                                        .then((response) => {
                                            console.log(response)
                                            if (response.status === 200) { } else {
                                                history.push('/');
                                            }
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });

                                } else { history.push('/'); }
                            });
                    } else { history.push('/'); }
                });
        } else {
            history.push('/');
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const toggleDrawer = () => {
        setDrawer(!drawer)
    }

    const onItemClick = title => () => {
        handleValidate();
        setTitle(title);
        setDrawer(!drawer);
    }

    const handleSubmit = () => {
        handleValidate();
        setEmptyName(false);
        if (name.length === 0) {
            setEmptyName(true);
            return;
        }

        setEmptyDescription(false);
        if (description.length === 0) {
            setEmptyDescription(true);
            return;
        }

        setEmptyGitHub(false);
        if (gitHub.length === 0) {
            setEmptyGitHub(true);
            return;
        }

        setEmptyNeeded(false);
        if (needed.length === 0) {
            setEmptyNeeded(true);
            return;
        }

        const request = {
            name: name,
            github: gitHub,
            description: description,
            needed: needed,
            links: links,
        };

        console.log("Creating Project ...");

        axios
            .post("/baseapi/project", request, {
                headers: {
                    Authorization: localStorage.FBIdToken,
                },
            })
            .then((res) => {
                setOpen(false);
                console.log(res)
                setInitial();
                return;
            })
            .catch((err) => {
                setOpen(false);
                console.log(err.response);
                setInitial();
                return;
            });
    };

    const setInitial = (history) => {
        setName('');
        setEmptyName(false);
        setDescription('');
        setEmptyDescription(false);
        setGitHub('');
        setEmptyGitHub(false);
        setLinks('');
        setEmptyLinks(false);
        setNeeded([]);
        setEmptyNeeded(false);
        window.location.reload();
    }

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleGithubChange = (e) => {
        setGitHub(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleNeededChange = (e, data) => {
        let temp = [];
        for (let i = 0; i < data.length; i++) temp.push(data[i].name);
        setNeeded(temp);
    };

    const handleLinkChange = (e) => {
        setLinks(e.target.value);
    };

    // const CreateDialog = (props) => {
    //     return (

    //     );
    // }
    // if (!isLoggedIn) {
    //     return <Redirect to='/signin' />;
    // } else

    // handleValidate();

    return (
        <div>
            <CssBaseline />
            <NavBar toggleDrawer={toggleDrawer} title={title} />
            <BrowserRouter>
                <Fab color="primary" aria-label="add" size='medium' onClick={handleClickOpen} centerRipple style={{
                    margin: 0,
                    top: 'auto',
                    right: 40,
                    bottom: 40,
                    left: 'auto',
                    position: 'fixed',
                }}>
                    <AddIcon />
                </Fab>

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
                        Create Project
            </DialogTitle>

                    <DialogContent style={{ margin: 0 }}>
                        <Grid container spacing={2}>
                            {/* name */}
                            <Grid item xs={12}>
                                {!emptyName ? (
                                    <TextField
                                        label="Name"
                                        required
                                        fullWidth
                                        onChange={handleNameChange}
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

                            {/* Description */}
                            <Grid item xs={12}>
                                {!emptyDescription ? (
                                    <TextField
                                        label="Description"
                                        required
                                        fullWidth
                                        onChange={handleDescriptionChange}
                                    />
                                ) : (
                                        <TextField
                                            label="Description"
                                            required
                                            fullWidth
                                            onChange={handleDescriptionChange}
                                            error
                                            helperText="Description cannot be empty."
                                        />
                                    )}
                            </Grid>

                            {/* GitHub */}
                            <Grid item xs={12}>
                                {!emptyGitHub ? (
                                    <TextField
                                        label="GitHub"
                                        multiline
                                        required
                                        fullWidth
                                        onChange={handleGithubChange}
                                    />
                                ) : (
                                        <TextField
                                            label="GitHub"
                                            multiline
                                            required
                                            fullWidth
                                            onChange={handleGithubChange}
                                            error
                                            helperText="GitHub Link cannot be empty"
                                        />
                                    )}
                            </Grid>

                            {/* Link */}
                            <Grid item xs={12}>
                                {(
                                    <TextField
                                        label="Link"
                                        fullWidth
                                        onChange={handleLinkChange}
                                    />
                                )}
                            </Grid>

                            {/* Needed Skills */}
                            <Grid item xs={12}>
                                {!emptyNeeded ? (
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
                                                        color: option.color,
                                                        borderColor: option.color
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
                                                label="Skills Needed"
                                            />
                                        )}
                                        onChange={handleNeededChange}
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
                                                            color: option.color,
                                                            borderColor: option.color
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
                                                    label="Skills Needed"
                                                    error
                                                    helperText="Skills cannot be 0"
                                                />
                                            )}
                                            onChange={handleNeededChange}
                                        />
                                    )}
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleSubmit} variant='contained' color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>

                <Drawer variant='temporary' defaultValue='/dashboard' open={drawer} onClose={toggleDrawer} classes={{ paper: classes.drawerPaper }}>
                    <List>
                        <ListItem color='primary' component={Typography}>
                            <Typography gutterBottom variant='h5' component='h2'>
                                Projectory
                            </Typography>
                        </ListItem>
                        <ListItem button component={NavLink} to='/dashboard' onClick={onItemClick('Dashboard')}>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText>Dashboard</ListItemText>
                        </ListItem>
                        <ListItem button component={NavLink} to='/my/profile/' onClick={onItemClick('Profile')}>
                            <ListItemIcon>
                                <AccountBoxIcon />
                            </ListItemIcon>
                            <ListItemText>Profile</ListItemText>
                        </ListItem>
                        <ListItem button component={NavLink} to='/create' onClick={onItemClick('Teams')}>
                            <ListItemIcon>
                                <GroupIcon />
                            </ListItemIcon>
                            <ListItemText>Teams</ListItemText>
                        </ListItem>
                        <ListItem button component={NavLink} to='/my/projects' onClick={onItemClick('Projects')}>
                            <ListItemIcon>
                                <AccountTreeIcon />
                            </ListItemIcon>
                            <ListItemText>Your Projects</ListItemText>
                        </ListItem>
                        <ListItem button component={NavLink} to='/my/applications' onClick={onItemClick('Applications')}>
                            <ListItemIcon>
                                <DescriptionIcon />
                            </ListItemIcon>
                            <ListItemText>Your Applications</ListItemText>
                        </ListItem>
                    </List>
                </Drawer>
                <main>
                    <Switch>
                        <Route exact path="/my/profile/" component={Profile} />
                        <Route path="/user/:userId/profile" component={OtherProfile} />
                        <Route exact path="/signin" component={SignIn} />
                        <Route exact path="/create" component={Create} />
                        <Route exact path="/my/applications" component={MyApplications} />
                        <Route exact path="/my/projects" component={MyProjects} />
                        <Route path="/user/:userId/profile" component={OtherProfile} />
                        <Route exact path="/dashboard" component={Dashboard} />
                        <Route exact path="/" component={Dashboard} />
                    </Switch>
                </main>
            </BrowserRouter>
        </div>
    );
}

export default NavDrawer;