const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre'
    },
    numberInStock: Number,
    dailyRentalRate: Number,
})


module.exports = mongoose.model('Movie', movieSchema);