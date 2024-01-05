require('dotenv').config();


const express = require('express');

const workoutRoutes = require('./routes/workouts');
const userRoutes = require('./routes/user');


const mongoose = require('mongoose');

const app = express(); // Create express app

app.use(express.json()); // Make sure it comes back as json

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next();
})

//routes
app.use('/api/workouts/', workoutRoutes)
app.use('/api/user', userRoutes)



//connect to db

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //Listen for requests
app.listen(process.env.PORT, () => {
    console.log(`Connected to DB and listening on port ${process.env.PORT}`);
});
    })
    .catch((error) => {
        console.log(error);
    })

