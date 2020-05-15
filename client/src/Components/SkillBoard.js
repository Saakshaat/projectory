import React, { Component } from "react";
import { TableRow, TableCell, Container } from "@material-ui/core";

import SkillChip from "../Components/SkillChip";

export default class SkillBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skillsList: props.skillsList,
    };
  }

  render() {
    return (
      <Container style={{ padding: 0, display: 'flex', justifyItems: 'start', alignItems: 'left', flexWrap: 'wrap' }}>
        {this.state.skillsList.map((skill, index) => (
          <SkillChip skill={skill} key={skill} />
        ))}
      </Container>
    );
  }
}
