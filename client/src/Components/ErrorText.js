import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";

export default class ErrorText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text,
    };
  }

  render() {
    return (
      <Typography color='error'> 
        {this.state.text}
      </Typography>
    );
  }
}
