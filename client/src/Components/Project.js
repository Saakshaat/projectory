import React, { Component } from "react";
import { Card, CardContent, Typography, CardActions, Button, TableRow, TableCell, Chip } from "@material-ui/core";
import '../Utils/Skill'

let skills = require('../Utils/Skill')
const Project = (props) => {
    console.log(props)
    return (
        <div>
            {props ? (
                <Card>
                    <CardContent title={props.project.name.toString()}>
                        <Typography gutterBottom variant='h6' component='h2'>
                            {props.project.name}
                        </Typography>
                        <Typography component='p'>
                            {props.project.description}
                        </Typography>
                        <TableRow>
                            {props.project.needed.map((skill, index) => (
                                <TableCell>
                                    <Chip
                                        style={{ backgroundColor: skills[skill.toString()] }}
                                        clickable
                                        size="large"
                                        label={skill}
                                        color={skills.skill}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    </CardContent>
                    <CardActions>
                        <Button size='small' color='primary' href='' target='_blank'>Got to Project</Button>
                    </CardActions>
                </Card>
            ) : null}
        </div>
    )
}

export default Project;