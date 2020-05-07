const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 64,
        required: true
    },
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
    },
    isAdmin: {
        type: Boolean
    }

})

userSchema.methods.generateToken = function() {
    const token = jwt.sign({
        _id: this._id,
        isAdmin: this.isAdmin,
    }, config.get('jwtPrivateKey'));
    return token;   

}

function validateUser(user) {
    const validateSchema = {
        name: Joi.string().min(5).max(64).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        isAdmin: Joi.boolean()
    }

    return Joi.validate(user, validateSchema)
}



module.exports.User = mongoose.model('User', userSchema);
module.exports.validate = validateUser;