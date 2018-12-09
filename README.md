# Assignment 2 - Web API - Automated development process.

Name: Ying Yan

Github Repository: https://github.com/gullveigy/cypher2.git

## Overview.

This is an online accounting web app, and there are three models for the time being（users,expenditures and incomes models）.Each model corresponds to a file in routes.
Users model has the following properties: email(unique)/password;
Expenditures model has the following properties:email(unique)/date/payment/type/amount/message;
Incomes model has the following properties:email(unique)/date/incomingmode/type/amount/message;
Each file in routes includes some basic CRUD operations and fuzzy search, etc.

## API endpoints.

Model: users
 + GET /users - Get all users.
 + GET /users/:email - Get one user information by email.
 + POST /users - Add a new user.
 + DELETE /users/:email - Delete user by email.


Model: expenditures
 + GET /expenditures - Get all expenditure records.
 + GET /expenditures/:id - Get one specific expenditure record by id.
 + GET /:email/expenditures - Get all expenditure records of one user.
 + GET /:email/expenditures/tamounts - Get total expenditure of one user.
 + GET /:email/fuzzyEx/:message - Get one expenditure record of one user by fuzzy searching messages of all expenditure records of this user.
 + GET /:email/expenditures/gettotal/:date - Get monthly total expenditure of one user.
 + POST /expenditures - Add new expenditure records.
 + PUT /expenditures/:id/changeExinfo - Update any attribute values of one expenditure record except value of 'email'(find record by id).
 + DELETE /expenditures/:id - Delete one expenditure record by id.


Model: incomes
 + GET /incomes - Get all income records.
 + GET /incomes/:id - Get one specific record by id.
 + GET /:email/incomes - Get income records of one user.
 + GET /:email/incomes/tamounts - Get total income of one user.
 + GET /:email/incomes/fuzzy/:message - Get one income record of one user by fuzzy searching messages of all income records of this user.
 + GET /:email/incomes/monthamount/:date - Get monthly total income of one user.
 + POST /incomes - Add new income records.
 + PUT /incomes/:id/changeIninfo - Update any attribute values of one income record except value of 'email'(find record by id).
 + DELETE /incomes/:id - Delete one income record by id.





## Continuous Integration and Test results.

. . . URL of the Travis build page for web API, e.g.

https://travis-ci.org/gullveigy/cypher2

. . . URL of published test coverage results on Coveralls, e.g.

https://coveralls.io/github/gullveigy/cypher2




[ Markdown Tip: By indenting the above listing, GitHub will display it in a 'box' and preserve any formatting.]

## Extra features.
1. GitHub repository: https://github.com/gullveigy/cypher2.git.
2. Use NPM Script to perform transpilitation, linting, watching.
