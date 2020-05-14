import React, { Component } from "react";
import { Container } from "@material-ui/core";

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
      <div>
        <Container
          style={{
            display: "flex",
            justifyItems: "start",
            alignItems: "left",
            flexWrap: "wrap",
          }}
        >
          {this.state.skillsList.map((skill, index) => (
            <SkillChip skill={skill} key={skill} />
          ))}
        </Container>
      </div>
    );
  }
}
