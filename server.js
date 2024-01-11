require('dotenv').config();

const cors = require('cors');


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

// This will allow all origins. In a production environment, you should
// configure this to only allow your frontend application's origin.
app.use(cors());

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

