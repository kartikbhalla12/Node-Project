const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { Auth, validate } = require('../models/Auth');
const _ = require('lodash');
const bcrypt = require('bcrypt');


router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid username or password..');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid username or password..');

    const token = user.generateToken();
    res.send(token);
})

module.exports = router