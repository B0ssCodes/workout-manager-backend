const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const workoutRoutes = require('./routes/workoutRoutes');
const userRoutes = require('./routes/userRoutes');

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

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

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