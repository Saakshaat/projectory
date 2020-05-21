import React, { Component } from "react";
import { Container } from "@material-ui/core";

import SkillChip from "../Components/SkillChip";

export default class SkillBoard extends Component {
  render() {
    return (
      <div>
        <Container style={{ padding: 0, display: 'flex', justifyItems: 'start', alignItems: 'left', flexWrap: 'wrap' }}>
        {this.props.skillsList.map((skill, index) => (
          <SkillChip skill={skill} key={skill} />
        ))}
      </Container>
      </div>
    );
  }
}
