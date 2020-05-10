const Joi = require('joi');
const express = require('express');
const auth = require('../middleware/auth')
const router = express.Router();
const { Movie, validate } = require('../models/Movie');

const validateBody = require('../middleware/validate');

router.get('/', async (req, res) => {
    try {
        const movies = await Movie
        .find()
        .populate('genre', '-__v -_id');
        res.send(movies)
    }
    catch (ex) {
        res.send(ex)
    }
})

router.post('/', [auth, validateBody(validate) ], async (req, res) =>{
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const movie = new Movie({
        title: req.body.title,
        genre: req.body.genre,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    const result = await movie.save();
    res.send(result);

})

module.exports = router;