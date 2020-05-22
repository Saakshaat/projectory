import React, { Component } from "react";
import { Container } from "@material-ui/core";

import SkillChip from "../Components/SkillChip";

export default class SkillBoard extends Component {
  render() {
    var skillsList = this.props.skillsList;
    if (!skillsList) {
      skillsList = [];
    }
    return (
      <div>
        <Container style={{ padding: 0, display: 'flex', justifyItems: 'start', alignItems: 'left', flexWrap: 'wrap' }}>
          {skillsList.map((skill, index) => (
            <SkillChip skill={skill} key={skill} />
          ))}
        </Container>
      </div>
    );
  }
}
