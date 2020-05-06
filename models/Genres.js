const mongoose = require('mongoose');


const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

module.exports = mongoose.model('Genre', genreSchema);