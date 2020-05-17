import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import ErrorText from "../Components/ErrorText";
import ProfileMain from "../Components/ProfileMain";

export default class OtherProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      userId: this.props.match.params.userId,
      hadData: false,
      hasError: false,
      errorText: "",
    };
  }

  componentDidMount() {
    this.getProfilePage();
  }

  getProfilePage() {
    axios
      .get("/baseapi/user/" + this.state.userId + "/profile")
      .then((res) => {
        // TODO handle different type of request
        this.setState({
          profile: res.data,
        });
        this.setState({
          hadData: true,
        });
      })
      .catch((err) => {
        if (err.response.status === 404) {
          this.setState({ errorText: "User does not exist." });
          this.setState({ hasError: true });
          this.setState({ hadData: true });
          console.log(this.state.hasError);
        }
      });
  }

  render() {
    if (!this.state.hadData) return <Typography>Loading...</Typography>;
    else if (this.state.hasError)
      return <ErrorText text={this.state.errorText} />;
    else return <ProfileMain profile={this.state.profile}></ProfileMain>;
  }
}
