# Envelope Budgeting
 
## What is this project?
- Always the big question right? This project is based on [Envelope Budgeting](https://www.thebalancemoney.com/what-is-envelope-budgeting-1293682) principles. If you don't know what that is I will break it down a bit. In simple terms it's a personal budget technique where you plan out what you can spend in a month into an envelope. Maybe methaphorical one maybe not. You can then only spend from this envelope for the remainder of the month. It's a basic method to prevent overspending. The goal of this project is to have a simple web app where you can create the envelopes for your expenses for easy planning.

## What is required to run?
- MERN Stack
- [MongoDb](https://www.mongodb.com/)
- [Express](http://expressjs.com/)
- [ReactJS](https://reactjs.org/)
- [NodeJS](https://nodejs.org/en/download/)

## How to run
1. Download the repo
2. You can follow the [Getting Started with Atlas](https://docs.atlas.mongodb.com/getting-started/) guide, to learn how to create a free Atlas account, create your first cluster and get your Connection String to the database.
3. Open server/ create config.env
4. Set the ATLAS_URI connection parameter in `server/config.env` to your Connection String:
```
ATLAS_URI=mongodb+srv://<username>:<password>@budgetprojectdb.sl91ngh.mongodb.net/?retryWrites=true&w=majority
PORT=5000
```
5. Change directories to main then install dependencies
```
npm install
```
6. Finally start the application with
```
npm run dev
```

## Future Ideas
- [ ] Update front-end to show envelopes by month
- [ ] Add search bar to display all envelopes matching search parameter
- [ ] Display total budget from all envelopes
- [ ] Display total budget by month
- [ ] Bulk add/delete/modfy envelopes
- [ ] Transfer budget from one envelope to another
- [ ] Display data trends by category
- [ ] Take data input for each category to show how much of designated budget has been used
  - should automatically deduct amount after submission. Example:
    1. Category is Food with budget 500.
    2. User inputs they spent 50 dollars on grocies.
    3. Category header updates to display Assigned Budget: 500 | Remaining Budget: 450
    4. Total monthly budget updates to display amount remaining as well

## Contributing
- If you are intersted feel free to contribute.

![image](https://user-images.githubusercontent.com/60308670/197365310-96d6cc0a-885b-4b45-9642-ca579a825bb5.png)
