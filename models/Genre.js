const mongoose = require('mongoose');
const Joi = require('joi')


const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

function validateGenre(genre) {
    const validatesSchema = {
        name: Joi.string().min(5).required(),
    }
    return Joi.validate(genre, validatesSchema);
}


module.exports.Genre = mongoose.model('Genre', genreSchema);
module.exports.validate = validateGenre;