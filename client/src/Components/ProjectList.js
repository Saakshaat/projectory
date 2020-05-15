import React, { Component } from 'react'
import { Grid, TextField, Card, CircularProgress, Container, InputAdornment } from '@material-ui/core'
import SearchIcon from "@material-ui/icons/Search";
import axios from 'axios'
import Project from './Project'

class ProjectList extends Component {

    constructor() {
        super()
        this.state = {
            isLoading: false,
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
        this.setState({ isLoading: true }, () => {
            axios.get('/baseapi/projects/open')
                .then(response => {
                    let array = new Array(response.data.length)
                    for (var i in response.data) {
                        array[i] = {
                            creator: response.data[i].creator,
                            createdAt: response.data[i].createdAt,
                            description: response.data[i].description,
                            github: response.data[i].github,
                            name: response.data[i].name,
                            needed: response.data[i].needed,
                            team: response.data[i].team,
                            user: response.data[i].user,
                        }
                    }
                    this.setState({
                        isLoading: false,
                        projects: array
                    })
                }).catch(error => {
                    console.log(error)
                })
        });
    }

    onSeachInputChange = (event) => {
        if (event.target.value) {
            this.setState({
                searchString: event.target.value,
            })
        } else {
            this.setState({ searchString: '' })
        }
    }

    render() {
        const { isLoading, projects } = this.state
        return (
            <div>

                {isLoading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress size={50} /></div> : (this.state.projects ? (
                    <div>
                        <Container style={{ display: 'flex', width: '100vh', alignContent: 'center', justifyContent: 'center', flex: 1 }}>
                            <TextField style={{ padding: 20 }}
                                id='searchInput'
                                placeholder='Search for Projects'
                                margin='normal'
                                onChange={this.onSeachInputChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            /></Container>
                        <Grid container spacing={5} style={{ padding: 10, margin: 0, width: '100%' }}>
                            {this.state.projects.map(currentProject => (
                                <Grid item key={currentProject.name} xs={10} sm={6} lg={4} xl={3}>
                                    <Project project={currentProject} />
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                ) : "No Projects Found")}
            </div>
        )
    }
}

export default ProjectList;