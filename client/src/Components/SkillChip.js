import React, { Component } from "react";
import Chip from "@material-ui/core/Chip";

let skills = require("../Utils/Skill");

export default class SkillChip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.skill,
      color: null,
    };
    //TODO impove searching process
    for (let i = 0; i < skills.length; i++) {
      if (skills[i].name === props.skill) {
        this.state.color = skills[i].color;
        break;
      }
    }
  }

  render() {
    return (
      <Chip
        size='small'
        label={this.state.name}
        style={{ margin: 5, borderColor: this.state.color, color: this.state.color }}
        key={this.state.name}
        clickable
        variant='outlined'
      />
    );
  }
}

// font-family: Roboto;
// font-style: normal;
// font-weight: bold;
// font-size: 18px;
// line-height: 21px;
// text-align: center;