const express = require('express');
const Joi = require('joi');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const rentals = require('./routes/rentals')
const movies = require('./routes/movies')
const mongoose = require('mongoose');
Joi.objectId = require('joi-objectid')(Joi);


const app = express();

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log(`Connected to MongoDB`))
    .catch((err) => console.log(`Error: Couldn\'t connect to MongoDB`));



app.use(require('morgan')('tiny'));
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/rentals', rentals);
app.use('/api/movies', movies)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port: ${port}`));