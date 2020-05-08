const winston = require('winston')
const mongoose = require('mongoose');

module.exports = async function connectDB(address){
    const mong = await mongoose.connect(address, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,})
    if(mong) return console.log(`Connected to MongoDB`)

}