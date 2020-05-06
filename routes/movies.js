const Joi = require('joi');
const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');


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

router.post('/', async (req, res) =>{
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        const movie = new Movie({
            title: req.body.title,
            genre: req.body.genre,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });
        const result = await movie.save();
        res.send(result);
    }

    catch (ex) {
        res.send(ex);
    }


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

module.exports = router;