var url = 'http://mylogger.io/log';

const EventEmitter = require('events');
const emitter = new EventEmitter();

class Logger extends EventEmitter{
    log(message){
        // Send an HTTP request
        console.log(message);
    
        // Raise an event
        this.emit('messagedLogged', {id : 1, url : 'http://'})
    
    }
}


module.exports = Logger;
