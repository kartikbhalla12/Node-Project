/* 

Intro to MongoDB

    MongoDB is a quite popular database management system and is often used with Node.js and Express.
    MongoDB is a document (or NoSQL) database which is different from traditional relational 
    databases like SQL and mySQL 

    In mongoDB we don't have the concepts of tables, schemas, views, records, columns etc. In mongoDB 
    we can simply store the JSON objects in the database. This also means when querying the data, we 
    get JSON objects which we can simply return back to the client.

    Download Link: https://www.mongodb.com/download-center/community


Connecting to MongoDB

    We need to install a node package called 'mongoose'. Mongoose gives us a simple api to work with 
    the mongoDB database. Install mongoose using,

        npm i mongoose

    and load this in the file using

        const mongoose = require('mongoose')
    
    first thing we need to do is to connect to the mongoDB database. mongoose has a method called 'connect',
    which takes one parameter that is the address of the mongoDB database. Since the database is hosted on 
    localhost, we have to provide a string as http://localhost/<database name>. lets say database name is 
    'playground'. The .connect method returns a promise, so we can await it or use the the .then method 
    to use it. Since await requires a function wrapper,

        const connectToDb = async () => {
            try {
                await mongoose.connect('http://localhost/playground')
                console.log('Connected to MongoDB')
            }
            catch (err) {
                console.log('Couldn't connect to MongoDB', err)
            }
        }
    
        connectToDb()


Schemas

    MongoDB database has different collections (similar to tables in SQL database) inside it. Inside each collection, 
    we have multiple documents (similar to rows in SQL database), For eg. we have a database called 'playground'. 
    The 'playground' database consists of multiple collections like 'users', 'courses', 'customers', etc. 
    Each collection like users, contains bunch of documents (or in this case different users) containing 
    their specific data. Each document is a container of multiple key value pairs, for eg,

        _id: 90379823,
        name: "kartik bhalla",
        email: "kartikbhalla12@gmail.com"
    
    We use a schema to define the shape of a document in a MongoDB collection. To define a schema, we create a 
    new instance of Schema class using mongoose.Schema(). Inside it, we pass an object inside which we 
    define the key-value pairs (value as their type) that we need to have in the document

        const courseSchema = new mongoose.Schema({
            name: String,
            author: String,
            tags: [ String ],
            date: Date,
            isPublished: Boolean,
        })

    If we need to provide a default value, rather than passing the type in the key directly , we pass an object with two keys.
    type and default

        const courseSchema = new mongoose.Schema({
            name: String,
            author: String,
            tags: [ String ],
            date:{ type: Date, default: Date.now },
            isPublished: Boolean,
        })

    Various types that we can use in defining schemas are,
    
        String,
        Number,
        Date,
        Buffer,
        Boolean,
        ObjectId,
        Array

Models
    
    Just like we have classes and objects, we can have a class like Course, and later use this Course class to generate instances 
    of this class like nodeCourse and then we can save that nodeCourse in the database.So to create a class like Course, we need 
    to compile the schema into a model. mongoose object has a method called 'model' which takes two arguments. First argument 
    is the singular name of the collection that this model is for (in this case model is for courses collection, thus the 
    argument is called 'Course'). The second argument is the schema that defines the shape of document in this collection,
    which is courseSchema that we defined earlier, we save this in a constant called Course (as it is a class).

        const Course = mongoose.model('Course', courseSchema)
    
    Now we can create objects using this model

        const course = new Course()

    We give an object as an argument when defining a new Course object. Inside it we give all the values to the keys that we want 
    to save in the database

        const course = new Course({
            name: "Mastering React",
            author: "Mosh Hamedani",
            tags: ['react', 'mosh', 'frontend'],
            isPublished: true,
        })
    
    date property is not required as it has a default value of the current date and time


Saving a Document

    The course object that we created has a method called 'save', which can be called to save this in the database. The save method
    is an async operation which returns a promise which we can await it.

        async function saveCourse() {
            const result = await course.save();
            console.log(result)
        }

    the save method on resolution, returns an object that has been added in the database, this contains some additional keys like 
    _id, __V and automatically sets the default value of date

        {
            _id: 5eb82b87867df80b9c29607d
            name: "Mastering React",
            author: "Mosh Hamedani",
            tags: ['react', 'mosh', 'frontend'],
            isPublished: true,
            date: 2020-05-20T16:31:03.985+00:00,
            __v: 0
        }

Querying Documents

    The Course class we defined earlier has bunch of methods to query the database.

    we can use find() method to get multiple documents from our database, if we don't pass anything inside the function, 
    we get all the documents in that collection. These all methods return Document Query Object which is kinda like a 
    promise which we can await to get the result

        async function getCourses() {
            const result = await Course.find()
            console.log(result)
        }
        
        getCourses()

    this will result in an array of all the courses in the collection

        [{
            _id: 5eb82b87867df80b9c29607d,
            name: "Mastering React",
            author: "Mosh Hamedani",
            tags: ['react', 'mosh', 'frontend'],
            isPublished: true,
            date: 2020-05-20T16:31:03.985+00:00,
            __v: 0
        },
        {
            _id: 5eb54eb8eb75243dfcfd8ff8,
            name: "The Ultimate Redux Course",
            author: "Mosh Hamedani",
            tags: ['redux', 'mosh', 'store'],
            isPublished: true,
            date: 2020-05-18T17:15:03.985+00:00,
            __v: 0
        }]

    we can also pass filters inside the find method in a form of an object

        async function getCourses() {
            const result = await Course.find({author: 'Mosh Hamedani', isPublished: true})
            console.log(result)
        }
        
        getCourses()           

    With this filter, we will only get the published courses by Mosh Hamedani.

    Since the result is a Document Query object, we can customize this query and chain multiple methods after find.
    We can apply a limit method to limit the result to some number.

        const result = await Course.find()
            .limit(10);

    We can use sort method to sort the data, in its argument, we pass an object with the key that is to be sorted, 
    with the value 1 for ascending and -1 for descending

        const result = await Course.find()
            .limit(10).
            .sort({ name: 1 });

    We can also use the select method to selectively display the properties of a document. 1 indicates that property 
    is to be included 

         const result = await Course.find()
            .limit(10).
            .sort({ name: 1 })
            .select({ name: 1, tags: 1 });       

    This will display objects with name and tags properties only

        [{
            name: "Mastering React",
            tags: ['react', 'mosh', 'frontend'],
        },
        {
            name: "The Ultimate Redux Course",
            tags: ['redux', 'mosh', 'store'],
        }]
   
        
Comparison Query Operators

    In mongoDB we have bunch of operators for comparing values. Following are the comparison operators in mongoDB

        eq  (equal)
        ne  (not equal)
        gt  (greater than)
        gte (greater than or equal to)
        lt  (less than)
        lte (less than or equal to)
        in  (in)
        nin (not in)

    Suppose we have a price property in the course object, and we need to find all the courses that are equal to 10$

        const result = await Course.find({ price: 10 })

    But what if we want all the courses that are priced greater than 10$, we need such operators. Instead of passing 
    only 10 as the value to the price key, we pass an object with key $gt , $ is used to indicate operator
              
        const result = await Course.find({ price: { $gt: 10 } })

    For courses between 10$ and 20$,

        const result = await Course.find({ price: { $gt: 10, $lt: 20 } })        

    To check courses that are either 10$, 20$ or 30$, we use $in operator

        const result = await Course.find({ price: { $in: [10, 20, 30] } })


Logical Query Operators

    There are two logical operators in mongoDB

        or
        and

    These operators have their own methods and don't work inside find. For eg, we want to get all courses that are either
    published or authored by mosh

        const result = await Course.find()
            .or([ { author: 'Mosh Hamedani' }, { isPublished: true } ])


    To get all the courses which are published and authored by mosh
        
        const result = await Course.find()
            .and([ { author: 'Mosh Hamedani' }, { isPublished: true } ])

    This is essentially same as 
        
        const result = await Course.find({author: 'Mosh Hamedani', isPublished: true})

    but and operator is used in some complex queries


Regular Expressions ( regex )

    If we want to list all the courses that are authored by 'mosh',

         const result = await Course.find({author: 'mosh'})

    This will search all the courses that are exactly authored by 'mosh. However the courses in the database are authored by 
    'Mosh Hamedani'. Thus the courses with authors 'Moshfegh' or 'Mosh Hamedani' won't be returned. To get more control over 
    filtering strings we can use regular expressions.

        const result = await Course.find({ author: /pattern/ })

    To list all courses with author that starts with Mosh, ^ is used to tell that string must start with that pattern. 
    This will result in all the courses with author name that starts with Mosh no matter what is ahead of it.

        const result = await Course.find({ author: /^Mosh/ })

    To list all courses with author name that ends with Hamedani, $ is used to tell that string must end with that pattern

        const result = await Course.find({ author: /Hamedani$/ })

    To list all courses that contains mosh 

        const result = await Course.find({ author: /.*mosh.* / })

    (space added intentionally to avoid comment behaviour, remove when applying)

    All the above regex are case sensitive, in order to make them case insensitive, pass 'i' at the end

        const result = await Course.find({ author: /^Mosh/i })


Counting
    
    In order to count the number of results, we can use the count method

        const result = await Course.find()
            .limit(10).
            .sort({ name: 1 })
            .count();  


Pagination

    In order to implement pagination on the server side we use the skip method to skip the required number of documents from the 
    result according to the page number. The page number and the page size are mostly passed as queries in the address. let us 
    assume pageSize is 10 and pageNumber is 2.

        const pageSize = 10;
        const pageNumber = 2;

        const skipCourses = (pageNumber-1) * pageSize)

    and we change the limit to pageSize
        
        const result = await Course.find()
            .skip(skipCourses)
            .limit(pageSize)
            .sort({ name: 1 })
            .count(); 


Updating a Document

    Document can be updated by two ways, One approach is called 'query first' in which we get the document by id, update the 
    document and the save the document. Second approach is called 'update first' in which we directly update the document
    in the database and optionally return the document after if required.

    'Query-first approach'

        async function updateCourse(id) {

            const course = await Course.findById(id)    // get the course
            if(!course) return                          // return if no course found    

            course.isPublished = true                   // update
            course.author = 'Another Author'            // properties

            const result = await course.save()
            console.log(result)
        }

        updateCourse(5eb54eb8eb75243dfcfd8ff8)
    
    alternatively we can set the details using set method and passing the updated object

        async function updateCourse(id) {

            const course = await Course.findById(id);
            if(!course) return;

            course.set({
                isPublished: true,
                author: 'Another Author'
            })

            const result = await course.save()
            console.log(result)

        }

        updateCourse(5eb54eb8eb75243dfcfd8ff8)

    'Update-first approach'

        We can either use updateOne or UpdateMany, here we want to get a course and update it, so will we will use updateOne.
        The first argument is the filter and the second argument to this method is the update object. Here we need to use 
        one or more mongoDB update operators. Here we will use the set operator to set the new values. This updateOne 
        function returns a result and not a course object

        Link: https://docs.mongodb.com/manual/reference/operator/update/

            async function updateCourse(id) {
                const result = await Course.updateOne({_id: id}, {
                    $set : {
                        author: 'Another Author',
                        isPublished: true
                    }
                })

                console.log(result)
            }

            updateCourse(5eb54eb8eb75243dfcfd8ff8)

        To get the course object as a return value, we need to use findOneAndUpdate instead of update

            async function updateCourse(id) {
                const course = await Course.findOneAndUpdate({_id: id}, {
                    $set : {
                        author: 'Another Author',
                        isPublished: true
                    }
                })

                console.log(course)
            }

            updateCourse(5eb54eb8eb75243dfcfd8ff8)

        However this returns the course object before the update, to get the updated course we need to pass a third argument
        that is an object with property new with value true
     
           async function updateCourse(id) {
                const course = await Course.findOneAndUpdate({_id: id}, {
                    $set : {
                        author: 'Another Author',
                        isPublished: true
                    }
                }, {new: true} )

                console.log(course)
            }

            updateCourse(5eb54eb8eb75243dfcfd8ff8)


Removing a Document

    In order to delete a document, we can either use deleteOne or findOneAndDelete. To get the deleted document we use findOneAndDelete

        async function deleteCourse(id) {
            const course = await Course.findOneAndDelete({_id: id})

            console.log(course)
        }

       deleteCourse(5eb54eb8eb75243dfcfd8ff8)






*/
