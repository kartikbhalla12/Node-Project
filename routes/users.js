const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const { User, validate } = require('../models/User');
const _ = require('lodash');
const bcrypt = require('bcrypt');


router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User already registered..')

    user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);

    user.password = hashed;
    
    await user.save();
    const token = user.generateToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']))

})


router.get('/me', auth, async (req, res) => {
    let user = await User.findOne({_id: req.user._id});
    res.send(_.pick(user, ['name', 'email', '_id']));
})


module.exports = router