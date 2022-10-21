require('dotenv').config({path: './db.env'});

// require express for server
const express = require('express');
const PORT = process.env.PORT || 4000;

// require middleware for express
const bodyParser = require('body-parser');
const cors = require('cors');

// require routes
const routes = require('./routes/routes');

// require mongoose for MongoDb
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString, { useNewUrlParser: true });
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error);
});

database.once('connected', () => {
    console.log('Database Connected');
});

// START
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
