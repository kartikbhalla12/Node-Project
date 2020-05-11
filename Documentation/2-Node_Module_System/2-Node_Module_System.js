/*

Some Global Object and Functions

    console.log();
        console is a global object and console.log is used to print something in terminal.

    setTimeout(function, time in ms);
        used to execute the function after a certain period of time.

    clearTimeout()
        used to clear timer set.

    setInterval(function, time)
        used to execute a function repeatedly after a certain period of time.

    clearInterval()
        used to stop the function from being called repeatedly


Modules

    In real world applications, we often split our js code into multiple files

    We should avoid defining variables and functions to the global scope 
    in order to avoid overriding of functions

    Every file in a node application is considered as module. All the variables and 
    functions defined in the module are private to that module. This means they 
    cant be accessed outside the module

    If we want to use some variable or function outside the module, we need to 
    make it public or export it

    Every module has a module object that contains info about the module. You can view 
    module object by logging it into the console

        console.log(module) in app.js

    Module {
        id: '.',
        path: 'C:\\Users\\kartik\\Desktop\\vidly\\Documentation\\2-Node_Module_System',
        exports: {},
        parent: null,
        filename: 'C:\\Users\\kartik\\Desktop\\vidly\\Documentation\\2-Node_Module_System\\app.js',
        loaded: false,
        children: [],
        paths: [
            'C:\\Users\\kartik\\Desktop\\vidly\\Documentation\\2-Node_Module_System\\node_modules',
            'C:\\Users\\kartik\\Desktop\\vidly\\Documentation\\node_modules',
            'C:\\Users\\kartik\\Desktop\\vidly\\node_modules',
            'C:\\Users\\kartik\\Desktop\\node_modules',
            'C:\\Users\\kartik\\node_modules',
            'C:\\Users\\node_modules',
            'C:\\node_modules'
        ]
    }


Creating a Module

    Let us say that we have a logging service at http://mylogger.io/log to which we can send 
    a http request to log messages. we can make this as module since we can reuse this 
    module in many other parts of this application.Making things simple, 
    we will mock the actions of the service

    Create a new file called logger.js

    Add a constant named url that contains the logging service endpoint

        const url = 'http://mylogger.io/log';

    Add a function that logs a message in console

        function logMessage(message) {
            //send a HTTP Request
            console.log(message)
        }

    Since this function and the constant is private to the logger module, thus in order to access them 
    outside the module, we can use 'exports' property of the 'module' object. Thus we can add our 
    function (logMessage) and the constant ( url ) to the module.exports.So, we can set 
        
        module.exports.log = logMessage;
        module.exports.endPoint = url;
        
    Note here the function in public will be called as log and the constant as endPoint


Loading a Module

    We can import this function in our app.js using 'require("path/to/module")' method. In app.js write

        const logger = require('./logger.js')

    This returns an 'object' containing log function, to call the function we use its public name,

        logger.log('Hey this is a log message')

    If we have only one function or variable to export from our module we can set the module.exports 
    directly to that function or variable. Lets say we only want to export our logMessage function,
    so instead of modules.exports.log, we can directly use module.exports

        module.exports = logMessage;
    
    Now, on importing it, require will return a 'function' rather than an 'object'

        const log = require('./logger.js');
    
    So we can directly call it using log

        log('Hey this is a log message');
    
    Note here no public name is given during export, so you can use any name at the time of import


Module Wrapper Function

    At the runtime, node wraps each module in a function like this

        function(exports, require, module, __filename, __dirname){
            ...
        }
    
    This has above 5 arguments which are passed in this function
        
        exports is a shortcut for module.exports
        require is a local variable for each module
        module is an object with different properties
        __filename is the the complete path to the file
        __dirname is the complete path to the directory the file is in
    
    
Predefined Node Modules

    Path Module
        
        All methods at: https://nodejs.org/dist/latest-v12.x/docs/api/path.html

        We can import is using,
            
            const path = require('path');
        
        It has a parse method which takes __filename as argument and provides an object 
        with useful info. So call it and store it into a constant and log this variable.

            const pathObj = path.parse(__filename);
            console.log(pathObj)
        
        And run it in node, we get

            {
                root: 'C:\\',
                dir: 'C:\\Users\\kartik\\Desktop\\vidly\\Documentation\\2-Node_Module_System',
                base: 'app.js',
                ext: '.js',
                name: 'app'
            }
        
    OS Module
            
        All methods at: https://nodejs.org/dist/latest-v12.x/docs/api/os.html

        Contains info about Operating System and we can import using,

            const os = require('os');
        
        It has freemem and totalmem methods which returns the free memory and total 
        memory respectively. So we can call them and log them using,

            const freeMem = os.freemem();
            const totalMem = os.totalmem();

            console.log(`Free Memory : ${freeMem}, Total Memory: ${totalMem}`)
        
        Which logs memory in bytes
            
            Free Memory : 11049701376, Total Memory: 17116618752

    Fs Module

        All methods at: https://nodejs.org/dist/latest-v12.x/docs/api/fs.html

        It contains all the functionality that requires to work with files, 
        we can import it using

            const fs = require('fs');
        
        It has a readdir method which returns all the files in the specified directory.
        It is an async method thus it takes a callback function as an argument 
        which executes when the request is completed.

            fs.readdir('path', callback_function)
        
        Callback function has two arguments, err and files. On a successful request, files is 
        defined and err is null. On an unsuccessful request, err is defined and 
        files is null. So we can call it using

            fs.readdir('./', function(err, files) {
                if(err) return console.log('error', err);
                return console.log('Files', files);
            })
        
        The output comes out to be 
            
            Files [ '2-Node_Module_System.js', 'app.js', 'logger.js' ]

    
    Events Module

        All methods at: https://nodejs.org/dist/latest-v12.x/docs/api/events.html

        An event is a signal that indicates that something happened in our application.
        For example an event is created when the application receives an HTTP request

        It contains a class called eventEmitter which is one of the core class and 
        lot of classes are based on eventEmitter. We can import events using,
            
            const EventEmitter = require('events');
        
        Require returns a class and thus we follow 'class convention' of naming the constant. 
        We need to create a new instance ( object ) of this class using,

            const emitter = new EventEmitter();
        
        This emitter object has bunch of methods, from which two are used commonly, 
        that are 'emit' and 'eventListener' ( or 'on' ). 'emit' method is used to raise an event

            emitter.emit('name of event');
        
        We also need to specify a listener that listens to the event. It can be done 
        using 'addListener' or 'on' methods
            
            emitter.on('name of the event', callback_function)

        callback_function is called when the listener listens an even with the name of the event.
        Emitter listener should be declared before an event.
        
            emitter.on('messageLogged',() => console.log('Event Raised'))
        
        When we raise an event, we usually pass some kind of data with the event.
        When raising an event we can add additional arguments in the 'emit' method
            
            emitter.emit('name of event', 1, 'url');
        
        It's a better practice to add all these args inside an object and pass a single object

            emitter.emit('name of event', {
                id: 1,
                url: 'https://'
            });
        
        and we can listen to the event args using

            emitter.on('name of the event', (arg) => console.log('Event Raised with arg: ', arg))
        
        At the output we see a raised event log

            Event Raised with arg:  { id: 1, url: 'https://' }
        
        In real world, we don't work with eventEmitter class directly instead we create our own class 
        and extend it with eventEmitter. So we take the code of emitter declaration to logger.js
        
        Since logger should be the one which raises an event and our app listens to it, 
        we move the emit method to logger.js as well

        Now both files has emitter object but is not the same as they are in two different files. 
        Thus we need to add the logger function as a method inside a class and export Logger class instead

            class Logger extends EventEmitter{
                
                logMessage(message) {

                    //send an HTTP Request
                    console.log(message);

                        this.emit('messageLogged', {
                            id: 1,
                            url: 'https://'
                        });
                }
            }
            
            module.exports.Logger = Logger;

        In app.js, we need to import this class and create an instance

            const Logger = require('./logger.js').Logger;
            const logger = new Logger();

        and change the class from 'emitter' to 'logger' on the 'on' method
            
            logger.on('messageLogged', (arg) => console.log('Event Raised with arg: ', arg));
        
        also we need to change the logger method call to
            
            logger.logMessage('message');
        
        on running, we get the raised event
            
            Event Raised with arg:  { id: 1, url: 'https://' }
            


    HTTP Module

        All methods: https://nodejs.org/dist/latest-v12.x/docs/api/http.html

        We load the http module using,

            const http = require('http')
        
        createServer is a method that is used to create a web server
            
            const server = http.createServer(callback_function)
        
        createServer method takes a callback function as an argument which can be used to 
        respond to certain requests

            const server = http.createServer( (req,res) => {
                if(req.url == '/') {
                    res.write('Hello World');
                    res.end();
                }
            })
        
        we can also return a JSON object in response 
            
            const server = http.createServer( (req,res) => {
                if(req.url == '/') {
                    res.write('Hello World');
                    res.end();
                }

                if (req.url == '/api/') {
                    res.write(JSON.stringify([1,2,3]));
                    res.end();
                }
            })
        
        server is an eventEmitter object which can be used to listen to requests, etc. 
        We can call 'listen' method on server and give port no. as argument.

            server.listen(3000);


        Head over to localhost:3000, and you can see Hello World.
        Head over to localhost:3000/api and you can see the array as a JSON object

        In real world, we use express module to build API to give our application 
        a clean structure
     
*/
