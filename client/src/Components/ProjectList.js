import React, { Component } from 'react'
import { Grid, TextField, Card, CircularProgress, Container, InputAdornment, Paper } from '@material-ui/core'
import SearchIcon from "@material-ui/icons/Search";
import axios from 'axios'
import Project from './Project'
import NavDrawer from './NavDrawer';
import CreatedProject from './CreatedProject';

class ProjectList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            created: [],
            static: [],
            isLoading: false,
            endpoint: props.link,
            projects: [
                {
                    id: '',
                    creator: '',
                    createdAt: '',
                    description: '',
                    github: '',
                    name: '',
                    interested: [],
                    needed: [],
                    team: [],
                    user: '',
                    links: '',
                }
            ],
            searchString: ''
        }
    }

    componentDidMount() {
        this.getProjects();
    }

    getProjects = () => {
        this.setState({ isLoading: true }, () => {
            axios.get(this.props.endpoint, {
                headers: {
                    Authorization: this.props.header,
                },
            })
                .then(response => {
                    let array = new Array(response.data.length)
                    for (var i in response.data) {
                        array[i] = {
                            id: response.data[i].id,
                            creator: response.data[i].creator,
                            createdAt: response.data[i].createdAt,
                            description: response.data[i].description,
                            github: response.data[i].github,
                            name: response.data[i].name,
                            needed: response.data[i].needed,
                            team: response.data[i].team,
                            user: response.data[i].user,
                            links: response.data[i].links,
                        }
                    }
                    this.setState({
                        isLoading: false,
                        projects: array,
                    })
                    console.log(response);
                    console.log(response.status);
                    axios.get('/baseapi/my/projects/open/all', {
                        headers: {
                            Authorization: this.props.header,
                        },
                    })
                        .then(response => {
                            let createdArray = new Array(response.data.length)
                            for (var i in response.data) {
                                createdArray.push(response.data[i].id);
                            }
                            this.setState({
                                created: createdArray,
                            })
                            console.log(response);
                            console.log(response.status);

                            axios.get('/baseapi/my/static', {
                                headers: {
                                    Authorization: this.props.header,
                                },
                            })
                                .then(response => {
                                    let staticArray = new Array(response.data.length)
                                    for (var i in response.data) {
                                        staticArray.push(response.data[i]);
                                    }
                                    this.setState({
                                        static: staticArray,
                                    })
                                    console.log(response);
                                    console.log(response.status);
                                }).catch(error => {
                                    console.log(error)
                                    console.log(error.status);
                                });


                        }).catch(error => {
                            console.log(error)
                            console.log(error.status);
                        });

                }).catch(error => {
                    console.log(error)
                    console.log(error.status);
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
        const { isLoading, projects, created } = this.state

        return (
            <div>
                {isLoading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress size={50} /></div> : (this.state.projects.length > 0 ? (
                    <div>
                        <Container style={{ display: 'flex', width: '100vh', alignContent: 'center', justifyContent: 'center', flex: 1 }}>
                        </Container>
                        <Grid alignItems='stretch' container spacing={5} style={{ alignItems: 'stretch', padding: 10, margin: 0, width: '100%' }}>
                            {this.state.projects.map(currentProject => (
                                // style={{}} xs={10} sm={6} lg={4} xl={3} 
                                <Grid item key={currentProject.name} lg={4}>
                                    {this.state.created.includes(currentProject.id) ?
                                        <CreatedProject project={currentProject} applicable={this.props.applicable} /> :
                                        ((this.state.static.includes(currentProject.id) ?
                                            (<Project project={currentProject} applicable={false} />) :
                                            (<Project project={currentProject} applicable={this.props.applicable} />)))

                                    }
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                ) : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>No Projects Found</div>)}
            </div>
        )
    }
}

export default ProjectList;