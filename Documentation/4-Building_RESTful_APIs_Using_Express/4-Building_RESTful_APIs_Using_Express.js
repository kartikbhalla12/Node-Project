/* 

RESTful services ( RESTful APIs )

    Most of the client applications often need to talk with the servers ( or 
    the backend ) to get or save the data. This communication happens 
    using the http protocol

    On server, we expose bunch of services which the client can access 
    using the http requests

    REST is short for 'Representational State Transfer' is a convention to 
    build these http services.

    We use simple http protocol principles to provide support for 
    CREATE, READ, UPDATE, DELETE collectively called as' CRUD Operations'

    we can export our resources using this api. For eg we need to get list 
    of movies from api https://www.vidly.com/api/movies will 
    provide a bunch of JSON data which we can use on the client side
    
    Every HTTP Request has a verb ( Method ) that determines its 
    type or intention. Some Standard HTTP Methods include 

        GET -> To get the data      eg. GET /api/customers or GET /api/customers/1
        POST -> To create a data    eg. POST /api/customers with a request body
        PUT -> To update a data     eg. PUT /api/customers/1 with a request body
        DELETE -> To delete a data  eg. DELETE /api/delete/1


Express

    Express is a fast and lightweight framework for building web applications.
    Install express using
        
        npm i express

    Load the express module using
        
        const express = require('express)

    it returns a function which can be called as
        
        const app = express()   (conventionally called as app)

    app has bunch of methods like get, post, put, delete. These methods has two arguments

        app.get(<path>, <callback function>)

    the callback function takes two argument request and response 

        For eg: app.get('/', (req, res) => { })
    
    res.send(<data>) is used to send data in response of a request
        
        For eg: app.get('/', (req, res) => { 
            res.send('Hello World')
        })

    We need to listen on a given port, so we call

        app.listen(<PORT NO>,<optional callback function>)

        For eg: app.listen(300, () => console.log('Listening on PORT 3000'))

    run the file using 
        
        node index.js

    head over to chrome to localhost:3000/ and you will see 'Hello World'.
    We can add multiple get routes to different paths. For eg,

        app.get('/api/courses', (req, res) => {
            res.send([0,1,2,3])
        })
        
    Thus Express makes handling routes very easy.
    

Nodemon 

    Nodemon or short for 'node monitor' is a package that can be used to run the 
    application which then monitors the changes and automatically restarts the 
    application rather than doing manually. Install nodemon globally using, 

        npm i -g nodemon
    
    You can run the application using
        
        nodemon index.js


Environment Variables

    Since we hardcoded the port that is usually assigned dynamically in the hosting 
    servers, chances are that our application wont be accessible

    So we need to fix this by using a environment variable. An environment variable 
    is basically a variable which is a part of the environment in which the process runs.
    It is independent of the app

    We can access an environment variable using a process object

        process.env

    it includes all the env variables. We need to check if the port env var is defined or not.
    We will use our own defined port unless it is defined in an env variable

        const PORT = process.env.port || 3000
        app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))


Route Parameters

    In order to get a single course, rather than an array, we need to include the id of 
    the course in the url

        eg. url will be like /api/courses/1
    
    to get the id of the course from the url we use,

        app.get('/api/courses/:id', (req, res) => { })

    and we can access this id using

        req.params.id
    
    then we can perform any operation using this id, for eg show the course that has this id

    we can have multiple parameter like

         /api/posts/:year/:month

    and can be accessed using req.params.year and req.params.month

    Queries are represented in the url by ?
        
        eg /api/course?sortBy="name"

    and can be accessed using req.query.sortBy

Handling Responses

    We can provide a response status code
    
        1xx are the informational responses
        2xx means successful responses,
        3xx indicates Redirects,
        4xx indicates client side errors,
        5xx indicates server side errors

        Most common client errors include

            400 Bad Request
            401 Unauthorized
            403 Forbidden
            404 Not Found


POST Request

    To simulate POST request, install Postman Software

        Link: https://www.postman.com/

    Postman offers many features for testing api requests.
    
    POST requires values that need to be added in its request. In Postman, select the post 
    method and select the body option. Select raw and JSON from the drop down menu. Add 
    all the values that are needed to be passed in JSON format

        {
            "name": "The Complete Node.js Course",
        }

    JSON parsing isn't enabled in express by default, we need to explicitly enable it using

        app.use(express.json())

    This is called a middleware and will be explained later in the course

    The values from the JSON Object can be accessed from the body of request. In app, create a post route by

    app.post('/api/courses', (req, res) => {
        const course = {
            id: courses.length + 1,
            name: req.body.name
        }

        courses.push(course)
    })


Input Validation

    We are often required to validate the data that comes with the requests.
    Joi is a library that validates the requests. Install Joi by

        npm i Joi

    include joi by

        const Joi = require('joi)

    it returns a class, thats why J is kept capital. In order to validate, Joi requires a schema which it \
    uses to cross check the body of the request. So create a schema by

        const validateScheme = {
            name: Joi.string().min(5).max(50).required()
        }

    now validate body of the request by

        const result = Joi.validate(req.body, validateSchema)

    If the request given is validated, result will have a 'value' property
    
    If the request given is not validated validated, result will have an 'error' property.

        if (error) return res.status(400).send(error.details[0].message);


PUT Request

    Put request requires an id that has to be updated. the id is retrieved from route parameters

        app.put('/api/courses/:id', (req, res) => {
            const course = courses.find((course) => course.id === req.params.id)
            if(!course) return res.send('no course found')

            const validateScheme = {
                name: Joi.string().min(5).max(50).required()
            }
            if (error) return res.status(400).send(error.details[0].message);

            course.name = req.body.name;

            res.send(course);
            })
            

DELETE Request

    Delete Request only requires an id in the route parameters that has to be deleted

        app.delete('/api/courses/:id', (req, res) => {
            const course = courses.find((course) => course.id === req.params.id)
            if(!course) return res.send('no course found')

            const index = courses.findIndex(course)
            courses.splice(index, 1)

            res.send(course);
        })
            

*/
