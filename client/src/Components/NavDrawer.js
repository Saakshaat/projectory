import React, { useState, Fragment } from 'react';
import clsx from 'clsx';
import { Router, Route, Link, BrowserRouter, Switch } from "react-router-dom";
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

    const toggleDrawer = () => {
        setDrawer(!drawer)
    }

    const onItemClick = title => () => {
        setTitle(title);
        setDrawer(!drawer);
    }

    return (
        <div>
            <CssBaseline />
            <NavBar toggleDrawer={toggleDrawer} title={title} />
            <BrowserRouter history={history}>
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
                        <ListItem button component={Link} to='/signin' onClick={onItemClick('SignIn')}>
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
                        <Route exact path="/my/profile/" component={SignUp} />
                        <Route exact path="/my/applications/" component={MyApplications} />
                        <Route exact path="/my/projects/" component={MyProjects} />
                        <Route exact path="/signin" component={SignIn} />
                        <Route exact path="/dashboard" component={Dashboard} />
                        <Route exact path="/" component={Dashboard} />
                    </Switch>
                </main>
            </BrowserRouter>
        </div>
    );
}

export default NavDrawer;