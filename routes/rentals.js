const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const { Rental, validate } = require('../models/Rental');
const Customer = require('../models/Customer')
const { Movie } = require('../models/Movie');
const Fawn = require('fawn');
const mongoose = require('mongoose');
Fawn.init(mongoose);

const validateBody = require('../middleware/validate');

router.get('/', async (req, res) => {
    const rentals = await Rental
    .find()
    .populate('movie customer')
    res.send(rentals)
})

router.post('/', [auth, validateBody(validate) ], async (req, res) => {

    const customer = await Customer.findById(req.body.customer);
    if(!customer) return res.status(404).send("Customer not found for the given id.")

    const movie = await Movie.findById(req.body.movie);
    if(!movie) return res.status(404).send("Movie not found for the given id.")

    if(movie.numberInStock == 0) return res.status(400).send("Movie out of stock..")
    const rental = new Rental({
        customer: req.body.customer,
        movie: req.body.movie,
        // dateOut: req.body.dateOut,
        // dateReturned: req.body.dateReturned,
        // rentalFee: movie.dailyRentalRate

    })

    new Fawn.Task()
        .save('rentals', rental)
        .update('movies', {
            _id: movie._id
        },
        {
            $inc: {
                numberInStock: -1
            }
        })
        .run();

    // await movie.numberInStock--;
    // await movie.save();
    // await rental.save();
    res.send(rental);

})




module.exports = router;
