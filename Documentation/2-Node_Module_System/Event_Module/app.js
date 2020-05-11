const EventEmitter = require('events');

const emitter = new EventEmitter();

emitter.on('messageLogged', (arg) => console.log('Event Raised with arg: ', arg))

emitter.emit('messageLogged', {
    id: 1,
    url: 'https://'
});