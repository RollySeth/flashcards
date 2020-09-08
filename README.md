

# Update Aug. 30

Deployed App- https://flashcards-js.herokuapp.com/flashcards/#/

Project Flash Cards is progressing. What has been completed:
- Basic CRUD routes for user login, cardset creation and card creation. Complete with authorization and authentication. Works on localhost
- A deploy of a React App that will connect to the API via Express. Works on localhost
- Cardset creation works on localhost.
- Login system is functional on production
- Heroku integration and deployment of work in progress app on production
- UI refresh

What remains:
The primary roadblock we have is integrating the express routes into an existing React project. We are going into existing React templates and switching out the base DB to Mongo/Express..

Additional work remaining:
- Role based card viewing 
- Authentication based page viewing 
- Advanced Mongo routes that would allow for robust search of sets and maintain records of how people are doing on cardsets
- Disconnecting the existing UI from firebase and reintegrating with MongoDB/Express
- Test use cases

# Project Flash Cards
Project Flash Cards is a MongoDB/Express.js driven app that will help students, test takers, and other people who need help with memorization to learn information quickly.

The app allows users to build cardsets across categories. Each card in the cardset will have two sides that the user can flip between. The user can mark whether they got the answer to cardsets right or wrong and track progress.

Cardsets can also be shared publicly. This functionality can help users feel like they are contributing knowledge to the world. All users can access cardsets made public by other users. The homepage of the app will show lists of card sets sorted by category, recency and difficulty.

This app will be easy to use for the flash card creators and easy to use for the people who need to study.

_Team members: Tanveer Ali, Ryan Fields and Rolly Seth

# How the project will meet assignment requirements

Features based around final project requirements will be as follows:

## Authentication and Authorization

The project will have a user creation and login system that will authenticate for use of the app and determine authorization for access to CRUD routes.

## CRUD set 1: routes/cardsets.js

Cardsets will have parameters that include category, title, description, number of times it has ever been attempted, cards attempted, and cards correctly answered, and whether the set is available public.

## CRUD set 2: routes/cards.js

Cards will have information connecting the set to the cardset, what's on side A, and what's on side B. Initially it will only have text.

## CRUD set 3: routes/userHistory.js

User history will track information about performance and usage on each cardset and card. Cardset history will include times the user attempted the cardset and the last time attempted. The card history will include the number of times the card was attempted and the number of times the card was correct. This is likely the most complex of all CRUD routes.

## Complex action 1: Text search and filter

Allow the user to search for cardsets by title and description, while also filtering for category.

## Complex action 2: Aggregations and sorts

The API will create sorted aggregation lists for:
- The most popular cardsets
- The most difficult cardsets
- The most popular categories
- The most recent cardsets

## Infrastructure and Testing
- Code reviews with CI on Pull Requests
- App publicly accessible.  
- Hosted MongoDB 

## Additional sections of work
- Create prefilled cardsets and cards
- Create unit tests
- Create slides
- Create front-end

# Tracking progress on Trello

Tasks on Trello are categorized as P0, P1, and P2.
- *P0*: must be completed immediately.
- *P1*: must be completed for proof of concept.
- *P2*: must be completed by end of project.


## Self-evaluation of your team's approach and results, what you learned, and what you would like to do differently or improve upon.

### Achievements:

- Delivered a successful working project on time.

- Met criteria for project, building routes and testing.

- Gained experience working in a group setting. Given the requirements and time constraints realized a single person could not have delivered the project.  

### How:

- Work was divided over two sprints, and encompassed  new things we needed to learn.  Major things: Working with react, new routes, deployment, and testing.  We chose to divide the work into buckets where each person take the task end to end.

- Communication happened over Slack, and Google Chat.  

- Our initial goal started with having a project that we could deploy and build.  Then moved into a proof of concept and a more complex project with advanced routes and testing.

### Differently:

- Very happy with what we delivered and how the team worked together.

- Speaking to the feedback from Joel, we should always try to break apart each item into smaller pieces and not tackle huge pieces.

- Ideally would have a staging environment to test changes before promoting to a main branch.  This caught us a few times as we needed to push to the main branch to test.



(old): https://js400-final-project.github.io/flashcards/#/
