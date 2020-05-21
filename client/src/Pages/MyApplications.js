import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import NavBar from '../Components/NavBar'
import ProjectList from "../Components/ProjectList";
import NavDrawer from '../Components/NavDrawer'
import { CssBaseline } from "@material-ui/core";


export default class MyApplications extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    //This exists
    render() {
        const { isLoggedIn } = this.state
        return (
            <div>
                <ProjectList endpoint='/baseapi/my/applications' header={localStorage.FBIdToken} applicable={false} />
            </div>
        );
    }
}
