import React, { Component, useContext } from "react";
import { Card, CardContent, Typography, CardActions, Button, TableRow, TableCell, Chip, Container, Link, Divider, TextField, Grid } from "@material-ui/core";
import SkillBoard from './SkillBoard'
import '../Utils/Skill'
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import GitHubIcon from '@material-ui/icons/GitHub';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import Autocomplete from "@material-ui/lab/Autocomplete";
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from "react-router-dom";

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);


let skills = require('../Utils/Skill')

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const getSkillList = (skillArr) => {
    let res = [];
    for (let j = 0; j < skillArr.length; j++) {
        for (let i = 0; i < skills.length; i++) {
            if (skills[i].name === skillArr[j]) {
                res.push(skills[i]);
                break;
            }
        }
    }
    return res;
};

const CreatedProject = (props) => {
    const [open, setOpen] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openSnack, setOpenSnack] = React.useState(false);
    const [applied, setApplied] = React.useState(false);
    const [appliedAlert, setAlert] = React.useState();

    const [name, setName] = React.useState(props.project.name);
    const [emptyName, setEmptyName] = React.useState(false);

    const [gitHub, setGitHub] = React.useState(props.project.github);
    const [emptyGitHub, setEmptyGitHub] = React.useState(false);

    const [description, setDescription] = React.useState(props.project.description);
    const [emptyDescription, setEmptyDescription] = React.useState(false);

    const [needed, setNeeded] = React.useState(props.project.needed);
    const [emptyNeeded, setEmptyNeeded] = React.useState(false);

    const [links, setLinks] = React.useState(props.project.links);
    const [emptyLink, setEmptyLinks] = React.useState(false);

    const history = useHistory();

    const handleApplySuccess = () => {
        setApplied(true);
        setAlert(
            <Alert onClose={handleCloseSnack} severity="success">
                Applied Successfully to {props.project.name}
            </Alert>);
        setOpenSnack(true);
    }

    const handleCloseSnack = (event, reason) => {
        if (reason === "clickaway") {
            setOpenSnack(false);
            return;
        }
        setOpenSnack(false);
    };

    const handleSubmit = () => {

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

        console.log("Editing Project ...");

        axios
            .post("/baseapi/edit/" + props.project.id + "/", request, {
                headers: {
                    Authorization: localStorage.FBIdToken,
                },
            })
            .then((res) => {
                setOpenEdit(false);
                console.log(res)
                setInitial();
                history.push('/dashboard');
                return;
            })
            .catch((err) => {
                setOpenEdit(false);
                console.log(err.response);
                setInitial();
                history.push('/dashboard');
                return;
            });
    };

    const setInitial = () => {
        setName(props.project.name);
        setEmptyName(false);
        setDescription(props.project.description);
        setEmptyDescription(false);
        setGitHub(props.project.github);
        setEmptyGitHub(false);
        setLinks(props.project.links);
        setEmptyLinks(false);
        setNeeded(props.project.needed);
        setEmptyNeeded(false);
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

    const handleApplyFailure = (error) => {
        setAlert(
            <Alert onClose={handleCloseSnack} severity="error">
                {error}
            </Alert>);
        setOpenSnack(true);
    }

    const handleApply = () => {
        axios.get('/applications/apply/' + props.project.id, {
            headers: {
                Authorization: localStorage.FBIdToken,
            },
        }).then(res => {
            if (res.status === 200) {
                handleApplySuccess();
            } else {
                handleApplyFailure();
            }
            console.log(res.data);
        }).catch(error => {
            console.log(error.toString())
            handleApplyFailure(error.toString())
        });
    }

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpenEdit = () => {
        setOpenEdit(true);
    };
    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    return (
        <div style={{ alignSelf: 'baseline' }}>
            {props ? (
                <Card elevation={8} style={{ borderRadius: 10, height: '100%' }}>
                    <CardContent>
                        <Typography gutterBottom variant='h5' component='h2' style={{ marginTop: 0, marginBottom: 0 }}>
                            {props.project.name}
                        </Typography>
                        <Typography noWrap textSize={14} color='textSecondary' variant='caption' display="block" gutterBottom>
                            <Link href='#' variant='body2'>by {props.project.creator}</Link>
                        </Typography>
                        <Typography style={{ marginTop: 15 }} component='p' variant='body2' color='textSecondary'>
                            {props.project.description}
                        </Typography>
                        <div style={{ marginTop: 15, marginBottom: -10, marginLeft: -5 }}>
                            <SkillBoard skillsList={props.project.needed} />
                        </div>
                    </CardContent>
                    <CardActions >
                        <div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center', width: '100vh' }}>
                            <Button style={{ flex: 1, margin: 4 }} variant='outlined' size='medium' color='primary'
                                onClick={handleClickOpen}>
                                Details
                            </Button>
                            <Button style={{ flex: 1, margin: 4 }} startIcon={<EditIcon />} variant='contained' size='medium' color='primary' onClick={handleClickOpenEdit}>
                                Edit
                            </Button>
                            <Snackbar open={openSnack} autoHideDuration={2000} onClose={handleCloseSnack}>
                                {appliedAlert}
                            </Snackbar>


                            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                                <DialogTitle id="customized-dialog-title" onClose={handleClose} style={{ marginBottom: -15 }} >
                                    {props.project.name}
                                    < Typography textSize={18} color='textSecondary' variant='caption' display="block" gutterBottom>
                                        <Link href='#' variant='body2'>by {props.project.creator}</Link>
                                    </Typography>
                                    <Typography style={{ marginTop: 15 }} component='p' variant='body2' color='textSecondary'>
                                        Created on: {props.project.createdAt}
                                    </Typography>
                                </DialogTitle>
                                <DialogContent style={{ margin: 0 }}>
                                    <Container style={{ marginBottom: 15, padding: 0, display: 'flex', justifyItems: 'left' }}>
                                        <Link target='/' href={props.project.github}>
                                            <Chip size='small' icon={<GitHubIcon style={{ color: 'white' }} />} href={props.project.github} label='GitHub' clickable
                                                style={{ elevation: 10, paddingTop: 2, paddingBottom: 2, marginTop: 5, marginRight: 5, backgroundColor: 'black', borderColor: 'black', color: 'white' }} />
                                        </Link>
                                        <SkillBoard style={{ flex: 1 }} skillsList={props.project.needed} />
                                    </Container>
                                    <Typography>
                                        {props.project.description}
                                    </Typography>
                                </DialogContent>
                                <DialogActions>
                                    <Button autoFocus onClick={handleClose} color="primary">
                                        Close
                                    </Button>
                                </DialogActions>
                            </Dialog>

                            <Dialog onClose={handleCloseEdit} aria-labelledby="customized-dialog-title" open={openEdit}>
                                <DialogTitle id="customized-dialog-title" onClose={handleCloseEdit} style={{ marginBottom: -15 }}>
                                    Edit Project
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
                                                    defaultValue={props.project.name}
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
                                                    defaultValue={props.project.description}
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
                                                    defaultValue={props.project.github}
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
                                                    defaultValue={props.project.links}
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
                                                    defaultValue={getSkillList(props.project.needed)}
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
                                    <Button onClick={handleSubmit} startIcon={<DeleteIcon />} variant='outline' color="red">
                                        Delete
                                    </Button>
                                    <Button onClick={handleSubmit} variant='contained' color="primary">
                                        Submit
                                    </Button>
                                </DialogActions>
                            </Dialog>


                        </div>
                    </CardActions>
                </Card>
            ) : null
            }
        </div >
    )
}

export default CreatedProject;