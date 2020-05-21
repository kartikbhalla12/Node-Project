/*

Validation

    The course schema that we defined earlier in this section is

        const courseSchema = new mongoose.Schema({
            name: String,
            author: String,
            tags: [ String ],
            date:{ type: Date, default: Date.now },
            isPublished: Boolean,
        }

    By default all the properties defined above are optional, so if we create a course with 

        const course = new Course({});

    and save that course to the database,

        await course.save()

    That would be perfectly valid, MongoDB doesn't care that this document has the above 
    mentioned properties.

    In order to implement validation at the database level, we can modify the schema key-value 
    pairs using 'Mongoose'

    
    Required

        To make a property required, we change the value of a key from just the type to an object 
        and pass a required key with the type, just like we did with default key in the date. This 
        object is referred to as 'SchemaType Object'

            const courseSchema = new mongoose.Schema({
                name: { type: String, required: true },
                author: String,
                tags: [ String ],
                date:{ type: Date, default: Date.now },
                isPublished: Boolean,
            }        
        
        This will make the name property required and if we create a new course without this property,
        it will return an 'unhandled promise rejection warning', and will terminate the process.

        In order to handle these exceptions, we wrap course.save() in a try catch block

            try {
                const result = await course.save();
                console.log(result);
            }

            catch (ex) {
                console.log(ex.message)
            }
        
        We can manually trigger tha validation check using the 'validate' method

            try {
                await course.validate()
            }

            catch (ex) {
                console.log(ex.message)
            }        
        

    But we already have a validation check using Joi when receiving a request, so why do we need another validation check?
    The answer is we should use both of them. These validations complement each other. One checks for any client 
    request errors of the REST API, and the database validation checks any errors in out code during saving 
    the course to the database.


Built-in Validators

    One of the built-in validators is the 'required'. We can either directly pass the boolean or pass a function that can 
    return a boolean value when certain condition is valid, for eg. price is only required if the course is published

        const courseSchema = new mongoose.Schema({
            name: { type: String, required: true },
            author: String,
            tags: [ String ],
            date:{ type: Date, default: Date.now },
            isPublished: Boolean,
            price: {type: number, required: function () { return this.isPublished; }}
        }   

    Note here, we can't use the arrow key function syntax, because these functions don't have their own 'this'

    
    String Validators

        Some built-in string validators include 
            
            minLength, used to set the minimum length of the string,
            maxLength, used to set the maximum length of the string,
            match, which takes a regex to match the string with it
            enum, which takes an array, and validates only if the the string given is in that array

        For eg, we want to set min and max length of the name, and a category to enum containing 'web', 'network', 'mobile' in it.
        enum property will validate only if the category's value is one of them

        const courseSchema = new mongoose.Schema({

            name: { 
                type: String, 
                required: true, 
                minLength: 5,
                maxLength: 255,
                // match: /patter/
            },
            category : {
                type: String,
                required: true,
                enum: ['web', 'network', 'mobile']
            }
            author: String,
            tags: [ String ],
            date:{ type: Date, default: Date.now },
            isPublished: Boolean,
            price: {type: number, required: function () { return this.isPublished; }}
        }   
    
    
    Number Validators

        Some built-in number validators include 

            min, used to set the min value of the number,
            max, used to set the max value of the number

        For eg, we want to set the min and max value of the price to be minimum of 10 and max of 200

            const courseSchema = new mongoose.Schema({

                name: { 
                    type: String, 
                    required: true, 
                    minLength: 5,
                    maxLength: 255,
                    // match: /patter/
                },
                category : {
                    type: String,
                    required: true,
                    enum: ['web', 'network', 'mobile']
                }
                author: String,
                tags: [ String ],
                date:{ type: Date, default: Date.now },
                isPublished: Boolean,
                price: {
                    type: number, 
                    required: function () { return this.isPublished; },
                    min: 10,
                    max: 200
                }
            }


Custom Validators
    
    Sometimes the built-in validators doesn't give the validation we require. For eg, if we want to validate that the course 
    should have at least one tag. Tags is an array of strings and we cannot simply use the required property because an empty 
    array when passed, will be treated as a valid array for mongoose. Hence we need a custom validator. We can create a 
    custom validator by using the 'validate' property in the object 

        tags: {
            type: Array,
            validate: { }
        }
    
    This validate property takes an object and this object has a property called 'validator', which we set to a function.

        tags: {
            type: Array,
            validate: { 
                validator: function ()
            }
        }

    This function takes an argument v (short for value) and inside this, we can implement our custom validation logic

        tags: {
            type: Array,
            validate: { 
                validator: function (v) {
                    if(v.length > 0)
                        return true;
                }
            }
        }

    or simply

        tags: {
            type: Array,
            validate: { 
                validator: function (v) {
                    return v.length > 0
                }
            }
        }

    we can also return a simple message if this validation fails. The 'validate' object has another property called 'message'

        tags: {
            type: Array,
            validate: { 
                validator: function (v) {
                    return v.length > 0
                },
                message: 'A course should have at least one tag'
            }
        }

    Now if we save course with an empty array or without providing the tags property, we will get the above message. But if 
    we set our tags property to 'null', our validator can't interpret .length of a null as it is not an array and will 
    result into an error like cant read length property of null. In order to fix this, we need to change our return value
    from 'v.length > 0' to 'v && v.length > 0'. This will ensure value is defined.

        tags: {
            type: Array,
            validate: { 
                validator: function (v) {
                    return v && v.length > 0
                },
                message: 'A course should have at least one tag'
            }
        }


Async Validators

    Sometimes a validation logic may involve reading something from a database or a service, thus we may not have the answer straight 
    away, hence we need an async validator. To create an async validator, in the validate property, set the isAsync property to true
    and add a second argument callback to the function

        tags: {
            type: Array,
            validate: { 
                isAsync: true,
                validator: function (v, callback) {

                    setTimeout(() => {

                        // async operation 

                        const result = v && v.length > 0
                        callback(result)
                    }, 2000)

                },
                message: 'A course should have at least one tag'
            }
        }


Validation Errors

    The exception that we get using the catch block contains a lot of info. This exception has a property called errors

        ex.errors
    
    This returns an errors object which will have multiple properties that were not validated, for eg if name and 
    category is invalid, this object will have two properties , ex.errors.name and ex.errors.category. These 
    properties are also an object and have multiple properties including a message property which we 
    can use to log

    we can iterate inside these using a loop

        for (field in ex.errors) {
            console.log(ex.errors[field].message)
        }

    This will list all the errors inside the console


SchemaType Options

    There are couple more Schema Type options that we can pass to these properties, For strings we have 3 additional properties

        lowercase: true, which will automatically convert the string to the lowercase
        uppercase: true, which will automatically convert the string to the uppercase
        trim: true, which will remove any extra padding around the string if any

    We have couple of more properties that can be applied to any type, that is the getter and the setter. For eg we want to round off 
    a number when we set the price property, this setter will be called. This setter takes a function which we can use to 
    round off the value

        price: {
            type: number, 
            required: function () { return this.isPublished; },
            min: 10,
            max: 200,
            set: v => Math.round(v)
        }

    Alternatively, we may also require to round off the value when we are getting this from the database,

        price: {
            type: number, 
            required: function () { return this.isPublished; },
            min: 10,
            max: 200,
            set: v => Math.round(v),
            get: v => Math.round(v)
        }        



*/
