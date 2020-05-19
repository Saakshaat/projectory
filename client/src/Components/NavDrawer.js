import React, { useState, Fragment } from 'react';
import clsx from 'clsx';
import { Router, Route, Link, BrowserRouter, Switch, Redirect } from "react-router-dom";
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
import { CssBaseline, makeStyles, ListItemIcon } from '@material-ui/core';
import SignIn from '../Pages/SignIn';
import axios from 'axios';


const drawerWidth = 250;
const history = createBrowserHistory();

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

    const classes = styles();
    const [drawer, setDrawer] = useState(false);
    const [title, setTitle] = useState('Dashboard')
    const [isLoggedIn, setLogIn] = useState(true);

    const toggleDrawer = () => {
        setDrawer(!drawer)
    }

    const onItemClick = title => () => {
        setTitle(title);
        setDrawer(!drawer);
    }

    // if (!isLoggedIn) {
    //     return <Redirect to='/signin' />;
    // }

    return (
        <div>
            <CssBaseline />
            <NavBar toggleDrawer={toggleDrawer} title={title} />
            <BrowserRouter history={history}>
                <Fab color="primary" aria-label="add" size='medium' style={{
                    margin: 0,
                    top: 'auto',
                    right: 40,
                    bottom: 40,
                    left: 'auto',
                    position: 'fixed',
                }}>
                    <AddIcon />
                </Fab>
                <Drawer variant='temporary' open={drawer} onClose={toggleDrawer} classes={{ paper: classes.drawerPaper }}>
                    <List>
                        <ListItem color='primary' component={Typography}>
                            <Typography gutterBottom variant='h5' component='h2'>
                                Projectory
                            </Typography>
                        </ListItem>
                        <ListItem button component={Link} to='/dashboard' onClick={onItemClick('Dashboard')}>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText>Dashboard</ListItemText>
                        </ListItem>
                        <ListItem button component={Link} to='/my/profile/' onClick={onItemClick('Profile')}>
                            <ListItemIcon>
                                <AccountBoxIcon />
                            </ListItemIcon>
                            <ListItemText>Profile</ListItemText>
                        </ListItem>
                        <ListItem button component={Link} to='/create' onClick={onItemClick('Teams')}>
                            <ListItemIcon>
                                <GroupIcon />
                            </ListItemIcon>
                            <ListItemText>Teams</ListItemText>
                        </ListItem>
                        <ListItem button component={Link} to='/my/projects/' onClick={onItemClick('Projects')}>
                            <ListItemIcon>
                                <AccountTreeIcon />
                            </ListItemIcon>
                            <ListItemText>Your Projects</ListItemText>
                        </ListItem>
                        <ListItem button component={Link} to='/my/applications/' onClick={onItemClick('Applications')}>
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
                        <Route exact path="/signin" component={SignIn} />
                        <Route exact path="/create" component={Create} />
                        <Route exact path="/my/applications/" component={MyApplications} />
                        <Route exact path="/my/projects/" component={MyProjects} />
                        <Route exact path="/dashboard" component={Dashboard} />
                        <Route exact path="/" component={Dashboard} />
                    </Switch>
                </main>
            </BrowserRouter>
        </div>
    );
}

export default NavDrawer;