import React from 'react'
import { Typography, Toolbar, AppBar } from '@material-ui/core'

const NavBar = () => {
    return (
        <div>
            <AppBar position='static' >
                <Toolbar>
                    <Typography align='center' varient='title' color='inherit'>
                        Projects
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default NavBar;