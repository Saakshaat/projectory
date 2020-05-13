import React, { Component } from 'react'
import { Grid, TextField, Card } from '@material-ui/core'
import axios from 'axios'
import Project from './Project'

class ProjectList extends Component {

    constructor() {
        super()
        this.state = {
            projects: [
                {
                    creator: '',
                    createdAt: '',
                    description: '',
                    github: '',
                    name: '',
                    interested: [],
                    needed: [],
                    team: [],
                    user: '',
                }
            ],
            searchString: ''
        }
    }

    componentDidMount() {
        this.getProjects()
    }

    getProjects = () => {
        axios.get('https://us-central1-projectory-5171c.cloudfunctions.net/baseapi/projects/open')
            .then(response => {
                let array = new Array(response.data.length)
                for (var i in response.data) {
                    array[i] = {
                        creator: response.data[i].creator,
                        createdAt: response.data[i].createdAt,
                        description: response.data[i].description,
                        name: response.data[i].name,
                        needed: response.data[i].needed,
                        team: response.data[i].team,
                        user: response.data[i].user,
                    }
                }
                this.setState({
                    projects: array
                })
            }).catch(error => {
                console.log(error)
            })
    }

    onSeachInputChange = (event) => {
        if (event.target.value) {
            this.setState({
                searchString: event.target.value,
            })
        } else {
            this.setState({ searchString: '' })
        }
        this.getProjects()
    }

    render() {
        const { projects } = this.state
        return (
            <div>
                {this.state.projects ? (
                    <div>
                        <TextField style={{ padding: 20 }}
                            id='searchInput'
                            placeholder='Search for Projects'
                            margin='normal'
                            onChange={this.onSeachInputChange}
                        />
                        <Grid container spacing={10} style={{ padding: 20 }}>
                            {this.state.projects.map(currentProject => (
                                <Grid item key={currentProject.name} xs={12} sm={6} lg={4} xl={3}>
                                    <Project project={currentProject} />
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                ) : "No Projects Found"}
            </div>
        )
    }
}

export default ProjectList;