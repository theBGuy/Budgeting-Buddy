# personal-budget-part1
 
## What is this project?
- Always the big question right? This project is based on [Envelope Budgeting](https://www.thebalancemoney.com/what-is-envelope-budgeting-1293682) principles. If you don't know what that is I will break it down a bit. In simple terms it's a personal budget technique where you plan out what you can spend in a month into an envelope. Maybe methaphorical one maybe not. You can then only spend from this envelope for the remainder of the month. It's a basic method to prevent overspending. The goal of this project is to have a simple web app where you can create the envelopes for your expenses for easy planning.

## What is required to run?
- [NodeJS](https://nodejs.org/en/download/)
- [MongoDb](https://www.mongodb.com/)

## How to run
1. 
2. You can follow the [Getting Started with Atlas](https://docs.atlas.mongodb.com/getting-started/) guide, to learn how to create a free Atlas account, create your first cluster and get your Connection String to the database. 
Then, set the Database URI connection parameter in `backend/db.env` to your Connection String:
```
DATABASE_URL=mongodb+srv://<username>:<password>@sandbox.jadwj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
```

3. Start the server:
```
npm install
npm start
```
