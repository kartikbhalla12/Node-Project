/*

Automated Testing

    Automated Testing is a practice of writing code to test our code, and then run those tests in an automated fashion.
    With automated testing, our source consists of application code also called as production code and test code.

    For eg, we have a function that takes a number and prints positive, negative, or zero according to the number inputted.
    In manual testing, we need to run this function three times using a positive, negative number and a zero, in order to 
    verify that the program is working fine. Moreover if a function is not standalone, we need to navigate through multiple
    functions in order to reach the function, perhaps we need to login, fill the form and submit to get the result. This is 
    very time consuming, and in real-world applications, there are multiple functions that needs to be manually tested, 
    which wastes a lot of time.

    In automated testing, we directly call this function with a specific set of inputs and verify the result. Automated
    testing is repeatable, that means every time we do some changes, we run these tests again to verify if everything 
    is working normally


Benefits of Automated Testing

    Some of the benefits of using automated testing includes

        Testing our code frequently, in less time, prevents wasting of time in manual testing

        Catching bugs before deploying, these tests will fail if any feature is not working

        Deploy with confidence, it makes you sure that your code is running without any issues

        Refractor with confidence, refractoring means changing the structure of the code without changing its behaviour
        When we have automated testing, we can change some stuff in our code, we run our test and make sure that it didn't 
        break anything that used to work before

        Focus more on quality, we make sure every method works with different inputs under varying circumstances 

Types of Tests

    There are three types of tests

        Unit Tests

            Theses tests test an application without its external dependencies like files, database, web server etc.
            They are cheap to write and they execute very fast. However since we are not testing these with their 
            external dependencies, they don't give a lot of confidence in the reliability of the application.

        Integration Tests

            These tests test an application with its external dependencies. It tests the integration of your application
            with these external dependencies like database, files etc. These tests take longer to execute, because the 
            often involve reading or writing onto the database. But they give more confidence about the reliability of
            the application

        End-to-End tests

            There are some tests that test the application from it user interface. Most common tool for creating end-to-end 
            test is selenium, which records the interaction of a user with our application and then play back if our 
            application is behaving as we expected. They give the greatest confidence, but they are very slow as it 
            requires to go through all the application, and they are very brittle, as just a small enhancement to the 
            application might cause them to break.

        
Test Pyramid

    The test pyramid states that most of the tests in our application should be unit tests, but since these tests provide very less
    confidence, we should also have bunch of integration tests that tests the integration with the external dependencies. We should 
    also write a few end to end tests to test the user interface of the application. There is no hard and fast rule to follow this
    pyramid, that really depends on the application.


Tooling

    To write tests, we need a test framework that gives us a library that includes bunch of features that are required for writing tests.
    It also gives us a 'test runner', which basically is a command line tool that runs all these test and gives us a report that how many
    tests passed or failed. We will be using 'jest', which is a newer framework and is used by facebook to test applications.

    Install jest as a development dependency, since we don't want jest to be in a production bundle

        npm i jest --save-dev

    In order to run our tests, we need to add this test runner in the script. So in the package.json, under scripts, we have a property 
    called test which we can set to jest

        "scripts": {
            "test": "jest",
        }

    we also need to specify the test environment for jest, that is node
        
        "jest": {
            "testEnvironment": "node"
        },

    now we can run 'npm test' on the console to run all the tests

Writing a unit test

    So create a new folder called tests and create new test with extension .tests.js, say lib.test.js. In the file, we use a function called 
    'test' that is included in the jest. The first argument is the name of our test, this is what we will see on our console. The second
    argument is a function that is called while running the test, so when we run the test, jest will call this function
    
        test('Our first Test', () => {})

    Let's save as of now and run 'npm test' in the terminal, we can see the test name written and in green color which shows the test is 
    passing. 
        
        PASS  tests/lib.test.js
        √ Our first Test (2 ms)


        Test Suites: 1 passed, 1 total
        Tests:       1 passed, 1 total
        Snapshots:   0 total
        Time:        0.685 s
    
    
    If we have an error, it will show as the red, meaning the test failed, we check for a failed test by

        test('Our first Test', () => {
            throw new Error('error')
        })
    
    And on running 'npm test' we can see the test failed, it shows all the details that caused this error, in this case, it points to 
    line 2 which throws the error
        
        FAIL  tests/lib.test.js
        × Our first Test (2 ms)

        ● Our first Test

            error

            1 | test('Our first Test', () => {
          > 2 |       throw new Error('error');
              |             ^
            3 | });
            4 | 

            at Object.<anonymous> (tests/lib.test.js:2:8)
      

        Test Suites: 1 failed, 1 total
        Tests:       1 failed, 1 total
        Snapshots:   0 total
        Time:        0.599 s, estimated 1 s


Testing Numbers

    Now suppose we have a function, that takes a number and returns its absolute value

        module.exports.absolute = (number) => {
            
            if(number>0) return number;
            if(number<0) return -number;
            return 0;
        }

    In order to test this function, we have to include this function in our test file. so,
    
        const absolute = require('/path/to/absolute/module')

    now we need multiple tests for this function. Technically, we need to have tests greater than or equal to the number of execution paths 
    of the function. In this function we have three execution paths, 

        if the number is positive, first line will be executed and then exit
        if the number is negative, second line will be executed and then exit
        if the number is zero, third line will be executed and then exit

    Thus we need to have minimum of three tests. In these tests, we need to use the most obvious value that we can use, for eg 1 for positive 
    and -1 for negative etc. After importing the module we can make the tests as

        test('absolute - should return a positive number if the input is positive', () => {
            const result = absolute(1);
        })

    we need to verify this result with the expected result, fot that jest has a function called 'expect' which takes the result and then call
    another function 'toBe' that takes the expected value. Thi function is called a 'matcher function' and there are different matcher functions

        test('absolute - should return a positive number if the input is positive', () => {
            const result = absolute(1);
            expect(result).toBe(1);
        })       

    Now when we run this test in console using npm start, we can see that this is passing

        PASS  tests/lib.test.js
        √ absolute - should return a positive number if the input is positive (3 ms)
        

        Test Suites: 1 passed, 1 total
        Tests:       1 passed, 1 total
        Snapshots:   0 total
        Time:        0.533 s, estimated 1 s


    The different jest matcher functions are listed on: https://jestjs.io/docs/en/using-matchers
    
    this was the first test, we need to add two more tests for this function. so,
        
        test('absolute - should return a positive number if the input is negative', () => {
            const result = absolute(-1);
            expect(result).toBe(1);
        }) 
        
        test('absolute - should return a 0 if the input is 0', () => {
            const result = absolute(0);
            expect(result).toBe(0);
        }) 


    Now on running all these three tests, we can see that all these tests are passing

        PASS  tests/lib.test.js
        √ absolute - should return a positive number if the input is positive (3 ms)
        √ absolute - should return a positive number if the input is negative (1 ms)
        √ absolute - should return a 0 if the input is 0

    
        Test Suites: 1 passed, 1 total
        Tests:       3 passed, 3 total
        Snapshots:   0 total
        Time:        0.555 s, estimated 1 s

        
Grouping Tests

    As we write more tests, it becomes critical to organize these tests, so they are clean and maintainable. Tests are 'first-class' citizens in 
    our source code. They should be grouped together if they are for a function, so that they are easily accessible and maintainable. In jest 
    we have a function called 'describe', that is used for grouping tests, it takes first argument as the name of the group and second 
    argument as a function where we place all our tests. Additionally we can remove the function name from test as it will be already 
    mentioned in the describe block

        describe('absolute', () => {

            test('should return a positive number if the input is positive', () => {
                const result = absolute(1);
                expect(result).toBe(1);
            }) 

            test('should return a positive number if the input is negative', () => {
                const result = absolute(-1);
                expect(result).toBe(1);
            }) 
        
            test('should return a 0 if the input is 0', () => {
                const result = absolute(0);
                expect(result).toBe(0);
            }) 
        })

    On running these tests again, we can see these all tests are passing and are now inside a group called absolute

        PASS  tests/lib.test.js
        absolute
            √ should return a positive number if the input is positive (2 ms)
            √ should return a positive number if the input is negative
            √ should return a 0 if the input is 0 (1 ms)

        
        Test Suites: 1 passed, 1 total
        Tests:       3 passed, 3 total
        Snapshots:   0 total
        Time:        0.515 s, estimated 1 s
                

    also we have a function in jest called 'it' which is same as test and should be used to make our code more readable
        
        describe('absolute', () => {

            it('should return a positive number if the input is positive', () => {
                const result = absolute(1);
                expect(result).toBe(1);
            }) 

            it('should return a positive number if the input is negative', () => {
                const result = absolute(-1);
                expect(result).toBe(1);
            }) 
        
            it('should return a 0 if the input is 0', () => {
                const result = absolute(0);
                expect(result).toBe(0);
            }) 
        })
        

Refractoring with confidence

    These tests helps us to get gain confidence while refractoring, in our function absolute,

        module.exports.absolute = (number) => {
            if(number>0) return number;
            if(number<0) return -number;
            return 0;
        }

    we can change 'number > 0' with 'number >= 0' and remove the last return statement, this also means that we don't need the second if 
    statement anymore

        module.exports.absolute = (number) => {
            if(number>=0) return number;
            return -number;
        }      

    run npm test and,

        PASS  tests/lib.test.js
        absolute
            √ should return a positive number if the input is positive (3 ms)
            √ should return a positive number if the input is negative (1 ms)
            √ should return a 0 if the input is 0 (1 ms)
         
                
        Test Suites: 1 passed, 1 total
        Tests:       3 passed, 3 total
        Snapshots:   0 total
        Time:        0.636 s, estimated 1 s

    the tests are still passing, which means that our code is working properly, thus we refractored our code successfully
    
    Also we can change this if statement with the ternary operator

        module.exports.absolute = (number) => {s
            return (number >= 0) ? number : -number;
        }   

    Now running the tests again, we can see all of them are passing , thus with the help of unit tests, we refractored our three lines of code 
    into single line


Testing Strings

    For eg, we have a function greet that returns some string, In real world, we might have a function that generates the body of an email 

        module.exports.greet = (name) => {
            return `Welcome ${name}`
        }

    Now in our test file, we should include this function using 
        
        const greet = require('/path/to/greet/module')

    Now we should create a new describe block for this function

        describe('greet', () => {
            it('should return the greeting message', ()  => {
                const result = greet('name');
                expect(result).toBe('Welcome name');
            })
        })

    On running these tests, we can see all our tests are successfully passing, which are grouped together properly

        PASS  tests/lib.test.js
        absolute
            √ should return a positive number if the input is positive (3 ms)
            √ should return a positive number if the input is negative
            √ should return a 0 if the input is 0 (1 ms)
        greet
            √ should return the greeting message (1 ms)

            
        Test Suites: 1 passed, 1 total
        Tests:       4 passed, 4 total
        Snapshots:   0 total
        Time:        0.509 s, estimated 1 s
        
    But this test is too specific and can easily break, suppose we add a simple '!' at the end

        module.exports.greet = (name) => {
            return `Welcome ${name}!`
        }

    By just this change, our test will break as it expects 'Welcome name' only

        FAIL  tests/lib.test.js
        absolute
            √ should return a positive number if the input is positive (2 ms)
            √ should return a positive number if the input is negative (1 ms)
            √ should return a 0 if the input is 0
        greet
            × should return the greeting message (3 ms)

        ● greet › should return the greeting message

            expect(received).toBe(expected) // Object.is equality

            Expected: "Welcome name"
            Received: "Welcome name!"

            27 |      it('should return the greeting message', () => {
            28 |              const result = greet('name');
            > 29 |              expect(result).toBe('Welcome name');
                |                             ^
            30 |      });
            31 | });
            32 | 

            at Object.<anonymous> (tests/lib.test.js:29:18)

        
        Test Suites: 1 failed, 1 total
        Tests:       1 failed, 3 passed, 4 total
        Snapshots:   0 total
        Time:        0.581 s, estimated 1 s

        
    Our tests should neither be too specific nor too general. For this we can use 'toMatch' matcher function, which takes a regex expression

        describe('greet', () => {
            it('should return the greeting message', ()  => {
                const result = greet('name');
                expect(result).toMatch(/name/);
            })
        })  

    Alternatively if we don't want to use regex, we can use toContain matcher function,
       
        describe('greet', () => {
            it('should return the greeting message', ()  => {
                const result = greet('name');
                expect(result).toContain('name')
            })
        })  
        
    Now we can see all our tests are passing

        PASS  tests/lib.test.js
        absolute
            √ should return a positive number if the input is positive (4 ms)
            √ should return a positive number if the input is negative
            √ should return a 0 if the input is 0 (1 ms)
        greet
            √ should return the greeting message (1 ms)
         
                
        Test Suites: 1 passed, 1 total    
        Tests:       4 passed, 4 total    
        Snapshots:   0 total
        Time:        0.61 s, estimated 1 s


Testing Arrays

    Sometimes our function may return arrays, so we have a function that simply returns three strings,

        module.exports.getCurrencies = function() {
            return ['INR', 'USD', 'EUR'];
        }
    
    To write a test for this, import this function in the test file using
    
        const getCurrencies  = require('/path/to/getCurrencies/module/')

    now we create a new describe block and write our test in it

        describe('getCurrencies', () => {
            it('should return supported currencies', () => {
                const result = getCurrencies();
                expect(result).toBeDefined();   // or expect(result).not.toBeNull();
            });
        })

    However this approach is too general, and if this returns anything that is defined, the test will get passed, so 

        describe('getCurrencies', () => {
            it('should return supported currencies', () => {
                const result = getCurrencies();
                expect(result[0]).toBe('INR');
                expect(result[1]).toBe('USD');
                expect(result[2]).toBe('EUR');
            });
        })

    However this approach is too specific with the order of the array, what if the order of the array is ['INR', 'EUR', 'USD'], 
    our test will get failed, thus we should use toContain matcher function

        describe('getCurrencies', () => {
            it('should return supported currencies', () => {
                const result = getCurrencies();
                expect(result[0]).toContain('INR');
                expect(result[1]).toContain('USD');
                expect(result[2]).toContain('EUR');
            });
        })

    The above is the proper way of testing the array, but is a little bit messy, we can use the expect matcher functions

        describe('getCurrencies', () => {
            it('should return supported currencies', () => {
                const result = getCurrencies();
                expect(result).toEqual(expect.arrayContaining(['INR', 'USD', 'EUR']));
            });
        });
        
    This tests makes sure that as long as this result includes these values, it will pass as we can see in the console on running 'npm test'

        PASS  tests/lib.test.js
        absolute
            √ should return a positive number if the input is positive (2 ms)
            √ should return a positive number if the input is negative (1 ms)
            √ should return a 0 if the input is 0 (1 ms)
        greet
            √ should return the greeting message (1 ms)
        getCurrencies
            √ should return supported currencies (2 ms)

        
        Test Suites: 1 passed, 1 total
        Tests:       5 passed, 5 total
        Snapshots:   0 total
        Time:        0.546 s, estimated 1 s


    Rest expect matcher functions are available at: https://jestjs.io/docs/en/expect


Testing Objects

    Sometimes the function we are testing returns an object, lets say we have a function called getProduct

        module.exports.getProduct = function(productId) {
            return {id: productId, price: 10};
        }

    we need to include this in our test using

        const getProduct = require('/path/to/getProduct/function')

    now we create a new describe block and write our test in it
    
        describe('getProduct', () => {

            it('should return the product with the given id', () => {
                const result = getProduct(1);
                expect(result).toBe({id: 1, price: 10})
            })
        })

    Now if we run our tests, we see that this is failing

        FAIL  tests/lib.test.js
        absolute
            √ should return a positive number if the input is positive (3 ms)
            √ should return a positive number if the input is negative (1 ms)
            √ should return a 0 if the input is 0 (3 ms)
        greet
            √ should return the greeting message
        getCurrencies
            √ should return supported currencies (1 ms)
        getProduct
            × should return the product with the given id (5 ms)

        ● getProduct › should return the product with the given id

            expect(received).toBe(expected) // Object.is equality

            If it should pass with deep equality, replace "toBe" with "toStrictEqual"

            Expected: {"id": 1, "price": 10}
            Received: serializes to the same string

            45 |      it('should return the product with the given id', () => {
            46 |              const result = getProduct(1);
          > 47 |              expect(result).toBe({ id: 1, price: 10 });
               |                             ^
            48 |      });
            49 | });
            50 | 

            at Object.<anonymous> (tests/lib.test.js:47:18)

                
        Test Suites: 1 failed, 1 total
        Tests:       1 failed, 5 passed, 6 total
        Snapshots:   0 total
        Time:        0.556 s, estimated 1 s

    A stated, the objects are compared with their reference, and the object defined earlier is not the same as object inside toBe, they both
    have different locations. Thus for objects we use toEqual which checks for object equality and not the reference
        
        describe('getProduct', () => {

            it('should return the product with the given id', () => {
                const result = getProduct(1);
                expect(result).toEqual({id: 1, price: 10})
            })
        })

    This will check for the equality and now our tests will pass

        PASS  tests/lib.test.js
        absolute
            √ should return a positive number if the input is positive (2 ms)
            √ should return a positive number if the input is negative (1 ms)
            √ should return a 0 if the input is 0
        greet
            √ should return the greeting message (1 ms)
        getCurrencies
            √ should return supported currencies (1 ms)
        getProduct
            √ should return the product with the given id (1 ms)

        
        Test Suites: 1 passed, 1 total
        Tests:       6 passed, 6 total
        Snapshots:   0 total
        Time:        0.528 s, estimated 1 s
    
    However if we an object that has many properties, but we need to check with the above two only, for that case, 'toMatchObject' function is used

        describe('getProduct', () => {

            it('should return the product with the given id', () => {
                const result = getProduct(1);
                expect(result).toMatchObject({id: 1, price: 10})
            })
        })


    Also we can check an object to have a certain property using toHaveProperty in which we pass key value pairs
        
        describe('getProduct', () => {

            it('should return the product with the given id', () => {
                const result = getProduct(1);
                expect(result).toHaveProperty('id', 1)
            })
        })
        

Testing Exceptions

    Suppose we have a function that takes a valid username and returns the user object, otherwise throws an error.

        modules.export.getUser = function (username) {
            if(!username) throw new Error('invalid username')
            return {id: new Date().getTime(), username}
        }

    So we create a new describe block and we have two execution paths, so we will have two tests. one for falsy username, and one for the happy path 
    that is correct username. Falsy values in Javascript include 
        
        null,
        NaN,
        undefined,
        '',
        0,
        false

    we need to check the username for all the above falsy values, so we can create an array of these and can call the 'forEach' method and put the expect 
    code inside it

        describe('getUser', () => {

            it('should throw an exception when username is falsy', () => {
                const args = [null, NaN, undefined, '', 0, false]
                args.forEach((arg) => {
                    const result = getUser(a);
                    expect(result).toThrow();
                })
            })
        })

    Since we are getting an exception, we can't just call it as a result, rather we will use a callback function inside expect to call getUser

        describe('getUser', () => {
            it('should throw an exception when username is falsy', () => {
                const args = [null, NaN, undefined, '', 0, false];
                args.forEach((arg) => {
                    expect(() => getUser(arg)).toThrow();
                });
            });
        });

    Now we can see, all our tests are passing,  
        
        PASS  tests/lib.test.js
        absolute
            √ should return a positive number if the input is positive (3 ms)
            √ should return a positive number if the input is negative
            √ should return a 0 if the input is 0
        greet
            √ should return the greeting message
        getCurrencies
            √ should return supported currencies (1 ms)
        getProduct
            √ should return the product with the given id (1 ms)
        getUser
            √ should throw an exception when username is falsy (5 ms)

        
        Test Suites: 1 passed, 1 total
        Tests:       7 passed, 7 total
        Snapshots:   0 total
        Time:        0.605 s, estimated 1 s

    This is for the first execution path, but we need to create another test for the second execution path or the happy path. Since we don't
    want to compare the date property, we will just ensure it has that property and is greater than 0, and has a username property with 
    the name given

        describe('getUser', () => {
            it('should throw an exception when username is falsy', () => {
                const args = [null, NaN, undefined, '', 0, false];
                args.forEach((arg) => {
                    expect(() => getUser(arg)).toThrow();
                });
            });

            it('should return a user object when username is valid', () => {
                const result = getUser('name');
                expect(result).toHaveProperty('id');
                expect(result.id).toBeGreaterThan(0);
                expect(result).toMatchObject({username: name})
            })
        });

    Now, on running the tests, we can see all our tests are passing

        PASS  tests/lib.test.js
        absolute
            √ should return a positive number if the input is positive (2 ms)
            √ should return a positive number if the input is negative (1 ms)
            √ should return a 0 if the input is 0
        greet
            √ should return the greeting message (1 ms)
        getCurrencies
            √ should return supported currencies (1 ms)
        getProduct
            √ should return the product with the given id (1 ms)
        getUser
            √ should throw an exception when username is falsy (3 ms)
            √ should return a user object when username is valid (2 ms)

        
        Test Suites: 1 passed, 1 total
        Tests:       8 passed, 8 total
        Snapshots:   0 total
        Time:        0.51 s, estimated 1 s
        

Continuously Running Tests

    Running these tests, using npm everytime is tedious. There is a way by which we can run these tests automatically whenever a something is updated.
    In the 'package.json', in the scripts section, change our test command to jest --watch-all

        "test": "jest --watch-all"

    Now as soon as any file is updated, jest will run all the tests again


Mock Functions

    In all the functions we have worked so far had no dependencies on external resources. We can also unit test functions that have external 
    dependencies, but in unit tests we don't talk with the external dependencies. So what's the point of unit tests on these functions? In 
    these tests we test the working of the function inside the application. This is done by mocking up the database or any other dependency 
    call to return a mock promise or a value. For eg. we have a function called applyDiscount in which there is a synchronous call to the 
    database 'db' (asynchronous call discussed further)

        module.exports.applyDiscount = function(order){

            const customer = db.getCustomerSync(order.customerId);
            if(customer.points > 10)
                order.totalPrice *= 0.9
        }

    Since this function talks to the database using db.getCustomerSync, we don't want to have this in a unit test. To unit test this function,
    we need to replace this db.getCustomerSync method to a fake ( or mock ) function implementation. Our mock function should get the 
    customerId as the parameter and return the customer object with a points property. This all has to be done in the test file

    So we need to call this function and starting with the describe block, we need to create a new test that should take an order object and
    updates the order object if the points are greater than 10. Thus we have two execution paths, price remains same if points are less than 10
    and price is reduced by 10% if the points are greater than 10. So, in the test file,
        
        const applyDiscount = require('/path/to/applyDiscount/function')

        describe('applyDiscount', () => {

            it('should apply 10% discount if the customer has more than 10 points', () => {
                const order = {customerId: 1, totalPrice: 10}
                applyDiscount(order);
                expect(order.totalPrice).toBe(9)
            })
        })


    But this is contacting to the external dependency, thus we need to import the db module and re-implement a mockup getCustomerSync method

        const db = require('/path/to/db/module')

    and mock the function inside the 'it' block

        describe('applyDiscount', () => {

            it('should apply 10% discount if the customer has more than 10 points', () => {
                db.getCustomerSync = function(customerId) {
                    console.log('mockup function');
                    return { id: customerId, points: 20}
                }
                const order = {customerId: 1, totalPrice: 10}
                applyDiscount(order);
                expect(order.totalPrice).toBe(9)
            })
        })

    now rather than reading from the database, the applyDiscount function is using the mockup function and in the console we can see all the tests 
    are passing and we can see the 'mockup function' has been logged on the console

        PASS  tests/lib.test.js
        absolute
            √ should return a positive number if the input is positive (2 ms)
            √ should return a positive number if the input is negative
            √ should return a 0 if the input is 0 (1 ms)
        greet
            √ should return the greeting message (1 ms)
        getCurrencies
            √ should return supported currencies (1 ms)
        getProduct
            √ should return the product with the given id (1 ms)
        getUser
            √ should throw an exception when username is falsy (5 ms)
            √ should return a user object when username is valid (1 ms)
        applyDiscount
            √ should apply 10% discount if the customer has more than 10 points (6 ms)

        console.log
            mockup function

            at Object.absolute [as getCustomerSync] (tests/lib.test.js:88:15)

        
        Test Suites: 1 passed, 1 total
        Tests:       9 passed, 9 total
        Snapshots:   0 total
        Time:        0.613 s, estimated 1 s

        
Interaction Testing

    Suppose we have a function notifyCustomer which gets the customer from database and then uses the mail dependency to send an email 
    to that customer 

        modules.export.notifyCustomer = function(order) {
            const customer = db.getCustomerSync(order.customerId)

            mail.send(customer.email, 'Your order was placed successfully')

        }

    So let's write a unit test for this function, we need to mockup the db.getCustomerSync function first

        describe('notifyCustomers', () => {

            it('should send an email to the customer', () => {
                db.getCustomerSync = function(customerId) {
                    return {email: 'a'}
                }

                notifyCustomer({customerId: 1})
            })
        })

    There is still a dependency on mail server, so let's create a mock function for it too. But what to write inside it? Since we just want 
    to confirm that mail.send function is being called, we can use a false boolean and can set it to true inside it, and can expect it 
    to be true

        describe('notifyCustomers', () => {

            it('should send an email to the customer', () => {
                db.getCustomerSync = function(customerId) {
                    return {email: 'a'}
                }

                let mailSent = false;

                mail.send = function (email, message) {
                    mailSent = true
                }

                notifyCustomer({customerId: 1})

                expect(mailSent).toBe(true)
            })
        })

    Now if we run our tests, we can see that our tests are successful.

        PASS  tests/lib.test.js
        absolute
            √ should return a positive number if the input is positive (3 ms)
            √ should return a positive number if the input is negative
            √ should return a 0 if the input is 0 (1 ms)
        greet
            √ should return the greeting message (1 ms)
        getCurrencies
            √ should return supported currencies (1 ms)
        getProduct
            √ should return the product with the given id (1 ms)
        getUser
            √ should throw an exception when username is falsy (4 ms)
            √ should return a user object when username is valid (2 ms)
        applyDiscount
            √ should apply 10% discount if the customer has more than 10 points (2 ms)
        notifyCustomers
            √ should send an email to the customer (1 ms)

        console.log
            mockup function

            at Object.absolute [as getCustomerSync] (tests/lib.test.js:97:15)

        console.log
            mockup function

            at Object.db.getCustomerSync (tests/lib.test.js:115:15)

                
        Test Suites: 1 passed, 1 total
        Tests:       10 passed, 10 total
        Snapshots:   0 total
        Time:        0.562 s, estimated 1 s

Jest Mockup Functions

    Now, while the above approach is perfectly fine, declaring a boolean and then expecting it is kind of messy, So in jest, we have a method
    for creating mock functions that is jest.fn() 

        const mockFunction = jest.fn()

    this gives a function called mockFunction which we can call using mockFunction(), but this function has no implementations. We can use
    the helper methods to program this function. For eg, if we want to return a value of 1 when this function is called, we can use

        mockFunction.mockReturnValue(1);

    so this will return a value of 1 when called. We can also program this mock function to return a promise

        mockFunction.mockResolvedValue(1) for resolved promise
        
        mockFunction.mockRejectedValue(new Error('...')) for rejected promise

    This jest mock functions make our code way simpler, by making us not write the whole implementation. For eg, for getCustomerSync we can use jest
    mock function as

        db.getCustomerSync = jest.fn().mockReturnValue({ email: 'a' })

    This is far shorter than above implementation. Now for the mail.send function, we don't need a boolean anymore as we have a matcher function for 
    these jest mock functions called 'toHaveBeenCalled'

        mail.send = jest.fn()
    
    and we can expect using

        describe('notifyCustomers', () => {

            it('should send an email to the customer', () => {
                db.getCustomerSync = jest.fn().mockReturnValue({ email: 'a' })
                mail.send = jest.fn()

                notifyCustomer({customerId: 1})

                expect(mail.send).toHaveBeenCalled()
            })
        })

    This code is far cleaner than what we had earlier. Back in the terminal, we cans ee that all our tests are passing
        
        PASS  tests/lib.test.js
        absolute
            √ should return a positive number if the input is positive (2 ms)
            √ should return a positive number if the input is negative (1 ms)
            √ should return a 0 if the input is 0 (1 ms)
        greet
            √ should return the greeting message (1 ms)
        getCurrencies
            √ should return supported currencies (2 ms)
        getProduct
            √ should return the product with the given id (1 ms)
        getUser
            √ should throw an exception when username is falsy (4 ms)
            √ should return a user object when username is valid (3 ms)
        applyDiscount
            √ should apply 10% discount if the customer has more than 10 points
        notifyCustomers
            √ should send an email to the customer (1 ms)

        
        Test Suites: 1 passed, 1 total
        Tests:       10 passed, 10 total
        Snapshots:   0 total
        Time:        0.796 s, estimated 1 s
        
    Additionally, if we want to check the arguments it was called with, we can use the toHaveBeenCalledWith matcher function and pass the arguments

        describe('notifyCustomers', () => {

            it('should send an email to the customer', () => {
                db.getCustomerSync = jest.fn().mockReturnValue({ email: 'a' })
                mail.send = jest.fn()

                notifyCustomer({customerId: 1})

                expect(mail.send).toHaveBeenCalledWith('a', '...')
            })
        })

    Since we don't want to check the exact strings , this mock function as a property called mocks which has another property called calls which lists 
    all the calls to this mock function. This is an array and we need to get the first call. Now this returns an array of arguments from which we 
    check for the first argument

        describe('notifyCustomers', () => {

            it('should send an email to the customer', () => {
                db.getCustomerSync = jest.fn().mockReturnValue({ email: 'a' })
                mail.send = jest.fn()

                notifyCustomer({customerId: 1})

                expect(mail.send.mock.calls[0][0]).toBe('a')
                expect(mail.send.mock.calls[0][1]).toMatch(/.../)
            })
        })




*/
