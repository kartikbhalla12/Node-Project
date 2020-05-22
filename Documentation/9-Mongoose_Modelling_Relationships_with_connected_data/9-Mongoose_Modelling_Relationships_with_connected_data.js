/*

Modelling Relationships

    So far we've worked with single independent documents, but in real world, documents are dependent on one another, 
    For eg. the course document that we created has an author, but the author has more just a name, it may have 
    multiple properties, like his name, age, list of courses and so on. This author should be probably saved 
    in an author document in an authors collection. Basically there are two approaches
    
        Using References ( normalization )
        Using Embedded Documents ( denormalization )


    Using References

        In this approach we have an author document in another collection with an id and now when we create a new 
        course, we pass an id of the author document in the course document

        let id of the author be 5ec6b48d1d3e3b077cff6e10

            const course = new Course({
                title: 'Mastering React',
                author: '5ec6b48d1d3e3b077cff6e10',
                isPublished: true,

            })

        thus we used the reference of the author document in the course document.

        
    Using Embedded Documents

        In this approach we don't have an another collection for the authors, rather we embed all the author details 
        inside the author property of the course document.

            const course = new Course({
                title: 'Mastering React',
                author: {
                    name: 'Mosh Hamedani',
                    age: 30,
                    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam',
                    courses: ['course1', 'course2', 'course3']
                    github: 'http://github.com/mosh-hamedani'
                    .... and so on
                },
                isPublished: true,
            })
        

    If we ever wanted to update some properties of the author document, in first approach we just have to update once, and all 
    other course documents will get the reference of the new properties, while in the second approach where each course has 
    its own author object has to updated individually. We might think that the first approach is a way to go which is not 
    always true, it really depends on the type of applications. Both of them have their own pros and cons. While the first 
    approach is much consistence, it reduces the query performance as it needs to call the server twice during the GET 
    request, once when getting the course and then the authors collection to get the author. While in the other approach,
    it is much less consistence but it has higher performance as it needs to call the server only once during the 
    GET request. Thus this is a tradeoff between the query-performance and consistency.


    Hybrid Approach

        In the hybrid approach, we have an authors collection containing all the authors with their name and 50 other properties,
        and in the course document we embed the author along with couple of other properties like the name etc which are less
        likely to change in the future

            const course = new Course({
                title: 'Mastering React',
                author: {
                    _id: '5ec6b48d1d3e3b077cff6e10'
                    name: 'Mosh Hamedani',
                },
                isPublished: true,
            })
        
        We don't really need the other properties of author in this course object like his/her bio, age etc. We set the _id 
        in this author object same as the id of the author in the authors collection, to get the rest of the properties in 
        future if required

    
    We can't really rely on one approach, each approach is used on different scenarios and it depends on the application that we are 
    building


Referencing Documents
    
    Let there be an authors collection with schema,

        const authorSchema = new mongoose.Schema({
            name: String,
            bio: String,
            website: String,
        })

    and an Author model using this authorSchema
        
        const Author = mongoose.model('Author', authorSchema)

    let there be an author document in this collection 

        {
            _id: '5ec6b48d1d3e3b077cff6e10',
            name: 'Mosh Hamedani',
            bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam',
            website: 'https://codewithmosh.com'
        }
    
    In order to reference this author document in the course document, we need to have a basic schema first. We need to create an author 
    property, inside which we will have an 'type' property with a type of ObjectId which we can get from mongoose.Schema.Types.ObjectId 
    and a 'ref' property with a value of the singular name of the collection with first letter capital (same as while defining the 
    Author model)

        const courseSchema = new mongoose.Schema({
            title: String,
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Author'
            }
        })

        const Course = mongoose.model('Course', courseSchema)

    and now we can create a new course by 

        const course = new Course({
            title: 'Mastering React',
            author: '5ec6b48d1d3e3b077cff6e10'
        })
        await course.save();

    this creates a new course object something like this

        {
            _id: '5ec6c001c6ef8e360c99792f',
            title: 'Mastering React'.
            author: '5ec6b48d1d3e3b077cff6e10',
            
        }        
        

Population

    If we now get the course from the database, we will get something like this

        {
            _id: '5ec6c001c6ef8e360c99792f',
            title: 'Mastering React'.
            author: '5ec6b48d1d3e3b077cff6e10',
            
        }
    
    But its likely that we need to know the username rather than this id, so to get the author object we just need to use the 'populate' method 
    on Course model when using the 'find' method. This is because, we have already provided the 'ref' property to the author object and thus
    mongoose will automatically populate the author. As an argument to the populate method, we need to provide the property that we need to
    populate. So to get the populated course,

        (async function () {

            const course = await Course.find()
                .select()
                .populate('author')

            console.log(course)
        })()    //IIFE

    and we will get output like this

        {
            _id: '5ec6c001c6ef8e360c99792f',
            title: 'Mastering React'.
            author: {
                _id: '5ec6b48d1d3e3b077cff6e10',
                name: 'Mosh Hamedani',
                bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam',
                website: 'https://codewithmosh.com'     
            }       
        }        

    Optionally we can pass a second argument, in which we can pass the properties that we want and that we don't want

        (async function () {

            const course = await Course.find()
                .select()
                .populate('author', 'name')

            console.log(course)
        })()

    and we get output like this

        {
            _id: '5ec6c001c6ef8e360c99792f',
            title: 'Mastering React'.
            author: {
                _id: '5ec6b48d1d3e3b077cff6e10',
                name: 'Mosh Hamedani',  
            }       
        }       

    We can exclude properties by prefixing a '-' ahead of the property name
        
        (async function () {

            const course = await Course.find()
                .select()
                .populate('author', 'name -_id')

            console.log(course)
        })()

    and we get output like this

        {
            _id: '5ec6c001c6ef8e360c99792f',
            title: 'Mastering React'.
            author: {
                name: 'Mosh Hamedani'  
            }       
        }       


Embedding Documents

    Let there be an authors collection with schema,

        const authorSchema = new mongoose.Schema({
            name: String,
            bio: String,
            website: String,
        })

    and an Author model using this authorSchema
        
        const Author = mongoose.model('Author', authorSchema)

    we don't directly pass the author object inside the course document, rather we create something that is called a 
    'sub-document'. We create a sub document by setting the author property in the courseSchema to authorSchema

        const courseSchema = new mongoose.Schema({
            title: String,
            author: authorSchema,
        })

        const Course = mongoose.model('Course', courseSchema)        

    lets create a new course, we pass a simple author object while creating a new course.

        (async function () {
            const course = new Course({
                name: 'Kartik',
                author: {
                    name: 'kartik',
                },
            });

            const result = await course.save();
            console.log(result);
        })();

    On the console we see something like this,

        {
            _id: 5ec7962184e43d222c5373ea,
            name: 'Kartik',
            author: { _id: 5ec7962184e43d222c5373eb, name: 'kartik' },
            __v: 0
        }
    
    These sub-documents when created have there own _id inside the course document. These sub-documents are like the 
    documents, and almost all features that are available for these documents are available for the sub-documents.
    For eg. we can enforce validation and make the name property required by adding these validation checks inside
    the authorSchema.

    However these sub-documents can't be saved on there own, they can only be saved inside their parent document.
    and can be updated using course documents only. We can access and these courses using the dot notation.

        (async function () {
            const course = await Course.findById(5ec792c7fe68c711e045aa55);
            console.log(course.author.name);
        })();
    
    and can update the name using

        (async function () {
            const course = await Course.findById(5ec792c7fe68c711e045aa55);
            course.author.name = "Mosh Hamedani"
            course.save();
        })();
    
    We don't have any method such as course.author.save to save the sub document, we save the course document all together.

    Alternatively, we can use the 'update-first' approach and use the $set operator to set the name.

        (async function () {
            
            const res = await Course.updateOne({ _id: '5ec792c7fe68c711e045aa55' },
            {
                $set: {
                    'author.name' : 'Kartik',
                },
            })

            console.log(res)

        })();

    Note here, the key is wrapped in single quotes, this is because in order to use dot notation we need to have quotes

    We can remove the name property inside the sub-document using the $unset operator

        (async function () {
            const res = await Course.updateOne({ _id: '5ec79aa54fc3b3021421add3' },
                {
                    $unset: {
                        'author.name': '',
                    },
                }
            );

            console.log(res);
        })();

    Or we we can remove the entire sub-document entirely by

        (async function () {
            const res = await Course.updateOne( { _id: '5ec79aa54fc3b3021421add3' },
                {
                    $unset: {
                         author: '',
                    },
                }
            );

            console.log(res);
        })();

    Now if we want to apply validation on the whole author property, we can do something like this inside courseSchema

        const courseSchema = new mongoose.Schema({
            title: String,
            author: {type: authorSchema, required: true},
        })    

    Or if we want to apply some validation logic on some specific properties inside the author dub-document , we can do this 
    in the authorSchema
        
        const authorSchema = new mongoose.Schema({
            name: { type: string, required: true},
            bio: String,
            website: String,
        })


Using an Array of Sub-Documents

    So if we have multiple authors to a course, we can use array of sub-documents. We can change the courseSchema something like this
    Note that here I have used authors key instead of author to refer to multiple authors

        const courseSchema = new mongoose.Schema({
            title: String,
            authors : [ authorSchema ]
        }) 
    
    and simply create a new course by, ( note i have used authors )

        (async function () {
            const course = new Course({
                name: 'Mastering React',
                authors: [{ name: 'Kartik' }, { name: 'Mosh' }, { name: 'John' }],
            });

            const result = await course.save();
            console.log(result);
        })();

    and we get something like

        {
            _id: 5ec7b022d8e7333248a57d5f,
            name: 'Mastering React',
            authors: [
                { _id: 5ec7b022d8e7333248a57d60, name: 'Kartik' },
                { _id: 5ec7b022d8e7333248a57d61, name: 'Mosh' },
                { _id: 5ec7b022d8e7333248a57d62, name: 'John' }
            ],
            __v: 0
        }
                
    we can also add more authors later using the dot notation and the push method

        (async function () {
            
            const course = await Course.findById('5ec7b022d8e7333248a57d5f');
            course.authors.push({ name: 'Katy' })
            const result = await course.save();
            console.log(result);

        })();
    
    and on the output, we can see that the array of authors has been updated

        {
            _id: 5ec7b022d8e7333248a57d5f,
            name: 'Mastering React',
            authors: [
                { _id: 5ec7b022d8e7333248a57d60, name: 'Kartik' },
                { _id: 5ec7b022d8e7333248a57d61, name: 'Mosh' },
                { _id: 5ec7b022d8e7333248a57d62, name: 'John' },
                { _id: 5ec7b0eb29226f0494b72dab, name: 'Katy' }
            ],
            __v: 1
        }

    Similarly we can delete an author using the remove method on the author sub-document. the course.authors has a method called id, 
    which takes the id as an argument and we can use to lookup the author in the array

        (async function () {
            
            const course = await Course.findById('5ec7b022d8e7333248a57d5f');
            const author = await course.authors.id('5ec7b0eb29226f0494b72dab');
            author.remove()

            const result = await course.save();
            console.log(result);

        })();


    and now we are back to three authors

        {
            _id: 5ec7b022d8e7333248a57d5f,
            name: 'Mastering React',
            authors: [
                { _id: 5ec7b022d8e7333248a57d60, name: 'Kartik' },
                { _id: 5ec7b022d8e7333248a57d61, name: 'Mosh' },
                { _id: 5ec7b022d8e7333248a57d62, name: 'John' }
            ],
            __v: 2
        }


Setting the author using hybrid approach

    In the hybrid approach, we have all the authors listed in an authors collection, on such document in that collection is

        { 
            _id: 5ec7b022d8e7333248a57d60, 
            name: 'Mosh' 
            bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam',
            website: 'https://codewithmosh.com'  
            ... and so on
        },

    when defining the course document we embed the author inside the course and list the few required properties.

        const authorSchema = new mongoose.Schema({
            name: String,
            bio: String,
            website: String,
        })
        const Author = mongoose.model('Author', authorSchema)    

        const author = await Author.findById('5ec7b022d8e7333248a57d60');

    In our course object we only need the name in the sub document so we create a sub schema for the author to add in the courseSchema

        const courseSchema = new mongoose.Schema({
            title: String,
            author : new mongoose.Schema({
                name: String
            })
        })

    and create a new Course model with

        const Course = mongoose.model('Course', courseSchema)

    create a new course object with
        
        (async function () {
            
            const course = new Course({
                title: 'Mastering React',
                author: {
                    _id: author._id,
                    name: author.name
                }
            })

            const result = await course.save();
            console.log(result);

        })();
        

Transactions

    Transaction means a group of operations that are performed as a unit. That means either all these operations will complete and change 
    the state of the database or if any one of them fails, all the changes that were applied during the transaction will be reverted back
    to the state that was before initiating the transaction. There is a library called 'Fawn', which internally implement this 
    transaction behaviour using two-phase commits. Install fawn by

        npm i fawn

    and include fawn using

        const Fawn = require('fawn')

    Fawn has a initialize method that takes the mongoose object to initialize,

        Fawn.init(mongoose)

    To create a new transaction, we create a new Fawn task

        new Fawn.task()

    we have bunch of methods that we can chain like 'save', 'update', 'remove' etc. For eg, we want to save a course object in courses collection 
    and update the author age by 1 . These methods take first argument as the name of the collection and the rest argument depends on the 
    task. For eg. in 'save' method the second argument is the course object that is to be saved. In the 'update' method, second argument is 
    the query to find the document and third is object with update operators

        new Fawn.task()
            .save('courses', course)
            .update('authors', {_id: author.id }, {
                $inc: {
                    age: 1
                }
            })

   and finally we need to call the 'run' method in order to execute these commands.
   
        new Fawn.task()
            .save('courses', course)
            .update('authors', {_id: author.id }, {
                $inc: {
                    age: 1
                }
            })
            .run() 
    
    There might be a case, when this transaction fails, this is when this returns an exception, so we need to use the try catch block

        try {
            
            new Fawn.task()
                .save('courses', course)
                .update('authors', {_id: author.id }, {
                    $inc: {
                        age: 1
                    }
                })
        }

        catch (ex) {
            res.status(500).send('Something Failed')
        }

        
ObjectID

    An objectId is a long string of 24 characters and every two characters represents a byte. Thus an id is of 12 byte to uniquely identify
    a document in mongoDB.

    _id: 5ec7b022d8e7333248a57d60

        The first 4 bytes represent the timestamp,
        The next 3 bytes represent the machine identifier, two different machines will have different identifiers
        The next 2 bytes represent the process identifier
        The last 3 bytes represent the counter

    This id is generated by mongoDB driver and not by mongoDB. To explicitly generate a new id , we can use

        const id = new mongoose.Types.ObjectId()

    this id has a method called getTimestamp which we can use to get the timestamp

        console.log(id.getTimestamp());

    and this gives the timestamp in the console.

        2020-05-22T12:56:27.000Z

    To validate an object id, we have a static method that validates id the object id is correct or not.

        mongoose.Types.ObjectId.isValid('1234')

    which will result in a boolean, false in this case.
    
    id validation can be also done using Joi, install a package called joi-objectid and include in the file using

        const Joi = require('joi');
        Joi.objectId = require('joi-objectid')(Joi)

    and now we can use this for the validation

        const schema = {
            id: Joi.objectId().required()
        }
        
*/
