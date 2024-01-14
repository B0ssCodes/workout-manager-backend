const mongoose = require('mongoose');   

const Schema = mongoose.Schema;

const setSchema = new Schema({
    reps: {
        type: Number,
        required: true
    },
    load: {
        type: Number,
        required: true
    }
}, {_id: false}); // _id: false is added to prevent MongoDB from creating an id for each set

const exerciseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    sets: [setSchema]
}, {_id: false});

const workoutSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    exercises: [exerciseSchema],
    user_id:{
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Workout', workoutSchema);