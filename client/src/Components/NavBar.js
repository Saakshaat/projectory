import React from 'react'
import { Typography, Toolbar, AppBar, Menu, MenuItem } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Switch, Route, BrowserRouter, Link } from 'react-router-dom';
import Create from '../Pages/Create';
import Dashboard from '../Pages/Dashboard';

const NavBar = ({ toggleDrawer, title, className1, className2 }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleLogout = () => {
        handleClose();
    }

    return (
        <div>
            <AppBar position='static' className={className1}>
                <Toolbar>
                    <IconButton
                        className2={className2}
                        color="inherit"
                        aria-label="Menu"
                        onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        color="inherit">
                        {title}
                    </Typography>
                    <span style={{ marginLeft: 'auto' }}>
                        <IconButton
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color='inherit'
                            onClick={handleClick}
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </span>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default NavBar;