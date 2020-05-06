const Joi = require('joi')
const express = require('express');
const router = express.Router();
const Genre = require('./../models/Genres')


router.get('/', async (req, res) => {
    try {
        let genres = await Genre.find();
        res.send(genres);
    }
    catch (ex) {
        res.send(ex);
    }
})

router.get('/:id', async (req, res) => {
    try {
        let genre = await Genre.findById(req.params.id);
        if(!genre) 
            return res.status(404).send('Genre not found...');
        res.send(genre)
    }
    catch (ex) {
        res.send(ex);
    }
})

router.post('/', async (req, res) => {
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    try {
    let genre = new Genre({
        name: req.body.name
    });
        const result = await genre.save();
        res.send(result)
    }
    catch (ex) {
        res.send(ex.errors.name.message);
    }
})


router.put('/:id', async (req, res) => {
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    try {
        let genre = await Genre.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name
            }
        },
        { new: true })
        if(!genre) 
            return res.status(404).send('Genre not found...');
        res.send(genre);
    }
    catch (ex) {
        res.send(ex.message);
    }
})

router.delete('/:id', async (req, res) => {
    try {
        let genre = await Genre.findByIdAndDelete(req.params.id);
        res.send(genre);
    }
    catch (ex) {
        res.send(ex);
    }
})




function validateGenre(genre) {
    const validatesSchema = {
        name: Joi.string().min(5).required(),
    }
    return Joi.validate(genre, validatesSchema);
}


module.exports = router;