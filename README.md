# projectory

An open sourced project and team matching platform meant for inhouse project management and hiring for clubs and organizations.

This application is the MVP meant for beta testing the concept.
Find the [production release here](https://projectory-5171c.web.app/)

The final application is currently in development at the [UMass DSC](https://github.com/dsc-umass/project-matching). The final application supports the user building and hosting their own instance of the application.

<div><p align="center">
<center><h4>Projectory is supported & used by:</h4><a href="https://www.linkedin.com/company/dscntu/"><img width="270" src="/assets/dsc_ntu.png" target="_blank"></a>
<a href="https://umassdsc.com/" target="_blank"><img width="270" src="./assets/dsc_umass.jpg"></a>
<a href="http://www.dsc-rpi.club/" target="_blank"><img width="270" src="./assets/dsc_rpi.png"></a>
<a href="https://umass.acm.org/" target="_blank"><img width="270" src="./assets/umassacmlogo.png"></a>
<a href="https://jobs.rezscore.com/" target="_blank"><img width="190" src="/assets/rez_score.jpeg"></a>
</center></p></div>

## Table of Contents
  - [Concept](#concept)
      - [Users](#users)
      - [Projects](#projects)
  - [Tech Stack](#tech-stack)
    - [Backend APIs](#backend-api)
    - [Client App](#client-app)
    - [Maintenance](#maintenance)

##  Concept

Projectory is supposed to make team matching easier and faster for projects. It is based on 2 main elements:

#### Users

 The user object is composed of the user's profile which entails their 
 - contact information
 - experience
   - skills
 - resume
  
 When a user applies to be a part of a project's team, they don't have to submit an application. Their profile is automatically saved in the pool of the project's applicants.

 When the project owner looks at all the applicants for a project, they can swipe through each applicant's profile and easily select an applicant by the click of a button. This adds the selected user in the team for that project and they get an email from the application informing them of the selection.

 A user can also see all the teams that they're a part of in each project on the `My Teams` page.

#### Projects


## Tech Stack
=======
 Projects are described by
 - skills needed
 - description
 - github

 Interested users can apply to a project by simply clicking on the `Apply` button which adds them to the applicant pool for that project.

 Once the project owner has selected enough team members, they can close a project by clicking on `Finalize`, which migrates the project's status from being open to closed. This sends an email to all the team members and all the interested applicants who weren't selected about the project closing for hiring.
 Closed projects can be reopen for hiring at any time, in which case, all formerly interested users get an email about the project opening up again.

## Tech Stack

#### Backend API

We used [Express.js](http://expressjs.com/) (a Node.js framework) for developing the backend with [Google Firebase's SDK](https://firebase.google.com/docs/reference).

Firebase supports an inherent [NoSQL Cloud database](https://firebase.google.com/docs/firestore/?gclid=CjwKCAjwqpP2BRBTEiwAfpiD--hcBTjLfNQXTJ_gD6GutvrJFG8I6x0fakPT2D7AAJXWSJgRx3okhhoCKcYQAvD_BwE), authentication and API hosting for Web, Android and IOS clients.

#### Client App

The client application is built using [React.js](https://reactjs.org/).

#### Maintenance

Due to the nature of our data storage needs, a SQL database is more desirable. Further, Firebase has limits when it comes to scalability and sharding app instances to allow different users to build a different instance of our application exclusively for their organization.

In order to address these issues, we're currently migrating the entire codebase to [Ruby on Rails](https://rubyonrails.org/) and [PostgreSQL](https://www.postgresql.org/). 

We'll preserve the client application in React.js and integrate that within the Rails Views.
