const EventEmitter = require('events');

const emitter = new EventEmitter();

const url = 'http://mylogger.io/log';

class Logger extends EventEmitter {
	logMessage(message) {
		//send an HTTP Request
		console.log(message);

		this.emit('messageLogged', {
			id: 1,
			url: 'https://',
		});
	}
}

module.exports.Logger = Logger;
module.exports.endPoint = url;
