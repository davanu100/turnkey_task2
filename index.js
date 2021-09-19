//major initializaitons
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//getting models
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://anurag:eWUdGVJpbI1K0yYa@cluster0.bpecn.mongodb.net/turnkey_users';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

//making routes available
const authRoutes = require('./routes/auth');
const userDetailRoutes = require('./routes/userDetails');

app.use('/auth', authRoutes);
app.use(userDetailRoutes);

//Setting page not found controller actions
const errorController = require('./controllers/error');
app.use(errorController.get404);

//using mongoose to start server
mongoose.connect(MONGODB_URI)
    .then(result => {
        console.log("-> Connected");
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });