import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import { Redirect } from "react-router-dom";
import {
  Card,
  Grid,
  Divider,
  Container,
  Avatar,
  Link,
  CardContent,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
} from "@material-ui/core";
import ProfileSnapshot from "../Components/ProfileSnapshot";
import axios from "axios";

export default class ProjectTeamCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      projectState: this.props.state,
      projectId: this.props.projectId,
      data: [],
      hadData: false,
    };
  }

  componentDidMount() {
    if (this.props.interested) this.getInterested();
    else this.getAllProject();
  }

  getInterested() {
    axios
      .get("/baseapi/interested/" + this.state.projectId, {
        headers: {
          Authorization: localStorage.FBIdToken,
        },
      })
      .then((res) => {
        console.log(res.data)
        // TODO handle different type of request    
        if (res.data.users.length === 0) {
          this.setState({
            data: [],
          });
          this.setState({
            hadData: false,
          });
        } else {
          this.setState({
            data: res.data.users,
          });
          this.setState({
            hadData: true,
          });
        }

      })
      .catch((err) => {
        this.setState({
          hadData: true,
        });
        console.log(err);
      });
  }

  getAllProject() {
    axios
      .get(
        "/baseapi/my/team/" +
        this.state.projectState +
        "/" +
        this.state.projectId,
        {
          headers: {
            Authorization: localStorage.FBIdToken,
          },
        }
      )
      .then((res) => {
        console.log(res.data)
        // TODO handle different type of request
        if (res.data.users.length === 0) {
          this.setState({
            data: [],
          });
          this.setState({
            hadData: false,
          });
        } else {
          this.setState({
            data: res.data.users,
          });
          this.setState({
            hadData: true,
          });
        }
      })
      .catch((err) => {
        this.setState({
          hadData: true,
        });
        console.log(err);
      });
  }

  //TODO add edit my profile option
  render() {
    if (!this.state.hadData) return <Typography>Loading...</Typography>;
    else
      return (
        <Container style={{ padding: "-100px" }} disableGutters={true}>
          <Card
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              height: "100%",
              maxWidth: "1500",
              marginTop: "20px",
            }}
          >
            <CardContent>
              <Typography
                gutterBottom
                variant="h4"
                component="h2"
                style={{ marginTop: 0, marginBottom: 0 }}
              >
                {this.props.project}
              </Typography>
              <Typography
                noWrap
                textSize={14}
                color="textSecondary"
                variant="caption"
                display="block"
                gutterBottom
              >
                {/* TODO Change this to actual link */}
                <Link href="#" variant="body2">
                  by {this.props.creator}
                </Link>
              </Typography>

              {this.props.interested ? (
                <Grid container>
                  {this.state.data.map((user) => (
                    <SubmitCard
                      id={user.id}
                      name={user.name}
                      project={this.state.projectId}
                    />
                  ))}
                </Grid>
              ) : (
                  <Grid container>
                    {this.state.data.map((user) => (
                      <Grid item style={{ margin: 15 }}>
                        <ProfileSnapshot userId={user.id} />
                      </Grid>
                    ))}
                  </Grid>
                )}
            </CardContent>
          </Card>
        </Container>
      );
  }
}

const SubmitCard = (props) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSelect = () => {
    axios
      .get("/baseapi/select/" + props.project + "/" + props.id, {
        headers: {
          Authorization: localStorage.FBIdToken,
        },
      })
      .then((res) => {
        setOpen(false);
        window.location.reload(false);
      })
      .catch((err) => console.log(err));
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="Click to select">
        <Button
          disableRipple={true}
          style={{
            margin: 7,
          }}
          onClick={handleClickOpen}
        >
          <Grid item>
            <ProfileSnapshot userId={props.id} />
          </Grid>
        </Button>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to select {props.name}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Selected members can be removed later but they receive emails for
            getting selected and removed.
            <br />
            <br />
            Please don't lead yourself into embarrassment.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="gray">
            Cancel
          </Button>
          <Button onClick={handleSelect} color="primary" autoFocus>
            Select
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
