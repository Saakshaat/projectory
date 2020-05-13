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
        label={this.state.name}
        style={{ backgroundColor: this.state.color }}
        key={this.state.name}
      />
    );
  }
}
