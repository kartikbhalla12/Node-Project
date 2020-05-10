const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment')

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
});

rentalSchema.statics.lookup = function(movie, customer) {
    return this.findOne({
        movie : movie,
        customer: customer
    })
}

rentalSchema.methods.return = function(movieRentalRate) {
    this.dateReturned = Date.now();
    this.rentalFee = moment().diff(this.dateOut, 'days') * movieRentalRate;
}

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


module.exports.Rental = mongoose.model('Rental', rentalSchema);
module.exports.validate = validateRental;

