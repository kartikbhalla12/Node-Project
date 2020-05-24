/*

Introduction

    In the real world, there are always unexpected errors, for eg, the connection drops out to thew mongodb database.
    We should always count on these unexpected errors and handle them properly, which means we should send proper 
    error message to the client and we should log the exception on the server, so that we can see what issues are 
    happening occasionally and we can then fix them easily. 

    For eg, if the connection breaks with the database server, we get an unhandledPromiseRejection exception because
    in all the routes we haven't provided any catch blocks


Handling Rejected Promises

    One solution to these is using a try catch block in every route something like

        router.get('/', async (req, res) => {

            try {
                const genres = await Genre.find()
                res.send(genres)
            }

            catch (ex) {
                
                // log the exception to the server.
                
                res.status(500).send('Something Failed')
            }
        })


Express Error Middleware

    Now after updating all the routes with these try catch block, if we ever decide to change the message that we want to return to the client,
    we need to update in every route handlers. So we want to move this logic to a single place.

    In express we have a special kind of middleware function called 'express error middleware'. We register this function and use this after all 
    the existing middleware functions. We can call it in index.js but its a best practice to make a new module of error middleware in the 
    middleware folder. This middleware function has 4 parameters -> err, req, res, next

        function errorMiddleware (err, req, res, next) { }

    Now in this middleware function we can add all the logic that we need to add

        function errorMiddleware (err, req, res, next) {

            // log the exception to the server.
        
            res.status(500).send('Something Failed')
        }

    and now we can use this using app.use(errorMiddleware) after all the existing middlewares.

    Since now we don't want to terminate the request processing pipeline in the route handler , we pass a 'next' parameter as well, and we can then 
    pass our exception using 'next' to the error middleware

        router.get('/', async (req, res, next) => {

            try {
                const genres = await Genre.find()
                res.send(genres)
            }

            catch (ex) {
                next(ex)
            }
        })

    However, in these routes, we have a try catch block which has to be repeated in every route, and in the catch block we have to pass the exception to 
    the err middleware, which is very repetitive in nature, 


Removing Try-Catch Block

    One solution to remove this repetitive try catch block is to make a function something like this

        function asyncMiddleware() {
            
            try {

                //
            }   

            catch (ex) {
                next(ex)
            }
        }
    
    Since each route handler has different set of statements in the try block, we need to do something so that this function get theses statements, we can pass
    a function to this as a parameter called handler and execute handler in the try block
    
        function asyncMiddleware(handler) {
            
            try {
                handler();
            }   

            catch (ex) {
                next(ex)
            }
        }

    In our route handler, we can remove the try-catch block and pass this second parameter to the route as an argument to the async middleware
    We can also remove the next, since we are not calling it here anymore

        router.get('/',  asyncMiddleware( (req, res) => {
                const genres = await Genre.find()
                res.send(genres)
        } ))
    
    since this is an async operation, we need to await the handler
        
        async function asyncMiddleware(handler) {
            
            try {
                await handler();
            }   

            catch (ex) {
                next(ex)
            }
        }
        
    but in the current implementation, we are calling the asyncMiddleware function and passing the handler as an argument, however this route handlers we
    pass a reference to this function and they are then called automatically in the request processing pipeline,

    so we need to modify the asyncMiddleware to return a function that will eventually call these values
        
        async function asyncMiddleware(handler) {
            
            return function (req, res, next) {

                try {
                    await handler(req, res);
                }   

                catch (ex) {
                    next(ex)
                }
            }
        }

    since the return function is an async function and not the asyncMiddleware function, we need to mark the inner function as async

        function asyncMiddleware(handler) {
            
            return async function (req, res, next) {

                try {
                    await handler(req, res);
                }   

                catch (ex) {
                    next(ex)
                }
            }
        }

    now we can create a new module in the middleware folder and export this function to be imported in multiple files. With this approach, we simply wrap the 
    function inside the route handler with the asyncMiddleware


Express Async Errors

    While this asyncMiddleware function solves the issue of creating repetitive blocks, the problem we have is that we need to wrap each route handler using 
    asyncMiddleware. We have an npm module called 'express async errors' that will automatically monkey-patch all the route handlers.

        npm i express-async-errors

    we have to load this module when the application starts, so load this module using

        require('express-async-errors')

    we don't have to get the result and store it in any constant.

    Since we already have added the errorMiddleware in the request processing pipeline, with this module we don't need to create wrapper function for try catch 
    block, we can just use
        
        router.get('/', (req, res) => {
                const genres = await Genre.find()
                res.send(genres)
        })
        
    and if any exception occurs, this module will call the error middleware automatically internally.
        

Logging Errors

    In every real-world applications, we log these exceptions that are thrown in the application, so that later when we came back to the log file, we can see 
    what are the areas of the application that we can improve. We have a very popular library for this, 'winston'. Install winston using, 

        npm i winston

    import winston using

        const winston = require('winston')

    Winston has a default logger which we can use to log our errors, but we can also create our custom logger, but thats not required everytime. This logger object
    First we need has what we call a transport. A transport is essentially a storage device for our logs. winston comes with some core transports

        Console, for logging messages in console
        File, for logging messages in a file
        Http, for logging messages to an end point of an http server

    There are some third party transports available for logging into

        MongoDB,
        CouchDB,
        Reddis,
        Loggly


    Now to use a core transport like File,

        winston.add(new winston.transports.File({ filename: 'index.log' }))

    in the errorMiddleware, we can use winston to log the exception when we receive one. To log the error we use the log method on the winston object, 

        winston.log()

    As the first argument, we provide the logging level, logging level determines the importance of the message we are going to log. The logging levels are

        error
        warn
        info
        verbose
        debug
        silly

    and the second argument is the exception, we are going to log

        function errorMiddleware (err, req, res, next) {

            winston.log('error', err.message)
        
            res.status(500).send('Something Failed')
        }    

    alternatively we can use the logging level methods instead of the log method to directly pass the exception

        function errorMiddleware (err, req, res, next) {

            winston.error(err.message)
        
            res.status(500).send('Something Failed')
        }            
    
   Now with this winston will automatically log any exceptions received in the index.log file. Optionally we can also store the metadata
        
        function errorMiddleware (err, req, res, next) {

            winston.error(err.message, err)
        
            res.status(500).send('Something Failed')
        }
        


Logging to mongoDB

    In order to log these exception in the mongoDB database, we need to install an npm module called winston-mongodb

        npm i winston-mongodb

    we can include this in file by simply calling the require method

        require('winston-mongodb')

    with this, we can now add a mongodb transport using

        winston.add(new winston.transports.MongoDB({db : 'mongodb://localhost/vidly' }));

    Due to this transport, winston will automatically store the errors as the documents in mongoDB in a new collection called 'log'


Uncaught Exceptions

    The error middleware that we created only catches the exceptions occurred during request processing pipeline, any exceptions that occur outside the pipeline
    can still cause our application to crash.

    So we can use uncaughtException and unhandledRejection listeners. In the process method, we have 'on' method to listen to these events and catch exceptions, 
    and then inside this listener, we can use the winston to log errors. Unhandled Rejection is caused due to promises that failed with no catch block

        process.on('uncaughtException', (ex) => {
            winston.error(ex.message, ex)
        })

        process.on('unhandledRejection', (ex) => {
            winston.error(ex.message, ex)
        })

    
    alternatively, winston has a property called exceptions, which has a method called handle that can be used instead of the above uncaughtException event listener

        winston.exceptions.handle()
    
    in the function, as an argument, we add a new transport 

        winston.exceptions.handle(
            new winston.transports.File({ filename: 'index.log' })
        );

    with this winston with automatically log th exceptions. But we don't have a method for handling promise rejections, so we can use unhandledRejection listener and throw
    an exception from it which winston will handle

        process.on('unhandledRejection', (ex) => {
            throw ex;
        })















*/
