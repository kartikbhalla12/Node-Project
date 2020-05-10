
// TDD Approach
//
// create a POST request to /api/returns with a valid customerId and movieId
// set dateReturned and rentalFee in rentals
// restock movie
// send updated rentals document to client
// 
// TEST CASES
//
// return 401 if client is not logged in.
// return 400 if customer id is not provided or invalid.
// return 400 if movie id is not provided or invalid.
// return 404 if the movie doesn't exists for the given id.      // need no to be done as movie and customer
// return 404 if the customer doesn't exists for the given id.   // are already validated when creating rentals
// return 404 if no rental found for the given movie and customer id.
// return 400 if return already processed ( dateReturned and rentalFee already set ).
// return 200 if the return is processed successfully ( set dateReturned and rentalFee and return updated rental ).
// set the return date if input is valid
// calculate and set the rentalFee
// add the movie back to stock
// return the rental


const express = require('express')
const router = express.Router();
const { Rental } = require('../models/Rental');
const { Movie } = require('../models/Movie');
const auth = require('../middleware/auth');
const Joi = require('joi');


const validateBody = require('../middleware/validate');
    
const validateReturn = (ret) => {

    const validatesSchema = {
        customer: Joi.objectId().required(),
        movie: Joi.objectId().required(),
    }
    return Joi.validate(ret, validatesSchema);

}

router.post('/', [auth, validateBody(validateReturn) ], async (req, res) => {

    // if(!req.body.customer) return res.status(400).send('Customer id not provided') 
    // if(!req.body.movie) return res.status(400).send('Movie id not provided')     //moved to Joi validation function

    // const { error } = validateReturn(req.body);
    // if(error) return res.status(400).send(error.details[0].message);     //moved to glo


    const rental = await Rental.lookup(req.body.movie, req.body.customer)

    // const rental = await Rental.findOne({
    //     movie: req.body.movie,
    //     customer: req.body.customer
    // })

    if(!rental) 
        return res.status(404).send('Rental not found')

    if(rental.dateReturned && rental.rentalFee >= 0) 
        return res.status(400).send('Return already processed')

    const movie = await Movie.findOne({_id: req.body.movie});
    
    // rental.dateReturned = Date.now();
    // rental.rentalFee = moment().diff(rental.dateOut, 'days') * movie.dailyRentalRate;
    
    rental.return(movie.dailyRentalRate);
    await rental.save();

    movie.numberInStock += 1;
    await movie.save();

    return res.status(200).send(rental);
})



module.exports = router;