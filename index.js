const config = require('config')
const express = require('express');
const Joi = require('joi');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const rentals = require('./routes/rentals')
const movies = require('./routes/movies');
const users = require('./routes/users');
const auth = require('./routes/auth')
const mongoose = require('mongoose');
Joi.objectId = require('joi-objectid')(Joi);



const app = express();

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,})
    .then(() => console.log(`Connected to MongoDB`))
    .catch((err) => console.log(`Error: Couldn\'t connect to MongoDB`));



app.use(require('morgan')('tiny'));
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/rentals', rentals);
app.use('/api/movies', movies);
app.use('/api/users', users);
app.use('/api/auth', auth)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port: ${port}`));