const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/Genre');


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

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
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


router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
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

router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        let genre = await Genre.findByIdAndDelete(req.params.id);
        res.send(genre);
    }
    catch (ex) {
        res.send(ex);
    }
})


module.exports = router;