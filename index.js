require('express-async-errors');
const winston = require('winston');
require('winston-mongodb')
const config = require('config')
const express = require('express');
const Joi = require('joi');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const rentals = require('./routes/rentals')
const movies = require('./routes/movies');
const users = require('./routes/users');
const auth = require('./routes/auth');
const mongoose = require('mongoose');
const error = require('./middleware/error')

Joi.objectId = require('joi-objectid')(Joi);

const app = express();

const add = 'mongodb://localhost/playground'


winston.add(new winston.transports.File({ filename: 'index.log', format: winston.format.combine(
    winston.format.prettyPrint()
  )}));
winston.add(new winston.transports.MongoDB({db: add, options: { useNewUrlParser: true, useUnifiedTopology: true} }))

winston.add(new winston.transports.Console({ format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
    winston.format.prettyPrint()
  )}));



process.on('uncaughtException', function(ex) {
    console.log(`Uncaught Exception`);
    winston.error(ex.message, ex)
 });
 process.on('unhandledRejection', function(ex) {
    console.log(`Unhandled Rejection`);
    winston.error(ex.message, ex)
 });

async function connectDB(address){
    const mong = await mongoose.connect(address, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,})
    if(mong) return console.log(`Connected to MongoDB`);
    return console.log(`Error: Couldn\'t connect to MongoDB`);

}

connectDB(add);


app.use(require('morgan')('tiny'));
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/rentals', rentals);
app.use('/api/movies', movies);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port: ${port}`));