const express = require('express');
const Joi = require('joi');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log(`Connected to MongoDB`))
    .catch((err) => console.log(`Error: Couldn\'t connect to MongoDB`));



app.use(require('morgan')('tiny'));
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port: ${port}`));