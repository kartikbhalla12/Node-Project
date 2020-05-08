const winston = require('winston');

function error(err, req, res, next) {
    
    winston.error(err.message, err)
    res.status(500).send('Something Failed..');
}

module.exports = error