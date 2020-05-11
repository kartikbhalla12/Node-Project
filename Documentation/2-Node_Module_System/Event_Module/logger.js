const url = 'http://mylogger.io/log';

function logMessage(message) {
    //send an HTTP Request
    console.log(message);
}

module.exports.log = logMessage;
module.exports.endPoint = url;