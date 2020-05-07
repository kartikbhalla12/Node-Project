const Joi = require('joi');
const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
        unique: true
    },
    password: {
        type: String,
        maxlength: 1024,
        required: true
    }

})


function validateAuth(auth) {
    const validateSchema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    }

    return Joi.validate(auth, validateSchema)
}



module.exports.User = mongoose.model('Auth', authSchema);
module.exports.validate = validateAuth;