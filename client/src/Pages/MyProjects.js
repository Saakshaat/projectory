import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import NavBar from '../Components/NavBar'
import ProjectList from "../Components/ProjectList";
import NavDrawer from '../Components/NavDrawer'
import { useHistory } from "react-router-dom";
import { CssBaseline, Card, FormControlLabel, Switch, FormGroup, Grid, Typography, FormLabel, FormControl, RadioGroup, Radio } from "@material-ui/core";


export default class MyProjects extends Component {


    constructor(props) {
        super(props);
        this.state = {
            value: '',
            created: false,
            selected: false,
            endpoint: '/baseapi/my/projects/open/all',
        };
    }

    // handleChangeSwitch = (event) => {
    //     this.setState({
    //         [event.target.name]: event.target.checked,
    //     });
    //     this.handleEndpoint();
    // };

    // handleChangeRadio = (event) => {

    //     this.setState({
    //         value: event.target.value,
    //     });
    //     console.log(this.state.value)
    //     this.handleEndpoint();

    // };

    // handleEndpoint = () => {

    //     var niche = 'all';
    //     if (this.state.created && this.state.selected) {
    //         niche = 'all'
    //     } else if (this.state.created) {
    //         niche = 'created'
    //     } else if (this.state.selected) {
    //         niche = 'selected'
    //     }

    //     this.setState({
    //         endpoint: '/baseapi/my/projects/' + this.state.value + '/' + niche,
    //     });
    //     console.log(this.state.endpoint)
    // }

    // <Card elevation={2} style={{
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     display: 'flex',
    //     marginTop: 25,
    //     marginLeft: '30%',
    //     marginRight: '30%'
    // }}>
    //     <FormControl component="fieldset">
    //         <RadioGroup row name="project_status" value={this.state.value} onChange={this.handleChangeRadio} >
    //             <FormControlLabel value="open" control={<Radio />} label="Open" />
    //             <FormControlLabel value="closed" control={<Radio />} label="Closed" />
    //         </RadioGroup>
    //     </FormControl>
    //     <FormGroup row >
    //         <FormControlLabel
    //             control={
    //                 <Switch
    //                     checked={this.state.createdProjects}
    //                     onChange={this.handleChangeSwitch}
    //                     name="createdProjects"
    //                 />
    //             }
    //             label='Created'
    //         />
    //         <FormControlLabel
    //             control={
    //                 <Switch
    //                     checked={this.state.selectedProjects}
    //                     onChange={this.handleChangeSwitch}
    //                     name="selectedProjects" />}
    //             label='Selected'
    //         />
    //     </FormGroup>
    // </Card>

    render() {
        return (
            <div>
                <ProjectList caller='MyProjects' endpoint='/baseapi/my/projects/open/all' header={localStorage.FBIdToken} applicable={false} />
            </div>
        );
    }
}
