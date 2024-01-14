const Workout = require('../models/workoutModel');
const mongoose = require('mongoose');

//get all workouuts
const getWorkouts = async (req, res) => {
    const user_id = req.user._id;
    const workouts = await Workout.find({ user_id }).sort({createdAt: -1});  //sort by newest

    res.status(200).json(workouts);
}

// get a single workout
const getWorkout = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such workout'})
    }

    const workout = await Workout.findById(id);

    if(!workout) {
        return res.status(404).json({error: 'No such workout'})
    }

    res.status(200).json(workout);
}

const createWorkout = async (req, res) => {
    const {title, exercises} = req.body;

    let emptyFields = [];
    
    if (!title){
        emptyFields.push('title');
    }
    if (!exercises || exercises.length === 0){
        emptyFields.push('exercises');
    } else {
        exercises.forEach((exercise, index) => {
            if (!exercise.title) {
                emptyFields.push(`exercises[${index}].title`);
            }
            if (!exercise.sets || exercise.sets.length === 0) {
                emptyFields.push(`exercises[${index}].sets`);
            } else {
                exercise.sets.forEach((set, setIndex) => {
                    if (set.reps == null) {
                        emptyFields.push(`exercises[${index}].sets[${setIndex}].reps`);
                    }
                    if (set.load == null) {
                        emptyFields.push(`exercises[${index}].sets[${setIndex}].load`);
                    }
                });
            }
        });
    }

    if(emptyFields.length > 0) {
        return res.status(400).json({ error: "Please fill in all the fields", emptyFields})
    }

    //add doc to db
    try{
        const user_id = req.user._id;
        const workout = await Workout.create({title, exercises, user_id});
        res.status(201).json(workout);
    } catch (error) {
        res.status(500).json({ error: "Failed to create workout", details: error});
    }
}
//delete a workout
const deleteWorkout = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such workout'})
    }

    const workout = await Workout.findOneAndDelete({_id: id});

    if(!workout) {
        return res.status(404).json({error: 'No such workout'})
    }

    res.status(200).json(workout);
}
//update a workout
const updateWorkout = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such workout'})
    }

    const {sets} = req.body;
    if (sets && (!Array.isArray(sets) || sets.some(set => typeof set !== 'object' || !set.load || !set.reps))) {
        return res.status(400).json({error: 'Invalid sets field'});
    }

    const workout = await Workout.findOneAndUpdate({_id: id}, {...req.body}, { new: true });    
    if(!workout){
        return res.status(404).json({error: 'No such workout'})
    }
    res.status(200).json(workout)
}

module.exports = {
    getWorkouts,
    getWorkout,
    createWorkout,
    deleteWorkout,
    updateWorkout
}