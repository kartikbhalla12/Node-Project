const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/Genre');

router.get('/', async (req, res) => {
    let genres = await Genre.find();
    res.send(genres);
})

router.get('/:id', async (req, res) => {
    let genre = await Genre.findById(req.params.id);
    if(!genre) 
        return res.status(404).send('Genre not found...');
    res.send(genre)
})

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({
        name: req.body.name
    });
        const result = await genre.save();
        res.send(result)
})


router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
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

router.delete('/:id', [auth, admin], async (req, res) => {
    let genre = await Genre.findByIdAndDelete(req.params.id);
    res.send(genre);
})


module.exports = router;