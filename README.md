# Project Flash Cards
Project Flash Cards is a MongoDB/Express.js driven app that will help students, test takers, and other people who need help with memorization to learn information quickly.

The app allows users to build cardsets across categories. Each card in the cardset will have two sides that the user can flip between. The user can mark whether they got the answer to cardsets right or wrong and track progress.

Cardsets can also be shared publicly. This functionality can help users feel like they are contributing knowledge to the world.

This app will be easy to use for the flash card creators and easy to use for the people who need to study.

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

## Additional sections of work
- Create prefilled cardsets and cards
- Create unit tests
- Create slides
- Create front-end
