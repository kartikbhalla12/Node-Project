const express = require('express');
const router = express.Router();
const Joi = require('joi');
const auth = require('../middleware/auth')
const Customer = require('../models/Customer')

router.get('/', async (req, res) => {
    let customers = await Customer.find();
    res.send(customers)
})

router.post('/', auth, async (req, res) => {
    let customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });

    const result = await customer.save();
    res.send(result)
})
module.exports = router;