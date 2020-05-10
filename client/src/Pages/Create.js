import React, { Component } from "react";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { Link, Redirect } from "react-router-dom";

const skills = [
  { name: "C" },
  { name: "C++" },
  { name: "Java" },
  { name: "Node.js" },
  { name: "Python" },
  { name: "React" },
];

export default class Create extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      bio: "",
      github: "",
      linkedin: "",
      skill: [],
    };
    console.log(this.props);
  }

  handleSummitButton = (e) => {
    e.preventDefault();
    // console.log(this.props.credentials);
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value,
    });
  };

  handleBioChange = (e) => {
    this.setState({
      bio: e.target.value,
    });
  };

  handleGithubChange = (e) => {
    this.setState({
      bio: e.target.value,
    });
  };

  handleLinkedinChange = (e) => {
    this.setState({
      linkedin: e.target.value,
    });
  };

  handleSkillChange = (e, data) => {
    this.state.skill = data;
  };

  render() {
    return (
      <div>
        <Typography component="h1" variant="h5">
          More about you
        </Typography>
        <form noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                required
                fullWidth
                onChange={this.handleNameChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Bio"
                required
                fullWidth
                onChange={this.handleBioChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="GitHub"
                required
                fullWidth
                onChange={this.handleGithubChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="LinkedIn"
                required
                fullWidth
                onChange={this.handleLinkedinChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={skills}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Skills *"
                    placeholder="Add a skill"
                  />
                )}
                onChange={this.handleSkillChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                color="primary"
                onClick={this.handleSummitButton}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

// import React from "react";
// import MaterialTable from "material-table";

// export default function MaterialTableDemo() {
//   const [state, setState] = React.useState({
//     columns: [
//       { title: "Name", field: "name" },
//       { title: "Link", field: "link" }
//     ],
//     data: []
//   });

//   return (
//     <MaterialTable
//       title="Editable Example"
//       columns={state.columns}
//       data={state.data}
//       editable={{
//         onRowAdd: newData =>
//           new Promise(resolve => {
//             setTimeout(() => {
//               resolve();
//               setState(prevState => {
//                 const data = [...prevState.data];
//                 data.push(newData);
//                 return { ...prevState, data };
//               });
//             }, 600);
//           }),
//         onRowUpdate: (newData, oldData) =>
//           new Promise(resolve => {
//             setTimeout(() => {
//               resolve();
//               if (oldData) {
//                 setState(prevState => {
//                   const data = [...prevState.data];
//                   data[data.indexOf(oldData)] = newData;
//                   return { ...prevState, data };
//                 });
//               }
//             }, 600);
//           }),
//         onRowDelete: oldData =>
//           new Promise(resolve => {
//             setTimeout(() => {
//               resolve();
//               setState(prevState => {
//                 const data = [...prevState.data];
//                 data.splice(data.indexOf(oldData), 1);
//                 return { ...prevState, data };
//               });
//             }, 600);
//           })
//       }}
//     />
//   );
// }
