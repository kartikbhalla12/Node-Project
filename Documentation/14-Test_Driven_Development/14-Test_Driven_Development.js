/*  

What is Test-Driven Development?

    Test Driven Development or TDD also called Test-first is an approach to build the software. With TDD, we write the test 
    first before writing the production cade

        -> We start by writing a failing test, It will fail since we don't have any application code to make it pass. 
        -> Then we write the 'simplest' application code to make it pass. We don't have to over-engineer it.
        -> And then refractor the code if necessary.

    We repeat these steps until we build the complete application code.


Benefits of TDD

    -> Testable Source Code: Our source code will be testable right from the starting, so we don't need to do anything else.
    -> Full Coverage By Tests: Since all our application code is written using tests, all the code is covered by the tests
    -> Simpler Implementation: Using TDD, application code often results into simpler code as compared to the other approach


Implementation using TDD

    Let's implement a return movie feature, which sets the dateReturned and rentalFee on the rentals documents. One possibility
    is to implement the PUT request method on the rentals api endpoint but, we don't want the client to set the dateReturned and 
    rentalFee, or the client might accidentally update the other properties like dateOut etc. So we should create another 
    endpoint that takes customerId and movieId as a POST request sets the above properties in the rentals document. It will also
    return the updated rental document to the client. Additionally since the movie is returned, we should also increase the
    numberInStock by 1 in the movies collection


Test Cases

    We should list the all test cases that we cqn think of. This shall not be a complete list and can be updated as we move on. So
    for the return endpoint with the above description, following are the test cases that we can think of

        Return 401 if the client is not logged in
        Return 400 if customerId is not provided
        Return 400 if movieId is not provided
        Return 404 if rental not found for this customer or movie
        Return 400 if rental already processed
        Return 200 if valid request
        Set the return date
        Calculate the rentalFee
        Increase the stock
        Return the updated rental to client


Populating the Database
    
    Now before writing these tests, we need to populate the rentals collection in the beforeEach block and depopulate it in afterEach 
    block. I am assuming the rental model is created using the hybrid approach and not the references approach. Thus a new rental object
    looks like this.
    
        let rental = new Rental({ 
            customer: {
            _id: customer._id,
            name: customer.name, 
            phone: customer.phone
            },
            movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
            }
        });
    
    Additionally we need to import the server object and close it after each test. So let's create the describe block and add these functions

        describe('/api/returns', () => {
            let server, movieId, customerId, rental;

            beforeEach(async () => {
                server = require('/path/to/index/')

                customerId = mongoose.Types.ObjectId()
                movieId = mongoose.Types.ObjectId()

                rental = new Rental({
                    customer: {
                        _id: customerId,
                        name: '12345',
                        phone: 12345
                    },
                    movie: {
                        _id: movieId,
                        title: '12345',
                        dailyRentalRate: 10
                    }
                })
                await rental.save()
                
            })
            
            afterEach(async () => {
                await server.close()
                await Rental.remove({})
            })
        })

    Now to ensure everything is working, we can write a temporary test,

        it('should work', async () => {
            const result = await Rental.findOne({_id: rental._id});
            expect(result).not.toBeNull();
        })

    If this test passes, everything we have done so far is working. 
    
    
Testing The Authorization

    Now back to our test cases, first test case says that our function should return 401 if the client is not logged in. Let's tart with the test.
    For sending the request, we need to load the supertest module.

        it('should return 401 if the client is not logged in', () => { 
            const res = request(server)
                .post('/api/returns')
                .send({ customerId, movieId })

            expect(res.status).toBe(401)
        })

    Now when we run our tests, we can see our test is failing but it is returning a 404 error. This is because we haven't implemented our return endpoint
    and by default express returns 404 if the endpoint doesn't exist. So let's create this endpoint. Now how can we return the 401 if the user is not
    authorized. What is the simplest code that we can write to make our test pass. In our test, all we expect is status to be 401, so

        router.post('/', (req, res) => {

            res.status(401).send('Unauthorized')

        })

    This might sound weird at first, as we haven't really checked the json token with the authorization middleware. As we write more test cases, probably
    this code won't work anymore and then we can comeback and change it. This is the benefit of TDD, it forces you to write the code you really need and 
    you might come with a simpler approach. So when we run the test, we can see that our test is passing

    Now we write the test to ensure our function is returning 400 if the customer id is not provided. For this test, we want to make sure that the user 
    is logged in, thus we provide the authentication token with the request, we will use the GenerateAuthToken for


        it('should return 400 if the customer id is not provided', () => {
            const token = new User().generateAuthToken()

            const res = request(server)
                .post('/api/returns')
                .set('x-auth-token', token)
                .send({movieId})

            expect(res.status).toBe(400)

        })

    On running this test, we will see that our test is failing with a status code 401. This is because till now all our endpoint does in return a 401 status.
    So we add the simplest code to ensure all the tests are passing

        router.post('/', (req, res) => {

            if(!req.body.customerId) return res.status(400).send('customerId not provided')
            res.status(401).send('Unauthorized')

        })

    This will result in both of the test passing. Similarly for the movieId, the test will be

        it('should return 400 if the movie id is not provided', () => {
            const token = new User().generateAuthToken()

            const res = request(server)
                .post('/api/returns')
                .set('x-auth-token', token)
                .send({customerId})

            expect(res.status).toBe(400)

        })

    and with this we can update our code something like this
        
        router.post('/', (req, res) => {

            if(!req.body.customerId) return res.status(400).send('customerId not provided')
            if(!req.body.movieId) return res.status(400).send('movieId not provided')
            res.status(401).send('Unauthorized')

        })
    
    Back to the terminal we can see all our tests are passing.


Looking up an Object

    The next test case states that it should return 404 if rental not found for this customer or movie.

        it('should return 404 if rental not found for the give customer or movie id', () => {
            const token = new User().generateAuthToken()

            const res = request(server)
                .post('/api/returns')
                .set('x-auth-token', token)
                .send({customerId: mongoose.Types.objectId, movieId})

            expect(res.status).toBe(404)
        } )

    Now in the terminal, we can see that our newly written test is failing and now we can update the code like

        router.post('/', (req, res) => {

            if(!req.body.customerId) return res.status(400).send('customerId not provided')
            if(!req.body.movieId) return res.status(400).send('movieId not provided')

            const rental = await Rental.findOne({'customer._id': req.body.customerId, 'movie._id' :req.body.movieId})
            if(!rental) return res.status(404).send('Rental not found')

            res.status(401).send('Unauthorized')

        })     
        
    Now back to the terminal, we can see that all our tests are passing

    
Testing if Rental is already Processed

    Now for our next test case, it should return 400 if rental already processed, we write the tests something like this

        it('should return 400 if rental already processed', async () => {
            
            const token = new User().generateAuthToken()
            rental.dateReturned = new Date();
            await rental.save()

            const res = request(server)
                .post('/api/returns')
                .set('x-auth-token', token)
                .send({customerId, movieId})

            expect(res.status).toBe(400)
        } ) 

    On running this test, we can see that our test is failing and now we can write the code to make it pass  
        
        router.post('/', (req, res) => {

            if(!req.body.customerId) return res.status(400).send('customerId not provided')
            if(!req.body.movieId) return res.status(400).send('movieId not provided')

            const rental = await Rental.findOne({'customer._id': req.body.customerId, 'movie._id' :req.body.movieId})
            if(!rental) return res.status(404).send('Rental not found')

            if(rental.dateReturned) return res.status(400).send('rental Already processed')

            res.status(401).send('Unauthorized')
        })  

    On running these tests, we can see that all our tests are passing


Testing the valid request

    Now the next test case we have is for the happy path, that is it should return 200 if valid request. So we write its test by

        it('should return 200 if valid request', () => {
            
            const token = new User().generateAuthToken()

            const res = request(server)
                .post('/api/returns')
                .set('x-auth-token', token)
                .send({customerId, movieId})

            expect(res.status).toBe(200)
        }) 

    and now in our application code, we can simply return status code as 200

        router.post('/', (req, res) => {

            if(!req.body.customerId) return res.status(400).send('customerId not provided')
            if(!req.body.movieId) return res.status(400).send('movieId not provided')

            const rental = await Rental.findOne({'customer._id': req.body.customerId, 'movie._id' :req.body.movieId})
            if(!rental) return res.status(404).send('Rental not found')

            if(rental.dateReturned) return res.status(400).send('rental Already processed')

            return res.status(200).send();

            res.status(401).send('Unauthorized')
        })

    If the rental is a valid object and is not already processed, it will send the status code of 200. However now if we run our test, 
    the authorization test will fail as it will receive the status code 200 and not 401. Now is the perfect time to add the authorization
    middleware and get rid of the last line.

        router.post('/', auth, (req, res) => {

            if(!req.body.customerId) return res.status(400).send('customerId not provided')
            if(!req.body.movieId) return res.status(400).send('movieId not provided')

            const rental = await Rental.findOne({'customer._id': req.body.customerId, 'movie._id' :req.body.movieId})
            if(!rental) return res.status(404).send('Rental not found')

            if(rental.dateReturned) return res.status(400).send('rental Already processed')

            return res.status(200).send();
        })

    Now we can see all our tests to be passing again.


Testing the return date 

    Now the test case says it should set the return date for the rental document, so writing the test first,

        it('should set the dateReturned property for rental document', async () => {
            const token = new User().generateAuthToken()

            const res = request(server)
                .post('/api/returns')
                .set('x-auth-token', token)
                .send({customerId, movieId})

            const rentalInDb = await Rental.findOne({_id: rental._id})

            expect(rentalInDb.dateReturned).toBeDefined();
        })

    Now on running these tests, it will obviously fail, so we update our application code like
        
        router.post('/', auth, (req, res) => {

            if(!req.body.customerId) return res.status(400).send('customerId not provided')
            if(!req.body.movieId) return res.status(400).send('movieId not provided')

            const rental = await Rental.findOne({'customer._id': req.body.customerId, 'movie._id' :req.body.movieId})
            if(!rental) return res.status(404).send('Rental not found')

            if(rental.dateReturned) return res.status(400).send('rental Already processed')

            rental.dateReturned = new Date();
            await rental.save()

            return res.status(200).send();
        })

    The tests, we made is very generic, and if we had set dateReturned to something like 1, our test would have passed. But we don't have the
    time it was set as it has already passed. But in our tests, these actions are performed almost at the same time, so we can expect the 
    difference of these two to be less than 10s which is a worst case scenario

        it('should set the dateReturned property for rental document', async () => {
            const token = new User().generateAuthToken()

            const res = request(server)
                .post('/api/returns')
                .set('x-auth-token', token)
                .send({customerId, movieId})

            const rentalInDb = await Rental.findOne({_id: rental._id})

            const diff = new Date() - rentalInDb.dateReturned
            expect(diff).toBeLessThan(10 * 1000)
        })

    Now we can see our tests are still passing.


Calculating the rentalFee

    As the part of response, we also want to set the rentalFee in the rentals document. rentalFee is calculated as

        rentalFee = days it was out * dailyRentalRate

    We have a popular library called 'moment' for working with dates and times.

        npm i moment

    We can use this library to get date objects ahead of or back in time. First we load this module 

        const moment = require('moment')

    moment() returns the current date and we can use the add method to get the date at a certain time from now. add method takes two arguments, one the 
    number and second the value that is to be changed.

        const date = moment().add(-7, 'days')

    this will give a moment object with date 7 days before now. This is then converted to the simple date object using toDate()

        const date = moment().add(-7, 'days').toDate()

    In our tests, we can't calculate the rentalFee if the dateOut and dateReturned is of same days. So we can set the dateOut to be earlier than today and 
    can expect the fee to be those days * dailyRentalRate. So,

        it('should set the rentalFee in the rental document', async () => {
            const token = new User().generateAuthToken()

            rental.dateOut = moment().add(-7, 'days')
            await rental.save()


            const res = request(server)
                .post('/api/returns')
                .set('x-auth-token', token)
                .send({customerId, movieId})

            const rentalInDb = await Rental.findOne({_id: rental._id})

            expect(rentalInDb.rentalFee).toBe(rental.movie.dailyRentalRate * 7)
        })

    Now we can write the application code for this failing test, we can use the moment library to calculate the days that has passed

        router.post('/', auth, (req, res) => {

            if(!req.body.customerId) return res.status(400).send('customerId not provided')
            if(!req.body.movieId) return res.status(400).send('movieId not provided')

            const rental = await Rental.findOne({'customer._id': req.body.customerId, 'movie._id' :req.body.movieId})
            if(!rental) return res.status(404).send('Rental not found')

            if(rental.dateReturned) return res.status(400).send('rental Already processed')

            rental.dateReturned = new Date();
            
            const rentalDays = moment().diff(rental.dateOut, 'days') * rental.movie.dailyRentalRate
            rental.rentalFee = rentalDays

            await rental.save()

            return res.status(200).send();
        })


Increasing the Movie stock

    We also want to increase the movie stock in the movies collection as soon as the movie is returned. So we create our tests first, 
    but first we need to populate the movie collection as well with the movie document
        
        describe('/api/returns', () => {
            let server, movieId, customerId, rental, movie;

            beforeEach(async () => {
                server = require('/path/to/index/')

                customerId = mongoose.Types.ObjectId()
                movieId = mongoose.Types.ObjectId()
                
                rental = new Rental({
                    customer: {
                        _id: customerId,
                        name: '12345',
                        phone: 12345
                    },
                    movie: {
                        _id: movieId,
                        title: '12345',
                        dailyRentalRate: 10
                    }
                })
                await rental.save()

                movie = new Movie({
                    _id: movieId,
                    genre: { name: '12345' }
                    title: '12345',
                    dailyRentalRate: 10,
                    numberInStock: 10
                })
                await movie.save()
                
            })
            
            afterEach(async () => {
                await server.close()
                await Rental.remove({})
                await Movie.remove({})
            })
        })

    Now we can we create our tests to verify if the stock is increased by one 

        it('should increase the stock', () => {

            const token = new User().generateAuthToken()

            const res = request(server)
                .post('/api/returns')
                .set('x-auth-token', token)
                .send({customerId, movieId})

            const movieInDb = await Movie.findOne({_id: movie._id})
            expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1)
        })

    On running the test, we expected 11 but we received 10, this is because we haven't implemented any code to increase the stock, so to increase the stock,

        router.post('/', auth, (req, res) => {

            if(!req.body.customerId) return res.status(400).send('customerId not provided')
            if(!req.body.movieId) return res.status(400).send('movieId not provided')

            const rental = await Rental.findOne({'customer._id': req.body.customerId, 'movie._id': req.body.movieId})
            if(!rental) return res.status(404).send('Rental not found')

            if(rental.dateReturned) return res.status(400).send('rental Already processed')

            rental.dateReturned = new Date();
            
            const rentalDays = moment().diff(rental.dateOut, 'days') * rental.movie.dailyRentalRate
            rental.rentalFee = rentalDays

            await rental.save()

            await Movie.update({ _id: rental.movie._id }, { 
                $inc: { numberInStock: 1 }
            })

            return res.status(200).send();
        })


    Now we can see all are tests to be passing,


Testing the response

    As a last test case, we also want to send the updated rental object back to the client, so we write the test first

        it('should return the rentals object', async () => {
            const token = new User().generateAuthToken()

            const res = request(server)
                .post('/api/returns')
                .set('x-auth-token', token)
                .send({customerId, movieId})

            const rentalInDb = await Rental.findOne({_id: rental._id})
            expect(res.body).toMatchObject(rentalInDb)

        })


    Now we update our application code for this test,

        router.post('/', auth, (req, res) => {

            if(!req.body.customerId) return res.status(400).send('customerId not provided')
            if(!req.body.movieId) return res.status(400).send('movieId not provided')

            const rental = await Rental.findOne({'customer._id': req.body.customerId, 'movie._id': req.body.movieId})
            if(!rental) return res.status(404).send('Rental not found')

            if(rental.dateReturned) return res.status(400).send('rental Already processed')

            rental.dateReturned = new Date();
            
            const rentalDays = moment().diff(rental.dateOut, 'days') * rental.movie.dailyRentalRate
            rental.rentalFee = rentalDays

            await rental.save()

            await Movie.update({ _id: rental.movie._id }, { 
                $inc: { numberInStock: 1 }
            })

            return res.status(200).send(rental);
        })

    But when we run our tests, we will see that our test is still failing, this is because the date objects that are returned are formatted as String
    but in rentals object, they are of type Date. So we can modify our test something like

        it('should return the rentals object', async () => {
            const token = new User().generateAuthToken()

            const res = request(server)
                .post('/api/returns')
                .set('x-auth-token', token)
                .send({customerId, movieId})

            const rentalInDb = await Rental.findOne({_id: rental._id})
            expect(res.body).toHaveProperty('dateOut')
            expect(res.body).toHaveProperty('dateReturned')
            expect(res.body).toHaveProperty('rentalFee')
            expect(res.body).toHaveProperty('customer')
            expect(res.body).toHaveProperty('movie')

        })

    and we can see that our test is passing, but the above code is little bit messy and we can use the Object.keys function instead of this

        it('should return the rentals object', async () => {
            const token = new User().generateAuthToken()

            const res = request(server)
                .post('/api/returns')
                .set('x-auth-token', token)
                .send({customerId, movieId})

            const rentalInDb = await Rental.findOne({_id: rental._id})
            expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie']))

        })

        
Refractoring the validation logic

    The beauty of TDD is that all our code is covered with the tests, so if we refractor our code and break something by mistake, our tests will catch it and
    let us know. The final code we have is
        
        router.post('/', auth, (req, res) => {

            if(!req.body.customerId) return res.status(400).send('customerId not provided')
            if(!req.body.movieId) return res.status(400).send('movieId not provided')

            const rental = await Rental.findOne({'customer._id': req.body.customerId, 'movie._id': req.body.movieId})
            if(!rental) return res.status(404).send('Rental not found')

            if(rental.dateReturned) return res.status(400).send('rental Already processed')
            rental.dateReturned = new Date();           
            const rentalDays = moment().diff(rental.dateOut, 'days') * rental.movie.dailyRentalRate
            rental.rentalFee = rentalDay
            
            await rental.save()

            await Movie.update({ _id: rental.movie._id }, { 
                $inc: { numberInStock: 1 }
            })

            return res.status(200).send(rental);
        })
        

    The first two lines have no validation logic, its just checking if they are defined or not, We can use joi and joi-objectId to validate these objectIds.
    So we can create a function that validates the req.body for these objectIds

        function validateReturn(ret) {
            const schema = {
                customer: Joi.objectId().required(),
                movie: Joi.objectId().required(),
            }

            return Joi.validate(ret, schema)
        }

    and now we can call this function in our route handler
        
        router.post('/', auth, (req, res) => {

            const { error } = validateReturn(req.body)
            if(error) return res.status(400).send(error.details[0].message)

            const rental = await Rental.findOne({'customer._id': req.body.customerId, 'movie._id': req.body.movieId})
            if(!rental) return res.status(404).send('Rental not found')

            if(rental.dateReturned) return res.status(400).send('rental Already processed')
            rental.dateReturned = new Date();
            const rentalDays = moment().diff(rental.dateOut, 'days') * rental.movie.dailyRentalRate
            rental.rentalFee = rentalDays
            
            await rental.save()

            await Movie.update({ _id: rental.movie._id }, { 
                $inc: { numberInStock: 1 }
            })

            return res.status(200).send(rental);
        })
        

    Additionally, we can extract these two lines which are repeated in every route handler into a middleware function. Now when we run the tests, we can see 
    that all are tests are passing.


Mongoose Static Methods
    
    We can add static methods to the mongoose models. There are two types of methods

        -> Static methods: A Static Method is a method that is directly available to the class 
        -> Instance methods: An Instance Method is a method that is available to the instance (object) of the class.

    For eg, the generateAuthToken method we created is an instance method as it requires to create a new user first

        const token = new User().generateAuthToken

    Now, if we want 

        const rental = await Rental.findOne({'customer._id': req.body.customerId, 'movie._id': req.body.movieId})

    to be a function like 
    
        const rental = await getRental(req.body.customerId, req.body.movieId)

    We create a new function by adding our static method to the statics property of the schema object

        rentalSchema.statics.getRental = function(customerId, movieId) {
            return this.findOne({'customer._id': customerId, 'movie._id': movieId})
        }

    Now our code is updated with 

        router.post('/', auth, (req, res) => {

            const { error } = validateReturn(req.body)
            if(error) return res.status(400).send(error.details[0].message)

            const rental = await getRental(req.body.customerId, req.body.movieId)
            if(!rental) return res.status(404).send('Rental not found')

            if(rental.dateReturned) return res.status(400).send('rental Already processed')

            rental.dateReturned = new Date();
            const rentalDays = moment().diff(rental.dateOut, 'days') * rental.movie.dailyRentalRate
            rental.rentalFee = rentalDays
            
            await rental.save()

            await Movie.update({ _id: rental.movie._id }, { 
                $inc: { numberInStock: 1 }
            })

            return res.status(200).send(rental);
        })

    Now when we run our tests, we can see all our tests are passing


Refractoring the Domain Logic

    Remember Information Expert Principle? Well, if we see our route handler, it has a lot of code that is busy calculating the what should happen to the rental Object,
    this all code should be inside the rental object itself. We should have an instance method in the rental model, which sets the return date to current date and 
    set the rentalFee

    So, in the rental model,

        rentalSchema.methods.returnMovie = function() {
            this.dateReturned = new Date();

            const rentalDays = moment().diff(this.dateOut, 'days') * this.movie.dailyRentalRate
            this.rentalFee = rentalDays
        }
    
    and we can call in our code using

        rental.returnMovie()
        await rental.save()

    And now after refractoring, our code looks like
        
        router.post('/', auth, (req, res) => {

            const { error } = validateReturn(req.body)
            if(error) return res.status(400).send(error.details[0].message)

            const rental = await getRental(req.body.customerId, req.body.movieId)
            if(!rental) return res.status(404).send('Rental not found')

            if(rental.dateReturned) return res.status(400).send('rental Already processed')

            rental.returnMovie()
            await rental.save()

            await Movie.update({ _id: rental.movie._id }, { 
                $inc: { numberInStock: 1 }
            })

            return res.status(200).send(rental);
        })

    And when we run our tests, we can see that all are tests are passing.
        

Refractoring the Tests

    As we learned how to write clean tests, we can apply that technique here as well. In our tests file, we can declare variables and a function in beforeEach for
    the happy path and can change one value in each test that clearly aligns with the name of the test.

    Additionally we don't need to explicitly send 200 status to the client, express send the 200 status by default
    
        router.post('/', auth, (req, res) => {

            const { error } = validateReturn(req.body)
            if(error) return res.status(400).send(error.details[0].message)

            const rental = await getRental(req.body.customerId, req.body.movieId)
            if(!rental) return res.status(404).send('Rental not found')

            if(rental.dateReturned) return res.status(400).send('rental Already processed')

            rental.returnMovie()
            await rental.save()

            await Movie.update({ _id: rental.movie._id }, { 
                $inc: { numberInStock: 1 }
            })

            return res.send(rental);
        })

*/
