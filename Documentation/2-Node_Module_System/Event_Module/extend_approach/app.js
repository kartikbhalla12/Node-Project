const Logger = require('./logger.js').Logger;

const logger = new Logger();

logger.on('messageLogged', (arg) =>
	console.log('Event Raised with arg: ', arg)
);

logger.logMessage('message');
