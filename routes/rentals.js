const express = require('express');
const router = express.Router();
const { Rental, validate } = require('../models/Rental');
const Customer = require('../models/Customer')
const Movie = require('../models/Movie');
const Fawn = require('fawn');
const mongoose = require('mongoose');
Fawn.init(mongoose);

router.get('/', async (req, res) => {
    try {
        const rentals = await Rental
        .find()
        .populate('movie customer')
        res.send(rentals)
    }
    catch (ex) {
        res.send(ex)
    }
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customer);
    if(!customer) return res.status(404).send("Invalid Customer ID...")

    const movie = await Movie.findById(req.body.movie);
    if(!movie) return res.status(404).send("Invalid Movie ID...")

    if(movie.numberInStock == 0) return res.status(400).send("Movie out of stock..")
    const rental = new Rental({
        customer: req.body.customer,
        movie: req.body.movie,
        // dateOut: req.body.dateOut,
        // dateReturned: req.body.dateReturned,
        rentalFee: movie.dailyRentalRate

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




module.exports = router
