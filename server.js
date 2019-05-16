const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');


const users = require('./routes/api/users');

// use express
const app = express();

// use bodyparser
app.use(bodyParser.urlencoded({
     extended: false
    })
);

app.use(bodyParser.json());

// Db 
const db = require ('./config/keys').mongoURI;

// connect to db
mongoose.connect(
    db,
    { useNewUrlParser: true}
)
.then(() => console.log('MongoDB connection successful !!'))
.catch(err => console.log('Failed to connect to Mongodb: [err]:' + err));

// Passport middleware.
app.use(passport.initialize());

// Passport config.
require('./config/passport') (passport);

// Routes.
app.use('/api/users', users);

// if need to deploy to heroku, use env.port as it uses it , 5000 otherwise.
const port = process.env.PORT || 5000;

app.listen(port, () => console.log('Server started at port:' + port));

