const mongoose = require('mongoose');
const Joi = require('joi');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Customer"
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Movie"
    },
    dateOut: {
        type: Date,
        default: Date.now(),
    },
    dateReturned: {
        type: Date,
    },
    rentalFee : {
        type: Number,
        min: 0,
    }
})

function validateRental(rental) {
    const validateSchema = {
        customer: Joi.objectId().required(),
        movie: Joi.objectId().required(),
        // dateOut: Joi.date(),
        // dateReturned: Joi.date(),
        // rentalFee: Joi.number()
    }

    return Joi.validate(rental, validateSchema);
}


module.exports.rental = mongoose.model('Rental', rentalSchema);
module.exports.validate = validateRental;

