/*

Introduction

    Unit tests are easy to write, fast to execute and they are ideal to test the functions that have zero to minimal dependencies 
    on the external resources. But in real world, a function might depend on multiple external resources, this is when we use 
    Integration Tests. Integration tests helps us to test our application code with these external resources

    So, in order to tests the application, we need a real database which will be different from the original but same in terms of
    its structure. Everytime we do run our test, it should populate the database, send an http request and then we will verify
    the action by reading the database and after all this we must clear our database to make it ready for next test

Setting up the db

    We don't want this database to be same as the development or the production database because in these tests, we are going to 
    add or remove documents from the database, and we don't want to mess up the main database. In order to setup a test database,
    we are going to use the 'config' npm library. Now in the 'default.json' in the configs folder, add a new key called 'db' and
    value as the address of main database

        {
            "db": "mongodb://localhost/vidly"
        }

    Now in the 'test.json' file, change the connection string to

        {
            "db": "mongodb://localhost/vidly_test"
        }     

    and now wherever we have used this database connection string, change it from its value to config.get('db')

        const db = config.get('db')    
        await mongoose.connect(db)
        console.log(`connected to ${db}....`)

    Now when we run our test, we can see that the connected database is the vidly_test

 
Writing Integration Test

    For writing integration tests, we need to install an npm library called 'supertest' with which we can send http request just 
    like we send requests using postman. Install supertest as a development dependency using

        npm i supertest --save-dev

    Now this supertest, requires an object called 'server' that is returned when we call app.listen() in index.js. We should 
    export this server object so that we can load this in our test file

        const server = app.listen(port, () => console.log('Listening on port ${port}...`))
        module.exports = server;

    In our tests folder, we can have a folder called integration in which we can include all the integration tests in it. In our test 
    file, include 'supertest' and store in a constant called 'request' (convention)

        const request = require('supertest')

    We can include the server object at the top but as soon as we rerun our tests, we will get an exception that port is busy right now,
    because it needs to be closed before running the tests. So in jest, we have couple of utility functions like beforeEach and afterEach.
    First we need to create a describe block with name /api/genres as we are working with genre routes only in this file.

        describe('api/genres', () => {
        })

    inside this block we can have another describe block for all the GET related tests along with the beforeEach and afterEach for starting
    and closing the server

        let server
        describe('api/genres', () => {
            beforeEach(() => { server = require('path/to/index.js')})
            afterEach(() => { server.close() })

            describe('GET', () => { 

            })
        })

    Now we can add all our tests related to GET inside this. We use the request object with server object as an argument. This request object has
    bunch of methods, like get, post, put, delete which we can use. These methods take the endpoint as the argument. This returns a promise which 
    we can await. After awaiting this object we get the response object

        let server
        describe('api/genres', () => {
            beforeEach(() => { server = require('path/to/index.js')})
            afterEach(() => { server.close() })

            describe('GET /', () => { 
                it('should return all the genres', async () => {
                    const res = await request(server).get('/api/genres')
                    expect(res.status).toBe(200)
                })
            })
        })
        
    On running this test in the terminal, we can see that our test is passing

        PASS  Documentation/13-Integration_Testing/integration.test.js
        api/genres
            GET /
            √ should return all the genres (1982 ms)

        console.log
            Listening on port: 3000

            at Server.<anonymous> (index.js:16:10)

        console.log
            Connected to mongodb://localhost/test

            at connectDB (startup/db.js:7:29)

        GET /api/genres 200 2 - 64.962 ms
        Test Suites: 1 passed, 1 total
        Tests:       1 passed, 1 total
        Snapshots:   0 total
        Time:        2.698 s, estimated 3 s
        
Populating the Test Database

    The test we wrote above is too generic, we don't know what we received in the response. For this, we can pre populate the database with a set 
    of genres, which later we can expect in the response. So first we need to import the Genre model.
        
        const { Genre } = require('/path/to/genre/model')

    we have a property called collection which has a method called insertMany which we can use to insert multiple documents to the test database.
    This returns a promise which we have to await. Now we can expect our response to have a length of 3

        let server
        describe('api/genres', () => {
            beforeEach(() => { server = require('path/to/index.js')})
            afterEach(() => { server.close() })

            describe('GET /', () => { 
                it('should return all the genres', async () => {
                    await Genre.collection.insertMany([
                        { name: 'genre1' },
                        { name: 'genre2' },
                        { name: 'genre3' },
                    ])

                    const res = await request(server).get('/api/genres')
                    expect(res.status).toBe(200)
                    expect(res.body.length).toBe(3)

                })
            })
        })

    Now if we run our test, we will see that tests are successful.

        PASS  Documentation/13-Integration_Testing/integration.test.js
        api/genres
            GET /
            √ should return all the genres (871 ms)

        Test Suites: 1 passed, 1 total
        Tests:       1 passed, 1 total
        Snapshots:   0 total
        Time:        2.219 s, estimated 3 s

    But if we run this test again, we will se the test is failed.
        
        FAIL  Documentation/13-Integration_Testing/integration.test.js
        api/genres
            GET /
            × should return all the genres (828 ms)

        ● api/genres › GET / › should return all the genres

            expect(received).toBe(expected) // Object.is equality

            Expected: 3
            Received: 6

            21 |                      const res = await request(server).get('/api/genres');
            22 |                      expect(res.status).toBe(200);
          > 23 |                      expect(res.body.length).toBe(3);
               |                                              ^
            24 |              });
            25 |      });
            26 | });

            at Object.<anonymous> (Documentation/13-Integration_Testing/integration.test.js:23:28)

        Test Suites: 1 failed, 1 total
        Tests:       1 failed, 1 total
        Snapshots:   0 total
        Time:        2.142 s, estimated 3 s


    This is because we populated the Genre collection with three more documents and didn't clear old documents before. We can clear the collection 
    using Genre.remove({}). The proper place for this cleanup code is in afterEach function


        let server
        describe('api/genres', () => {

            beforeEach(() => { server = require('path/to/index.js')})
            afterEach(async() => { 
                server.close(); 
                await Genre.remove({})
            })

            describe('GET /', () => { 
                it('should return all the genres', async () => {
                    await Genre.collection.insertMany([
                        { name: 'genre1' },
                        { name: 'genre2' },
                        { name: 'genre3' },
                    ])

                    const res = await request(server).get('/api/genres')
                    expect(res.status).toBe(200)
                    expect(res.body.length).toBe(3)

                })
            })
        })


    Now are test is passing again. We can also expect this array to have objects with name genre1, genre2 and so on using the find method

        let server
        describe('api/genres', () => {

            beforeEach(() => { server = require('path/to/index.js')})
            afterEach(async() => { 
                server.close(); 
                await Genre.remove({})
            })

            describe('GET /', () => { 
                it('should return all the genres', async () => {
                    await Genre.collection.insertMany([
                        { name: 'genre1' },
                        { name: 'genre2' },
                        { name: 'genre3' },
                    ])

                    const res = await request(server).get('/api/genres')
                    expect(res.status).toBe(200)
                    expect(res.body.length).toBe(3)
                    expect(res.body.find((g) => g.name === 'genre1')).toBeTruthy()
                    expect(res.body.find((g) => g.name === 'genre2')).toBeTruthy()
                    expect(res.body.find((g) => g.name === 'genre3')).toBeTruthy()

                })
            })
        })


Testing Routes with parameters

    In order to test routes with parameters, like for api/genres/id we need to change the endpoint of the request function. So we create a 
    new describe block inside the 'genre' describe block. Here we should have two test as there are two execution paths in this genre route.
    We can create a new genre object and save it in the database and we can then send a request to get this genre, and then use toMatchObject
    to verify the document


        let server
        describe('api/genres', () => {

            beforeEach(() => { server = require('path/to/index.js')})
            afterEach(async() => { 
                server.close(); 
                await Genre.remove({})
            })

            describe('GET /', () => { 
                it('should return all the genres', async () => {...})
            })

            describe('GET /:id', () => {
                it('should return a genre if valid id is passed', async () => {
                    const genre = new Genre({name: 'genre1'})
                    await genre.save()
                    const res = await request(server).get(`/api/genres/${genre.id}`)
                    expect(res.body).toMatchObject(genre)
                })
            })
        })

    But as soon as we run the test, we should see that the test is failed.

        FAIL  Documentation/13-Integration_Testing/integration.test.js
        api/genres
            GET /
            √ should return all the genres (889 ms)
            GET /:id
            × should return a genre if valid id is passed (38 ms)

        ● api/genres › GET /:id › should return a genre if valid id is passed

            expect(received).toMatchObject(expected)

            Compared values serialize to the same structure.
            Printing internal object structure without calling `toJSON` instead.

            - Expected  - 96
            + Received  +  2

                "__v": 0,
            -     "_id": ObjectID {
            -       "_bsontype": "ObjectID",
            -       "id": Buffer [
            -         94,
            -         207,
            -         230,
            -         212,
            -         250,
            -         251,
            -         32,
            -         42,
            -         188,
            -         125,
            -         174,
            -         170,
            -       ],
            -     },
            +   "_id": "5ecfe6d4fafb202abc7daeaa",

            32 |                      await genre.save();
            33 |                      const res = await request(server).get(`/api/genres/${genre.id}`);
          > 34 |                      expect(res.body).toMatchObject(genre);
               |                                       ^
            35 |              });
            36 |      });
            37 | });

            at Object.<anonymous> (Documentation/13-Integration_Testing/integration.test.js:34:21)
                at runMicrotasks (<anonymous>)

        Test Suites: 1 failed, 1 total
        Tests:       1 failed, 1 passed, 2 total
        Snapshots:   0 total
        Time:        2.229 s, estimated 3 s

    Here we can see that the id property is causing the test to fail. This is because when we create a new genre using the Genre model, the id is 
    of the the type 'ObjectId'. But when we read this id from database using the GET request, it is of the type of 'string'. So we can change
    our expect to check for the name property rather than matching with the whole object

        let server
        describe('api/genres', () => {

            beforeEach(() => { server = require('path/to/index.js')})
            afterEach(async() => { 
                server.close(); 
                await Genre.remove({})
            })

            describe('GET /', () => { 
                it('should return all the genres', async () => {...})
            })

            describe('GET /:id', () => {
                it('should return a genre if valid id is passed', async () => {
                    const genre = new Genre({name: 'genre1'})
                    await genre.save()
                    const res = await request(server).get(`/api/genres/${genre.id}`)
                    expect(res.body).toHaveProperty('name', 'genre1')
                })
            })
        })

    And we can see our tests are passing, we also need to add one more test for the second execution path

        let server
        describe('api/genres', () => {

            beforeEach(() => { server = require('path/to/index.js')})
            afterEach(async() => { 
                server.close(); 
                await Genre.remove({})
            })

            describe('GET /', () => { 
                it('should return all the genres', async () => {...})
            })

            describe('GET /:id', () => {
                it('should return a genre if valid id is passed', async () => {...})
                it('should return 404 if invalid id is passed', async () => {
                    const res = await request(server).get(`/api/genres/1`)
                    expect(res.status).toBe(404)
                })
            })
        })
        
    on running the tests, you might see that the tests are failing

        FAIL  Documentation/13-Integration_Testing/integration.test.js
        api/genres
            GET /
            √ should return all the genres (849 ms)
            GET /:id
            √ should return a genre if valid id is passed (29 ms)
            × should return 404 if invalid id is passed (32 ms)

        ● api/genres › GET /:id › should return 404 if invalid id is passed

            expect(received).toBe(expected) // Object.is equality

            Expected: 404
            Received: 500

            36 |              it('should return 404 if invalid id is passed', async () => {
            37 |                      const res = await request(server).get(`/api/genres/1`);
          > 38 |                      expect(res.status).toBe(404);
               |                                         ^
            39 |              });
            40 |      });
            41 | });

            at Object.<anonymous> (Documentation/13-Integration_Testing/integration.test.js:38:23)

        Test Suites: 1 failed, 1 total
        Tests:       1 failed, 2 passed, 3 total
        Snapshots:   0 total
        Time:        2.176 s, estimated 3 s

    This is because we didn't provided a valid ObjectId, which gave internal server error because 1 is not a valid ObjectId. This can be solved by 
    checking the requested id to be a valid ObjectId, otherwise return 404 error. Since this is required in many other routes as well, writing this
    code as a middleware is a better option. After doing this in the file, we should see all our tests passing
        
        PASS  Documentation/13-Integration_Testing/integration.test.js
        api/genres
            GET /
            √ should return all the genres (947 ms)
            GET /:id
            √ should return a genre if valid id is passed (55 ms)
            √ should return 404 if invalid id is passed (63 ms)

        Test Suites: 1 passed, 1 total
        Tests:       3 passed, 3 total
        Snapshots:   0 total
        Time:        2.503 s, estimated 3 s
                        

Testing the Authorization

    For testing the route handler that is used to create a new genre

        router.post('/', auth, async (req, res) => {

            const { error } = validate(req.body);
            if(error) return res.status(400).send(error.details[0].message)

            let genre = new Genre({
                name: req.body.name,
            });
            genre = await genre.save();

            res.send(genre);
        });

    Since the number of tests should be equal to or greater than the number of execution paths, we have 3 execution paths here. This first execution path
    is the validate req.body and if it is invalid, we return 400 error. Second execution path is the if the body is valid, we save the result in the 
    database and send it as a response. In this execution path we need to have 2 tests as we should check the database as well as the response object. 
    And third is the auth middleware that returns an 401 error if no token is provided( client is not logged id).

        describe('POST /', () => {

            it('should return 401 if the client is not logged in', async () => {
                
                const res = await request(server)
				    .post('/api/genres')
				    .send({ name: 'genre1' });

                expect(res.status).toBe(401)
            })
        }) 

    When we run our tests, we should see all tests passing
        
        PASS  Documentation/13-Integration_Testing/integration.test.js
        api/genres
            GET /
            √ should return all the genres (812 ms)
            GET /:id
            √ should return a genre if valid id is passed (34 ms)
            √ should return 404 if invalid id is passed (11 ms)
            POST /
            √ should return 401 if the client is not logged in (12 ms)

        Test Suites: 1 passed, 1 total
        Tests:       4 passed, 4 total
        Snapshots:   0 total
        Time:        2.176 s, estimated 3 s

    Now for the second test, we have to assume the user has logged in , but the client sent an invalid genre. From our validate method, we can see we are 
    checking the genre for min length and max length, thus we need two tests. First we need to create a new token and we can create using the 
    'generateAuthToken' method we added in the user model. We need to pass this token as a header named 'x-auth-token', we can do this using the set method.

		it('should return 400 if the genre is less than 5 characters', async () => {
			const token = new User().generateToken();

			const res = await request(server)
				.post('/api/genres')
				.set('x-auth-token', token)
				.send({ name: '123' });

			expect(res.status).toBe(400);
        });

    Now if we run our test, we should see all are tests are passing. Now for the second test of this validate, genre should be less than 50 characters. We can use
    join method on the Array

        new Array(51).join('a')

    Since this method joins the empty array using 'a' in between. The above code will print a long string of a of length 50, since we want more than 50, we can use
    array of length 52

        it('should return 400 if the genre is less than 5 characters', async () => {
			const token = new User().generateToken();

			const res = await request(server)
				.post('/api/genres')
				.set('x-auth-token', token)
				.send({ name: new Array(52).join('a') });

			expect(res.status).toBe(400);
        });

    Back to the terminal, we can see all our tests are passing

        PASS  Documentation/13-Integration_Testing/integration.test.js
        api/genres
            GET /
            √ should return all the genres (813 ms)
            GET /:id
            √ should return a genre if valid id is passed (31 ms)
            √ should return 404 if invalid id is passed (14 ms)
            POST /
            √ should return 401 if the client is not logged in (29 ms)
            √ should return 400 if the genre is less than 5 characters (17 ms)
            √ should return 400 if the genre is less than 5 characters (12 ms)

        Test Suites: 1 passed, 1 total
        Tests:       6 passed, 6 total
        Snapshots:   0 total
        Time:        2.228 s, estimated 3 s
    
Testing the happy Path

    For the last execution path, we have two tests, first checking the database and then checking the response object if it has the genre object

		it('should save genre if it is valid', async () => {
			const token = new User().generateToken();

			const res = await request(server)
				.post('/api/genres')
				.set('x-auth-token', token)
				.send({ name: 'genre1' });

			expect(res.status).toBe(200);

			const genre = await Genre.findOne({ name: 'genre1' });
			expect(genre).not.toBe(null);
        });
        
        it('should return the genre if it is valid', async () => {
			const token = new User().generateToken();

			const res = await request(server)
				.post('/api/genres')
				.set('x-auth-token', token)
				.send({ name: 'genre1' });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', 'genre1')
		});
    
    In the terminal, on running these tests, we can see that all our tests are passing

        PASS  Documentation/13-Integration_Testing/integration.test.js
        api/genres
            GET /
            √ should return all the genres (742 ms)
            GET /:id
            √ should return a genre if valid id is passed (28 ms)
            √ should return 404 if invalid id is passed (12 ms)
            POST /
            √ should return 401 if the client is not logged in (24 ms)
            √ should return 400 if the genre is less than 5 characters (17 ms)
            √ should return 400 if the genre is less than 5 characters (12 ms)
            √ should save genre if it is valid (19 ms)
            √ should return the genre if it is valid (17 ms)

        Test Suites: 1 passed, 1 total
        Tests:       8 passed, 8 total
        Snapshots:   0 total
        Time:        2.246 s, estimated 3 s

    
Writing Clean Tests
    
    Writing clean tests makes it way easier to understand for the end user. In all these above tests, we can see that request() code is repeated 
    everytime with one different property. Also the token definition is repetitive in all theses tests. There is a technique to refractor these 
    tests and make it way cleaner.

        Inside the describe block, we define the happy path and then in each test we change one parameter that clearly aligns with the name of
        test

    In this case, happy path is it should save the genre if the genre is valid. So we define a function that has the happy path code in the 
    describe block

        const exec = () => {
            return request(server)
				.post('/api/genres')
				.set('x-auth-token', token)
				.send({ name: 'genre1' });
        }

    we don't need to add await here as we can async-await this function during its call. We also need a token in our happy path. So we can declare the
    variable and generate it inside the beforeEach method

        let token;

        const exec = () => {
            return request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: 'genre1' });
        }

        beforeEach(() => {
            token = new User().generateToken();
        })

    Now in our happy path we can remove all the excess code and call this function

        it('should save genre if it is valid', async () => {

			await exec();

			const genre = await Genre.findOne({ name: 'genre1' });
			expect(genre).not.toBe(null);
        });

    Now for the rest of the tests, we can modify one value as we need in the tests, for eg. in first test, it should return 401 if the client is not 
    logged in, so we can reset the token to '' inside the test
        
        it('should return 401 if the client is not logged in', async () => {
            
            token = '';
            const res = await exec();

            expect(res.status).toBe(401)
        })
    
    Similarly, we can change values of genre name, by setting it to a variable and setting its value in beforeEach and changing later if required

        let token;
        let name;

        const exec = () => {
            return request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });
        }

        beforeEach(() => {
            token = new User().generateToken();\
            name = 'genre1'
        })

    and change name in tests

        it('should return 400 if the genre is less than 5 characters', async () => {
            
            name = '123';
			const res = await exec();

			expect(res.status).toBe(400);
        });
    
    Similarly it can be done for the other test that gives 400 if genre is more than 50 characters. Now for the last test that is it returns the genre if 
    genre is valid

        it('should return the genre if it is valid', async () => {
	
			const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', 'genre1')
        });
        
    Writing tests like these makes these tests way cleaner and easier to understand.       


Auth Middleware

    In the Auth middleware, there is lot more to test than just returning 401 to the client

        function auth(req, res, next) {
            const token = req.header('x-auth-token');
            if(!token) return res.status(401).send('Access Denied, no token provided....')

            try{
                const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
                req.user = decoded;
                next();
            }
            catch(ex) {
                res.status(400).send('Invalid token provided...')
            }
        }

    We need to verify if the token is valid or not etc, this can be done using unit testing easily. The first execution path has already been tested 
    in the genre test so our First test will be if the req.user is getting populated when a token is valid. But first we need to initialize the two 
    request processing pipeline parameters that are req and res. And we also need to mock the jest function. The req argument has a function 
    called headers that returns the header when called.

        it('should populate the req.user with payload of a valid JWT', () => {
            const token = new User().generateAuthToken();
            req = {
                header: jest.fn().mockReturnValue(token),
            };
            res = {};
            next = jest.fn();
            
            auth(req, res, next);

            expect(req.user).toBeDefined();
        });

    Now since this expect is bit more generic, we need to expect a proper user object, so we create a new user and match the req.user with this object

        it('should populate the req.user with payload of a valid JWT', () => {

            const user = { _id: mongoose.Types.ObjectId(), isAdmin: true };
            const token = new User(user).generateToken();
            req = {
                header: jest.fn().mockReturnValue(token),
            };
            res = {};
            next = jest.fn();

            auth(req, res, next);;

            expect(req.user).toMatchObject(user);
        });


    But when we run our tests, we will see that our test is failing.

        FAIL  Documentation/13-Integration_Testing/auth-unit.test.js
        auth middleware
            × should populate the req.user with payload of a valid JWT (16 ms)

        ● auth middleware › should populate the req.user with payload of a valid JWT

            expect(received).toMatchObject(expected)

            Compared values serialize to the same structure.
            Printing internal object structure without calling `toJSON` instead.

            - Expected  - 17
            + Received  +  1

            Object {
            -   "_id": ObjectID {
            -     "_bsontype": "ObjectID",
            -     "id": Buffer [
            -       94,
            -       208,
            -       214,
            -       159,
            -       182,
            -       154,
            -       122,
            -       51,
            -       108,
            -       183,
            -       35,
            -       249,
            -     ],
            -   },
            +   "_id": "5ed0d69fb69a7a336cb723f9",
                "isAdmin": true,
            }

            14 |              auth(req, res, next);
            15 | 
          > 16 |              expect(req.user).toMatchObject(user);
               |                               ^
            17 |      });
            18 | });
            19 | 

            at Object.<anonymous> (Documentation/13-Integration_Testing/auth-unit.test.js:16:20)

        Test Suites: 1 failed, 1 total
        Tests:       1 failed, 1 total
        Snapshots:   0 total
        Time:        1.308 s, estimated 2 s

    This is due to the id property of the user being of type 'ObjectId' and req.user has the id of type 'String'. To solve this we can either use 
    toHaveProperty and check for rest of the properties or else we can convert the id of the user object to a hexadecimal string.

        const user = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true };


    Now we can see that our tests is passing

        PASS  Documentation/13-Integration_Testing/auth-unit.test.js
        auth middleware
            √ should populate the req.user with payload of a valid JWT (9 ms)

        Test Suites: 1 passed, 1 total
        Tests:       1 passed, 1 total
        Snapshots:   0 total
        Time:        1.268 s, estimated 2 s
            

Code Coverage

    Not only we require to write tests for our application, we also want to see how much code is covered with our tests. A code coverage tool lets us see
    the same. Jest has a code coverage tool which we can use by adding the '--coverage' flag in scripts in package.json

        "test" : "jest --watchAll --coverage"

    Now back to terminal, when we run our tests, at the end we can see how much our code is covered and what is still left to be tested

        ----------------------|---------|----------|---------|---------|-------------------
        File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
        ----------------------|---------|----------|---------|---------|-------------------
        All files             |   78.72 |       60 |   58.97 |   80.14 | 
        vidly                |     100 |      100 |     100 |     100 | 
        index.js            |     100 |      100 |     100 |     100 | 
        vidly/middleware     |   93.33 |      100 |   83.33 |   92.59 | 
        admin.js            |     100 |      100 |     100 |     100 | 
        auth.js             |     100 |      100 |     100 |     100 | 
        error.js            |      50 |      100 |       0 |      50 | 5-6
        validate.js         |     100 |      100 |     100 |     100 | 
        validateObjectId.js |     100 |      100 |     100 |     100 | 
        vidly/models         |   83.67 |      100 |      50 |   83.67 | 
        Auth.js             |   71.43 |      100 |       0 |   71.43 | 22-27
        Customer.js         |     100 |      100 |     100 |     100 | 
        Genre.js            |     100 |      100 |     100 |     100 | 
        Movie.js            |   71.43 |      100 |       0 |   71.43 | 19-25
        Rental.js           |   84.62 |      100 |   66.67 |   84.62 | 42-50
        User.js             |   83.33 |      100 |      50 |   83.33 | 41-48
        vidly/routes         |      68 |    46.15 |   43.75 |   70.71 | 
        auth.js             |   52.94 |        0 |       0 |      60 | 12-19
        customers.js        |   61.54 |      100 |       0 |   61.54 | 8-9,13-20        
        genres.js           |     100 |      100 |     100 |     100 | 
        movies.js           |   47.37 |        0 |       0 |      50 | 10-17,22-31      
        rentals.js          |      50 |        0 |       0 |   56.52 | 14-17,22-53       
        returns.js          |     100 |      100 |     100 |     100 | 
        users.js            |   45.45 |        0 |       0 |   47.62 | 12-24,30-31      
        vidly/startup        |   90.57 |       50 |      75 |   90.38 | 
        config.js           |      75 |       50 |     100 |      75 | 5
        db.js               |     100 |       50 |     100 |     100 | 7
        logging.js          |   71.43 |      100 |   33.33 |   71.43 | 24-25,28-29      
        prod.js             |     100 |      100 |     100 |     100 | 
        routes.js           |     100 |      100 |     100 |     100 | 
        validation.js       |     100 |      100 |     100 |     100 | 
        ----------------------|---------|----------|---------|---------|-------------------

        Test Suites: 9 passed, 9 total
        Tests:       72 passed, 72 total
        Snapshots:   0 total
        Time:        9.156 s

    Jest also generates an html report of the tests as well, which is located in the coverage folder that jest generates. Inside the Icov-report, 
    open the index.html to check full report. Coverage folder should be ignored by git as it can be easily generated agin using the code



*/
