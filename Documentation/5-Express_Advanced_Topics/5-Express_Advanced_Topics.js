/*

Middleware

    A middleware function is function that takes a request object and either 
    returns a response to the client or passes the control to another 
    middleware function.

    We have already seen couple of examples of middleware. Every route handler 
    is essentially a middleware function. That are

        app.get(), app.post() ....
    
    We have also seen another example of middleware function    
        
        app.use(express.json())

    express.json() returns a middleware function and its job is to read the 
    request and if there is a json object in the body of request, it will 
    parse the body of the request into a json object, so that we can 
    access it using req.body.<value>

    When we receive a request on the server, this request goes through a 
    pipeline called 'request processing pipeline'

    This pipeline consists of one or more middleware functions, each middleware 
    function either terminates the request response cycle by returning the
    response to the client, or passes the control to the next middleware function.

    Express includes many built in middleware functions, but we can also create 
    custom middleware functions


Creating Custom Middleware Functions

    We call a function that takes three parameters request, response, and next.
    next is function that is used to call the next middleware function

        function log(req, res, next) {
            console.log('Logging...')
            next();
        }

    If we don't call next, our request will end up hanging.
    We need to add this middleware in the request processing pipeline. So we use 
    app.use() to pass the reference of this function.

        app.use(log)

    We can create another middleware function that can used for authenticating at some point
          
        function authenticate(req, res, next) {
            console.log('Authenticating...')
            next();
        }

    and we can call these using

        app.use(log);
        app.use(authenticate);

    Middlewares are executed in the request processing pipeline in order they 
    are defined in the code. Middleware functions are usually declared 
    in another module and then exported from it.

    module.exports = function(req, res, next) {
            console.log('Logging...')
            next();
        }
    
    and import in the required file using

        const logger = require('path/to/logger_middleware_module')


Built-in Middlewares

    One of the built-in middleware in express is express.json() that we used 
    to parse the body of the request.

    Another built in middleware in express is express.urlencoded() which returns a middleware 
    function that parses body of the request with url encoded payloads like
        
        key=value&key=value.....

    last built in middleware function in express is express.static(). we use this to serve 
    the static files like images, css etc. We pass an argument that is a folder name

        app.use(express.static('public'));
    
    This means that we should store all our static files in public subfolder 


Third Party Middleware

    helmet
        
        This middleware function is used to secure our application by setting various http headers.
        Install helmet using

            npm i helmet

        and load this module by 

            const helmet = require('helmet');

        It returns a function and we can use this in our request processing pipeline

            app.use(helmet());
        
    Morgan 

        This middleware function is used to log the requests in the console in a elegant way. Install morgan using

            npm i morgan

        and load this module by 
            
            const morgan = require('morgan');

        It returns a function that takes a argument that specifies the length and amount of info that it prints. 
        And we can use this in our request processing pipeline by

            app.use(morgan('tiny'));


Environments

    We often need to know what environment our code is running on, based on which we decide to run 
    certain features like we want http logging to only run when we are in development machine 
    and not in production

    The global object 'process', gives the access to current process. It has a property called 
    env which gives all the environment variables.

    process.env has a property 'NODE_ENV' which gives the type of environment the app is running,
    by default it is undefined and can be set using

        setx NODE_ENV development    (alternatively you can set it to testing, staging, production etc)
    
    So if we want to use morgan on development machine only

        if(process.env.NODE_ENV === 'development')
            app.use(morgan('tiny'))
        
        
Configuration

    We often require to change some variables when in different environments. For eg, we use localhost 
    during development and some domain in production

    We can do this using a npm package called 'config'. Install config using

        npm i config

    Create a new folder named 'config' in the root directory of the application.Create a new file 
    named exactly as 'default.json'. This will contain all the values that are used in our 
    application that can be overwritten by the different environments. In default.json 
    add a new object for eg.
        
        {
            "name" : "My Express App"
        }

    Now in our app, include config using
        
        const config = require('config')
    
    and we can access this variable using config.get('name')
    
    Now create a file named 'development.json'. This will overwrite the values when in 
    development environment

        {
            "name" : "My Express App - Development"
        }
    
    Now if we are in a development machine and we console.log config.get('name') we will get
    'My Express App - Development' instead of 'My Express App'

    Some variables like database secrets can not be stored in the source code, rather they are 
    stored in environment variables in that particular machine

    in order to access these, create a new file named exactly as 'custom-environment-variables.json'.
    Inside it create an object with key as the local name and value as the name of environment 
    variable in the machine

        {
            "db" : "myApp_key"
        }
    
    and we can access this using config.get('db')


DEBUG

    While in development, we often use console.log() to see some stuff, but as soon we are done 
    with it, we either comment or delete these console.logs but when re-visiting the code 
    encountering a bug or something, we need to write these again.

    There is a npm package that shows these messages in console depending on the environment variable called 'DEBUG'.
    Install debug using,

        npm i debug

    We can have multiple debuggers for eg one for startup, one for debugging db related stuff. 
    We can define these debuggers using

        const startupDebugger = require('debug')('app:startup')
        const dbDebugger=require('debug')('app:db')

    
    and use startupDebugger('Logging startup messages...') etc. instead of console.log. 

    Now if we want only startup messages to log in the machine, we export the environment variable DEBUG to

        setx DEBUG app:startup

    or for multiple debuggers,

        setx DEBUG app:startup,app:db

    or for all debuggers,
        
        setx DEBUG app:*

    In real world, we might only need one debugger, so we can declare

        const debug = require('debug')('app:startup') and log using 
        debug('Logging')
    
    
Templating Engines

    In some cases, we often need to return the HTML markup to the client rather than sending plain JSON data. 
    Templating engines are used to create these HTML markup. Most common engines include Pug, moustache, EJS.

    Install Pug using 

        npm i pug

    We don't have to require the pug, rather we need to se the view engine to pug which then internally 
    loads the module

        app.set('view engine', 'pug')

    Now create a folder named 'views' inside the root dir, create a file called index.pug, Inside the pug file, 
    use the pug syntax

        html
            head
                title=appName
            body
                h1=message

    appName and message are the parameters and need to be given dynamically.
    Now in routes, we use res.render() instead of res.send with first argument as the name of the file and the 
    second argument as object containing all the parameters that are needed by the pug file

        res.render('index', {appName: 'My App', message: 'Hello'})

    To change the default views directory, we can use

        app.set('views', './path/to/directory')


Refractoring routes

    Routes

        All routes should be in a folder called routes for easier accessibility.
        
        Each end point should have its own specific file in this folder like courses.js for /api/courses end point

        In order to extract these routes from the main file, we have to use router instead of app in the sub modules

        for eg. router.get(), router.post() etc

        we need to import router by 

            const express = require('express')    
            const router = express.Router()

        and then we export the router at the end

        we import these routers in the main file using

            const courses = require('./path/to/courses/routes')
            app.use('/api/courses', courses)

        This makes the route code shorter as we specified the url in the main file and we no longer require to write 
        the whole path in router routes in the course sub module

            router.get('/', () => {})   this will automatically route to /api/courses

    Middlewares

        All middlewares should be placed inside a folder called middlewares for easier readability.




*/
