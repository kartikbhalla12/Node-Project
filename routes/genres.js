const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/Genre');
const validateObjectId = require('./../middleware/validateObjectId')

const validateBody = require('../middleware/validate');

router.get('/', async (req, res) => {
    let genres = await Genre.find();
    res.send(genres);
})

router.get('/:id', validateObjectId, async (req, res) => {
    let genre = await Genre.findById(req.params.id);
    if(!genre) 
        return res.status(404).send('Genre not found...');
    res.send(genre)
})

router.post('/', [auth, validateBody(validate) ], async (req, res) => {

    let genre = new Genre({
        name: req.body.name
    });
        const result = await genre.save();
        res.send(result)
})


router.put('/:id', [auth, validateObjectId, validateBody(validate)], async (req, res) => {
    let genre = await Genre.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name
        }
    },
    { new: true })
    if(!genre) 
        return res.status(404).send('Genre not found...');
    res.send(genre);
})

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    let genre = await Genre.findByIdAndDelete(req.params.id);
    if(!genre) 
        return res.status(404).send('Genre not found...');
    res.send(genre);
})


module.exports = router;