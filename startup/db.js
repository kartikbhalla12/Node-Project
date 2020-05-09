const winston = require('winston')
const mongoose = require('mongoose');
const config = require('config')

module.exports = async function connectDB(){
    const mong = await mongoose.connect(config.get('db'), { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,})
    if(mong) return console.log(`Connected to ${config.get('db')}`);

}