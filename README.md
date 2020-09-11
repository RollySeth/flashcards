# Final self-evaluation

Deployed App- https://flashcards-js.herokuapp.com/flashcards/#/

As a team, we are satisfied with the outcome of our product. We believe it is a useful project, especially for younger people cramming for a test or exam, or anyone who needs help with memorization. We think we effectively fulfilled the requirements of the project and created a Express.JS backend that can be extended and fine-tuned if we choose to expand and polish the experience.

What we learned:
- It was very helpful to break up not only individual tasks by person, but also segments of the project. For example, it was helpful to divide Express.js route-building, front-end connection, deployment, and tasks as essentially separate jobs.
- We started with weekly standups, but learned quickly given the remote nature of the team, and the fact that we aren't working the same hours, Slack was an essential tool to communicate. We relied on it much more than Trello, talking to each other when we were picking up a next task, making requests of others, and finding new problems. While we recognize that organized sprints and kanban boards are essential, this looser approach did work for us on this specific project.
- Building authentication is difficult. We spent a good chunk of the early part of the project figuring out how to not only link the backend login routes to the front end, but how to maintain a token throughout the experience. Our solution works, though it might not be the perfect way of doing so.
- Mongoose aggregations can be beautiful. It is possible to do the rearranging and calculations on the front-end, but they can be often convoluted and hard to decode. Mongoose looks very simple and easy-to-read. Performs better too.
- Mongoose and MongoDB documentation are invaluable and easy-to-read. Much less intimidating than before taking this class.

What we should've done better:
- Meeting the inital proof of concept deadline was a bit difficult. As a group, we were unclear how far we needed to progress and as a result didn't have a simple deployed project that the general public could interact with. (It did work on localhost however.) While at the time we certainly had a working backend (though all routes were not completed), we likely would have rearranged our task sequence to focus quickly on deploying routes to a front-end, even starting with the small ones.
- This backend is being served on a repurposed React front-end built in the second class in the JS certificate sequence. We recognize that deployment may be easier had we used something like Mustache, however we thought that most real-world experiences would call for something more robust like React. While our final front end may be more polished had we started a react app anew, it was helpful that we had the bones already built.

Thoughts for the future:
- While we don't present every data field on the front end, or allow for accessing all the routes, we built our models anticipating future functionality such as being able to filter out easy cards or determine the most recently used sets. We can tap into these existing data points in the future, but if there's anything we missed, it is good to know that migrations are an option too.

- One improvement would be to create a staging environment to test changes before promoting to a main branch.  This caught us a few times as we needed to push to the main branch to test.

- Breaking tasks into smaller pieces would make it more efficent to divide work and complete a sprint cycle.

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


(old): https://js400-final-project.github.io/flashcards/#/
