const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const axios = require('axios');
require('dotenv').config();


const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: false
    },

    email: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true
    }
})

// static signup method
userSchema.statics.signup = async function(firstName, lastName, email, password, recaptchaToken) {

    // validation
    if(!firstName || !lastName ||!email || !password){
        throw Error('All fields must be filled!')
    }
    if(!validator.isEmail(email)){
        throw Error('Email is not valid!')
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Password is not strong enough!')
    }

    // Verify the reCAPTCHA token
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
        params: {
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: recaptchaToken
        }
    });

    if (response.data.success !== true) {
        throw Error('Failed reCAPTCHA verification');
    }

    const exists = await this.findOne({email});

    if (exists) {
        throw Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({firstName, lastName, email, password: hash});

    return user;
}

// static login method
userSchema.statics.login = async function(email, password){
    if(!email || !password){
        throw Error('All fields must be filled!')
    }
    const user = await this.findOne({email});

    if(!user){
        throw Error('Incorrect Email!')
    }

    const match = await bcrypt.compare(password, user.password);

    if(!match){
        throw Error('Incorrect Password!')
    }

    return user
}

module.exports = mongoose.model('User', userSchema);