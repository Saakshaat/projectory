import React, { Component, useContext } from "react";
import { Card, CardContent, Typography, CardActions, Button, TableRow, TableCell, Chip, Container, Link, Divider } from "@material-ui/core";
import SkillBoard from '../Components/SkillBoard'
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
import axios from 'axios';
import OtherProfile from '../Pages/OtherProfile'

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

const Project = (props) => {
    const [open, setOpen] = React.useState(false);
    const [openSnack, setOpenSnack] = React.useState(false);
    const [applied, setApplied] = React.useState(false);
    const [appliedAlert, setAlert] = React.useState();

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


    const handleApplyFailure = (error) => {
        setAlert(
            <Alert onClose={handleCloseSnack} severity="error">
                {error}
            </Alert>);
        setOpenSnack(true);
    }

    const handleApply = () => {
        axios.get('/aux5/apply/' + props.project.id, {
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
    return (
        <div style={{ alignSelf: 'baseline' }}>
            {props ? (
                <Card elevation={8} style={{ borderRadius: 10, height: '100%' }}>
                    <CardContent>
                        <Typography gutterBottom variant='h5' component='h2' style={{ marginTop: 0, marginBottom: 0 }}>
                            {props.project.name}
                        </Typography>
                        <Typography noWrap textSize={14} color='textSecondary' variant='caption' display="block" gutterBottom>
                            <Link href={"/user/" + props.project.user + "/profile"} variant='body2' >by {props.project.creator}</Link>
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
                            {props.applicable ? (applied ? (<Button style={{ flex: 1, margin: 4 }} startIcon={<DoneIcon />} variant='contained' size='medium' color='secondary' disableElevation disableTouchRipple disableFocusRipple disableRipple>
                                Applied
                            </Button>) :
                                (<Button style={{ flex: 1, margin: 4 }} variant='contained' size='medium' color='primary' onClick={handleApply}>
                                    Apply
                                </Button>)) : null}
                            <Snackbar open={openSnack} autoHideDuration={2000} onClose={handleCloseSnack}>
                                {appliedAlert}
                            </Snackbar>
                            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                                <DialogTitle id="customized-dialog-title" onClose={handleClose} style={{ marginBottom: -15 }} >
                                    {props.project.name}
                                    < Typography textSize={18} color='textSecondary' variant='caption' display="block" gutterBottom>
                                        <Link href={<OtherProfile userId={props.project.user} />} variant='body2'>by {props.project.creator}</Link>
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
                        </div>
                    </CardActions>
                </Card>
            ) : null
            }
        </div >
    )
}

export default Project;