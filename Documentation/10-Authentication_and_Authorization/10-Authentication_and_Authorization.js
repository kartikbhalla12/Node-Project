/*

Introduction

    Nearly all applications out there requires some kind of authentication and authorization. 'Authentication' is the 
    process of identifying if the user who they claim they are, that's when we login. Authorization is determining if
    the user has the right permission to perform the given operation. For eg. we want to make sure that only the 
    logged in users can modify the data, while the anonymous users can only read the data. We also want to makes sure
    the users that are admins are allowed to delete the data. 

    For this we essentially need to create two endPoints for our server, One for registering users, that will be a POST
    request to the server, and the other will the Login, which will also be a POST request, as we are creating a new 
    login request.

        Register:   POST /api/users
        Login:      POST /api/login

    
Creating the User model

    The user will have the following three properties,

        name,
        email,
        password

    Thus the userSchema will be something like

        const userSchema = new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minLength: 3,
                maxLength: 255
            },
            email: {
                type: String,
                required: true,
                unique: true,
                maxLength: 255,
                minLength: 5
            },
            password: {
                type: String,
                required: true,
                maxLength: 1024,
                minLength: 5
            }
        })

    the unique property is used to make sure, we don't store two users with the same email. Now finally, create the user model using

        const User = mongoose.model('User', userSchema);

    Now we can implement the Joi validation for the request that we receive

        function validate(user) {

            const schema = {
                name: Joi.string().min(3).max(255).required(),
                email: Joi.string().min(5).max(255),required().email(),
                password: Joi.string().min(5).max(255).required()
            }

            return Joi.validate(user, schema)
        }


Registering users

    To register a user, we can create a POST request. So we use the express router,

        router.post('/', async (req, res) => {

            const {error} = validate(req.body)
            if(error) return res.status(400).send(error.details[0].message)

            let user = await User.findOne({email: req.body.email})
            if (user) return res.status(400).send('User already registered')

            user = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })

            await user.save()

            return res.send(user)

        })


Using lodash

    While sending the response to the client on registering successfully, we don't wanna return the password to the client,
    to selectively return the properties in the object , we can use an npm library called lodash which is built on top of
    underscore

        npm i lodash

    we include this in the file using

        const _ = require('lodash');

    lodash has a method 'pick 'for working with objects. It picks the properties that are required and creates a new object, 
    that we can return to the client

        _.pick()

    pick takes first argument as the target object, and second object as the array of properties that are needed

        _.pick(user, ['_id', 'name', 'email'])

    and we can finally send thi object to the client

        res.send(_.pick(user, ['_id', 'name', 'email']))


Checking for password strength

    There is an npm package to check if the password provided has certain number of uppercase , lowercase, symbols etc.
    The package is called joi-password-complexity

        npm i joi-password-complexity

    we use this using,

        const passwordComplexity = require('joi-password-complexity');

    and to validate the password, we use

        passwordComplexity().validate(<password>);
   
    if we don't provide anything inside the passwordComplexity function, following default options are used
        
        {
            min: 8,
            max: 26,
            lowerCase: 1,
            upperCase: 1,
            numeric: 1,
            symbol: 1,
            requirementCount: 4,
        }

    if we want to customize this, we create a new object

        const complexityOptions = {

            min: 10,
            max: 30,
            lowerCase: 1,
            upperCase: 1,
            numeric: 1,
            symbol: 1,
            requirementCount: 2,
        }

    and pass as an argument inside the passwordComplexity function

        passwordComplexity(complexityOptions).validate(req.body.password);    


Hashing Passwords

    We don't want to store the passwords that are received by the client as a plain string, we usually hash these 
    passwords and then store inside the database. For this we will use a popular npm library called 'bcrypt'

        npm i bcrypt

    and require in the file using

        const bcrypt = require('bcrypt');

    To hash a password, we need a salt, which is basically a random string that is added before or after the password, 
    so the resulting hash password will be different everytime we hash a password. To generate a salt we use the 
    genSalt method. As an argument we need to pass the number of times we want this algorithm to run, more the 
    number, greater will be the complexity and longer the time it will take to get the salt . 10 is generally 
    considered a good number
    
        (async function () {

            const salt = await bcrypt.genSalt(10);
            console.log(salt)

        })();

    On the console we can see the salt

        $2b$10$uY2dQbwve5KQwepY.WzIhO

    With this, everytime we hash our password with a new salt, we get different results. Now that we have a salt, 
    we can use it to hash our password by using the hash method which takes the password and the salt

        (async function () {

            const salt = await bcrypt.genSalt(10);
            console.log(salt)
            const hashed = await bcrypt.hash(<password>, salt)
            console.log(hashed)

        })();
    
    On the console we can see the salt attached in front of the hashed password
    
        $2b$10$wKqAkx9Pd37WIMreEYSz4u
        $2b$10$wKqAkx9Pd37WIMreEYSz4uux1OKME7lX48DSbKnbg38IOft.yUyKu
    
    The salt is attached to the password because if in future if we want to compare the password entered by client 
    and password stored in our database, bcrypt will decrypt the password using this salt

        decrypt.compare('1234', hashed)
    
    
Authenticating Users

    In order to authenticate users, we must have an endpoint where we can do a post request, so we create a new route.
    We want user to make a post request with a valid email and password, so we need to create a validate function using joi

        function validate(req) {

            const schema = {
                email: Joi.string().min(5).max(255),required().email(),
                password: Joi.string().min(5).max(255).required()
            }

            return Joi.validate(req, schema)
        }

    Now create a post method using express router

        router.post('/', async (req, res) => {

            const {error} = validate(req.body)
            if(error) return res.status(400).send(error.details[0].message)
        
        }

    Now we need to find the user from the database using the provided email id. If the user doesn't exist, we send a 404 response
    with a vague message of 'Invalid id or password'. We can't be specific in this case
        
        router.post('/', async (req, res) => {

            const {error} = validate(req.body)
            if(error) return res.status(400).send(error.details[0].message)

            let user = await User.findOne({email: req.body.email})
            if (!user) return res.status(400).send('Invalid id or password')

        })

    Now if we have the user, we need to verify the password , here we use the bcrypt compare method to compare the password and 
    send the same vague response if the password is invalid. The compare method returns a boolean.

        router.post('/', async (req, res) => {

            const {error} = validate(req.body)
            if(error) return res.status(400).send(error.details[0].message)

            let user = await User.findOne({email: req.body.email})
            if (!user) return res.status(400).send('Invalid id or password')

            const validPassword = bcrypt.compare(req.body.password, user.password)
            if(!validPassword) return res.status(400).send('Invalid id or password')

        })       

    Now if everything is good, we return a simple true as a response to the user os of now
        
        router.post('/', async (req, res) => {

            const {error} = validate(req.body)
            if(error) return res.status(400).send(error.details[0].message)

            let user = await User.findOne({email: req.body.email})
            if (!user) return res.status(400).send('Invalid id or password')

            const validPassword = bcrypt.compare(req.body.password, user.password)
            if(!validPassword) return res.status(400).send('Invalid id or password')

            return true

        }) 
        
        
JSON Web Tokens (JWT)

    In real world, rather than returning true to the client on a successful login, we return something called a JSON Web Token.
    A JSON web token is basically a long string that identifies a user. When the user logs in, we create a new JWT and send 
    it to the client. This jwt is then stored on the client side and is used everytime to send any request that requires 
    authentication while the user is logged in

    JWT Site : https://jwt.io/

    Head over to the website to see a real jwt as an example. A JWT has three parts and each part is color coded.
    
        The first part that is color coded as red is the 'header' and has properties like 'alg' and 'type'. 'alg' determines 
        the type of algorithm used 

        The second part or the 'payload' is the actual object that has been encoded in the JWT like the properties of the user 
        like name , email etc

        The last part is the 'verify signature' is a digital signal which is created based on the content of the object along 
        with a secret key that is defined as an env variable on the server


Generating Authentication Tokens

    Install the JWT node package using,

        npm i jsonwebtoken

    and include in the file using

        const jwt = require('jsonwebtoken')

    this jwt object has a method 'sign' which can create a valid jwt using the object or payload and a secrete key. The first
    argument is the payload and the second argument is the secret key. 

        router.post('/', async (req, res) => {

            const {error} = validate(req.body)
            if(error) return res.status(400).send(error.details[0].message)

            let user = await User.findOne({email: req.body.email})
            if (!user) return res.status(400).send('Invalid id or password')

            const validPassword = bcrypt.compare(req.body.password, user.password)
            if(!validPassword) return res.status(400).send('Invalid id or password')

            const token = jwt.sign({_id: user.id}, 'jwtPrivateKey')
            res.send(token)

        })  
        
    Note this private key should be stored as an environment variable and not hardcoded like this. Use the 'config' npm package and receive 
    the env variable using custom-environment-variables.json file. Now when the client receives this jwt,  this should get stored in the 
    localStorage of the web browser, so the client won't have to log in again and again when the page reloads.


Setting Response Headers

    let's say we want to log in users as soon as they are registered, thus we need to provide the jwt key when a user is successfully registered.
    There are two ways to give the jwt key back to the client. One way is to send as a key value pair in the response object. Second way 
    is to provide the jwt key as the header to the response. Second way is better as returning as a property inside a user object is
    not a good approach as the jwt is not a user property

    we can give a new header by using the header method on the response object

        res.header()

    This takes two arguments, one is the name of the header, and second is the value of this header. Usually,'x-' is prefixed to the header name to 
    indicate that this is a custom header, so in the register post function

        router.post('/', async (req, res) => {

            const {error} = validate(req.body)
            if(error) return res.status(400).send(error.details[0].message)

            let user = await User.findOne({email: req.body.email})
            if (user) return res.status(400).send('User already registered')

            user = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })

            await user.save()
            
            const token = jwt.sign({_id: user.id}, 'jwtPrivateKey')

            return res
                .header('x-auth-token', token)
                .send(_.pick(user, ['_id', 'name', 'email']))

        })

   
Encapsulating logic inside mongoose models

    Since token is generated in multiple locations, we don't wanna repeat our code. If we ever wanted to add more user properties inside the payload, 
    we need to do at multiple locations. We can create a function and export that wil make our code at one place. But where to place this function ?
    auth or users? Moreover the generation of token is entirely dependent on the user object. In OOP, we have a principle known as 
    'Information Expert Principle'. This means that an object that has enough information and is an expert in a given area, that object should be 
    responsible for making decisions and performing tasks. For eg. the act of cooking is the done by a chef and not by a waiter.


    This essentially means that the User model is responsible for generating tokens, thus we need to add this inside the user model. This is done by
    adding methods to the userSchema object using userSchema.methods.<new method name> and defining it as

        const userSchema = new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minLength: 3,
                maxLength: 255
            },
            email: {
                type: String,
                required: true,
                unique: true,
                maxLength: 255,
                minLength: 5
            },
            password: {
                type: String,
                required: true,
                maxLength: 1024,
                minLength: 5
            }
        })

        userSchema.methods.generateAuthToken = function () {
            const token = jwt.sign({_id: this._id}, 'jwtPrivateKey')
        }

    and then creating the User model

        const User = mongoose.model('User', userSchema)

    we can call this function anywhere using

        const user = new User({

            name: req.body.name,
            email: req.body.email,
            password: req.body.password

        })
        
        const token = user.generateAuthToken();

    and now we can send this as a header in response

        router.post('/', async (req, res) => {

            const {error} = validate(req.body)
            if(error) return res.status(400).send(error.details[0].message)

            let user = await User.findOne({email: req.body.email})
            if (user) return res.status(400).send('User already registered')

            user = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })

            await user.save()
            
            const token = user.generateAuthToken()

            return res
                .header('x-auth-token', token)
                .send(_.pick(user, ['_id', 'name', 'email']))

        })


Authorization Middleware

    To check we if the user is logged in or not, we need to check if the jwt is provided with the request or not. So we need to add something like this

        const token = req.header('x-auth-token');
        if(!token) return res.status(401).send('Access Denied, No Token Provided')

    But we need to add this in every route we have and we wish to perform with authenticated users. To prevent this, we can create a middleware and 
    add that middleware to the routes function to get called before executing the route. So we create a middleware something like this

        function authMiddleware(req, res, next) {
            
            const token = req.header('x-auth-token');
            if(!token) return res.status(401).send('Access Denied, No Token Provided')

        }
    
    If there is a token, we need to verify the token if this token is a valid token

        function authMiddleware(req, res, next) {
            
            const token = req.header('x-auth-token');
            if(!token) return res.status(401).send('Access Denied, No Token Provided')

            const decoded = jwt.verify(token, 'jwtPrivateKey')

        }

    If the token provided is not a valid token, it will throw an error and thus we need to wrap this in a try catch block

        
        function authMiddleware(req, res, next) {
            
            const token = req.header('x-auth-token');
            if(!token) return res.status(401).send('Access Denied, No Token Provided')
            
            try {
                const decoded = jwt.verify(token, 'jwtPrivateKey')
            }

            catch (ex) {
                res.status(400).send('Invalid Token Provided')
            }
            
        }

    we can optionally send this the decoded object inside the req for the next middleware function

        function authMiddleware(req, res, next) {
            
            const token = req.header('x-auth-token');
            if(!token) return res.status(401).send('Access Denied, No Token Provided')
            
            try {
                const decoded = jwt.verify(token, 'jwtPrivateKey')
                req.user = decoded
            }

            catch (ex) {
                res.status(400).send('Invalid Token Provided')
            }
            
        }
        
    we need to pass control to the next middleware function, thus we use next() in the try block
        
        function authMiddleware(req, res, next) {
            
            const token = req.header('x-auth-token');
            if(!token) return res.status(401).send('Access Denied, No Token Provided')
            
            try {
                const decoded = jwt.verify(token, 'jwtPrivateKey')
                req.user = decoded
                next()
            }

            catch (ex) {
                res.status(400).send('Invalid Token Provided')
            }
            
        }

    and now we can export this function and use it in a route function like

        const auth = require('/path/to/auth/middleware') 
    
    and we can use this middleware in route before executing this middleware function( a route handler in this case )
    
        router.post('/', auth, async (req, res) => {
                
            // task

        })


    we can pass multiple middlewares before the route handler by passing the array of middlewares as the second argument

        router.post('/', [mid1, mid2, ...], async (req, res) => {
                
            // task

        })    


    since we passed a user object in the request object in the auth middleware, we can access the user object in this route handler,
    so we can have a route like /api/me where we can display the user

        router.get('/me', auth, async (req, res) => {
            const user = await User.findOne({_id: req.user._id})
            res.send(user)
        })


Logging out Users

    We need to implement the logging out a user on the client not on the server. Implementing logging out simply means that we have to delete the
    json web token from the local storage of the browser. This will result in requests without a 'x-auth-token' header and thus client will be
    responded with access denied. To get this token, user have to simply re - login into the app


Role based Authorization

    if we want that only admins can delete a data, first we need to have a property called something like isAdmin in the userSchema. 

        const userSchema = new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minLength: 3,
                maxLength: 255
            },
            email: {
                type: String,
                required: true,
                unique: true,
                maxLength: 255,
                minLength: 5
            },
            password: {
                type: String,
                required: true,
                maxLength: 1024,
                minLength: 5
            },
            isAdmin: Boolean
        })

    we don't anyone to set this property when registering as user, a user can be created admin by manually making him/her admin in the database, or in 
    real-world, by a super-admin

    First we need to change the jwt to have isAdmin property as well in its payload so back to generateAuthToken function

        userSchema.methods.generateAuthToken = function () {
            const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, 'jwtPrivateKey')
        }

    Before adminMiddleware, we will be using the authMiddleware to check the user if its logged in or not, if its logged in then we can check if the user 
    is admin or not. Since in authMiddleware we passed the user object in the request, we can use it to check if the user has a property of isAdmin. First 
    we need to change the jwt to have isAdmin property as well in its payload so back to generateAuthToken function

        userSchema.methods.generateAuthToken = function () {
            const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, 'jwtPrivateKey')
        }

    now we can create a new middleware that checks if a user has a property isAdmin and is set to true

        function adminMiddleware (req, res, next) {
            
            if(!req.user.isAdmin) return res.status(403).send('Action Forbidden')
            next()
        }

    now in the delete route handlers, we can pass this middleware after the auth middleware by

        router.delete('/', [auth, admin], (req, res) => {

            // Task

        })



*/
