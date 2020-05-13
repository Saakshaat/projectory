import React, { Component } from "react";
import { TableRow, TableCell } from "@material-ui/core";

import SkillChip from "../Components/SkillChip";

export default class SkillBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skillsList: props.skills,
    };
  }

  render() {
    return (
      <TableRow>
        {this.state.skillsList.map((skill) => (
          <TableCell key={skill}>
            <SkillChip skill={skill} />
          </TableCell>
        ))}
      </TableRow>
    );
  }
}
