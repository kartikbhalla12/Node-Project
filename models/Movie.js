const mongoose = require('mongoose');
const Joi = require('joi');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre'
    },
    numberInStock: Number,
    dailyRentalRate: Number,
})

function validateMovie(movie) {
    const validatesSchema = {
        title: Joi.string().min(3).required(),
        genre: Joi.objectId().required(),
        numberInStock: Joi.number().required(),
        dailyRentalRate: Joi.number().required(),
    }
    return Joi.validate(movie, validatesSchema);
}


module.exports.Movie = mongoose.model('Movie', movieSchema);
module.exports.validate = validateMovie;
