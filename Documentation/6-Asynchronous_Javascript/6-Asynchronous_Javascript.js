/*

Asynchronous vs Synchronous Javascript

    For the code below,

        console.log('before')
        setTimeout(() => console.log('Reading something from db'), 2000)
        console.log('after)

    When we run the program, we see an output like this

        before
        after

    and after 2 seconds, we get 

        Reading something from db

    setTimeout is an example of non blocking asynchronous operation, all it does is it schedules a 
    task that is to be executed later and passes the control to next line

    Note:   asynchronous doesn't mean multi-threaded. Only a single thread is used to perform the task.
            It executes first statement, then schedules a task to perform later, executes the after 
            statement and when it's free, it executes the middle statement after 2 seconds

    To simulate the real world applications, we created a function 'getUser' that returns a 
    user object after 2 seconds

        function getUser(id) {
            setTimeout(() => {
                console.log('Reading something from db');
                return {id: id, gitHubUsername: 'thedemon12'}
            }, 2000);
        }
    
    and call it using 
        
        const user = getUser(id), 

    But if we log user we will see that it is undefined because the above async function takes 2 seconds 
    to process and then returns a value. Meanwhile the control is passed to the later code, thus it shows undefined.

    In order to solve this issue, we have three different techniques

        * Callbacks
        * Promise
        * Async and Await ( syntactical sugar over Promise)


Callbacks

    Callback generally means that a function that is called back when a task is completed. Here callbacks are 
    used to perform certain operations after the data is read from database. Hence we need to add a 
    second parameter and name it callback. Inside the function body, call it when the result of 
    the task is ready, so rather returning the object, we call the callback with this object
        
        function getUser(id, callback) {
            setTimeout(() => {
                console.log('Reading user from db');
                callback({id: id, gitHubUsername: 'thedemon12'});
            }, 2000);
        }
    
    and when calling the function we get this object as

        getUser(id, (user) => {
            console.log(user)
        })

    This second function is executed only when the task is completed , thus logging the object in console
    
    Now let us imagine, after reading the github username, we want to get the list of repositories of that user. This 
    is an another async operation that will take some time

        function getRepos(username, callback) {
            setTimeout(() => {
                console.log('Reading repo from githubAPI');
                callback(['repo1', 'repo2', 'repo3']);
            }, 2000);
        }

    Since this function requires an id, we require to execute the getUser first then getRepos

        getUser(id, (user) => {
            console.log(user)
            getRepos(user, (repos) => {
                console.log(repos);
            })
        })

    Now let us say we want to get the commits from one repo,
        
        function getCommits(repo, callback) {
            setTimeout(() => {
                console.log('Reading repo from githubAPI');
                callback(['commit1', commit2, 'commit3']);
            }, 2000);
        }

    Since this function requires an id and then the repo, we require to execute the getUser and getRepos first and then getCommits
    
        getUser(id, (user) => {
            console.log(user)
            getRepos(user, (repos) => {
                console.log(repos);
                getCommits(repos[0], (commits) => {
                    console.log(commits);
                })
            })
        })
    
    Now let say if we wanted the comments on that commit, you can see how messy the code will be and this is referred to as 'CALLBACK HELL'
    This is due to the nested callbacks inside one another. If we compare it to synchronous code, there 

        const user = getUser(id);
        console.log(user)
        const repos = getRepos(User);
        console.log(repos);
        const commits = getCommits(repos[0]);
        console.log(commits);

    In synchronous it is far easier to read and its simple, whereas our async code looks like a christmas tree.


Solution To Callback Hell - Named Functions (still kinda weird)

    rather than passing anonymous functions, we can use named functions and call them inside the async function call
    for eg: 

        function displayCommits(commits) {
            console.log(commits)
        }

    It is a named version of  
        
        (commits) => {
                console.log(commits);
        }

    Thus we can use

        getUser(id, (user) => {
            console.log(user)
            getRepos(user, (repos) => {
                console.log(repos);
                getCommits(repos[0], displayCommits(commits))
            })
        })

    Similarly, we can extract displayRepos function

        function displayRepos(repos) {
            console.log(repos);
            getCommits(repos[0], displayCommits(commits))
        }

    which further reduces code to
        
    getUser(id, (user) => {
            console.log(user)
            getRepos(user, displayRepos(repo))
        })
        
    and then the finally DisplayUser function

        function displayUser(user) {
            console.log(user)
            getRepos(user, displayRepos(repo))
        }

    Which finally reduces our async call to 

        getUser(id, displayUser(user))

    Thus our "callback hell" or the deeply nested structure is solved. However this makes our code in multiple 
    locations and thus is not ideal. A Better way is using Promises


Promises

    A promise is an object that holds the eventual result of an async operation. When an async operation completes, 
    it either returns a value or returns an error. It basically promises you to give the result of the object

    When we create the object it will be in the 'pending' state, at this point it will start some async operation 
    and as soon as the result is ready its state changes either to be 'resolved' if the operation 
    succeeded or 'rejected' if something went wrong during the async operation.

    A new promise is created using

        const p = new Promise(function)

    this function has two parameters resolve and reject

        const p = new Promise((resolve, reject) => {
            
            // some async operation
            
            resolve() if succeeded, 
            reject() if errors

        })

    you can return some objects or string or anything inside the resolve() function

        const p = new Promise((resolve, reject) => {
            setTimeout(()=> {
                resolve(1)
            }, 2000)
        })

    Somewhere else we need to consume this promise. This promise p has two methods

        .then() &
        .catch()

    .then() is called when the promise is resolved and .catch is called when the promise is rejected. 
    The returned data is obtained in promise using a function

        p.then(result => console.log(result))

    and to catch errors we change the .catch method to it

        p.then(result => console.log(result))
            .catch(err => console.log(err.message))

    Back to the callback hell problem, we had a function getUser

        function getUser(id, callback) {
            setTimeout(() => {
                console.log('Reading user from db');
                callback({id: id, gitHubUsername: 'thedemon12'});
            }, 2000);
        }

    We can change it using promises

        function getUser(id) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                console.log('Reading user from db');
                resolve({id: id, gitHubUsername: 'thedemon12'});
            }, 2000);
            })
        }

    and change the rest of them too

        function getRepos(username) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('Reading repo from githubAPI');
                    callback(['repo1', 'repo2', 'repo3']);
                }, 2000);
            })

        }

        function getCommits(repo) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('Reading repo from githubAPI');
                    callback(['commit1', commit2, 'commit3']);
                }, 2000);
            })

        }


Consuming these promises

    We can call getUser with the id , which returns a promise, which we can apply the .then method. We 
    get the user object in return to which we can call the getRepos method using the .then method 
    which returns an array of repos to which we can call .then and so on. This is referred to as 
    'chaining of then'

        getUser(1)
            .then(user => getRepos(user))
            .then(repos => getCommits(repos[0]))
            .then(commits => console.log(commits))

    This solves our problem of callback hell as it looks far more cleaner than the old code.

        Old code : 

            getUser(1, (user) => {
                console.log(user)
                getRepos(user, (repos) => {
                    console.log(repos);
                    getCommits(repos[0], (commits) => {
                        console.log(commits);
                    })
                })
            })

    Whenever working with promises make sure, to add the catch method to get the errors

        getUser(1)
            .then(user => getRepos(user))
            .then(repos => getCommits(repos[0]))
            .then(commits => console.log(commits))
            .catch(err => console.log(err.message))

            
Settled Promises

    Sometimes we need to create a promise that is already resolved or rejected. This is helpful while
    writing the unit tests. To simulate a scenario where we call a server and server responds 
    with an object, we need to create a resolved promise

        const p = Promise.resolve({id: 1}) 

    This returns a resolved promise to p. We can also create a rejected Promise using,

        const p = Promise.reject(new Error('error'))
    
    and we catch it using catch() method


Parallel Promises

    Let's say that we have to call Twitter API and the GitHub API
    
        const p1 = new Promise((resolve, reject) => {
            setTimeout(()=> {
                console.log('Calling Twitter API')
                resolve(1)
            }, 2000)
        })

        const p2 = new Promise((resolve, reject) => {
            setTimeout(()=> {
                console.log('Calling GitHub API')
                resolve(2)
            }, 2000)
        })

    To kickoff all these operations, simultaneously we use a method of Promise class

        Promise.all([p1, p2])
    
    This method will return a promise, which will only be resolved when all these promises 
    are resolved, otherwise it will be rejected

        Promise.all([p1, p2])
            .then(result => console.log(result))

    The result will be an array of all the results of the above promises

        result: [1, 2]

    If we want to execute something as soon as one of the promises is fulfilled we use

        Promise.race([p1, p2])
    
    This returns a fulfilled promise as soon as one of the promise is fulfilled

        Promise.race([p1, p2])
            .then(result => console.log(result))
    
    The result will be the result of one of the promises that was completed
    
        result : 1
        

Async and Await

    The Promise call that we wrote in previous section , 

        getUser(1)
            .then(user => getRepos(user))
            .then(repos => getCommits(repos[0]))
            .then(commits => console.log(commits))
            .catch(err => console.log(err.message))
    
    This can be made even simpler. In Javascript there is a new feature called 'async and await'
    It helps us write asynchronous code like synchronous code. When we call getUser function, 
    it returns a promise which we can 'await' the result of the function and get the actual 
    result just like calling the synchronous function

        const user = await getUser(1)

    Now since we have the user object, we can call the getRepos with this user object

        const repos = await getRepos(user)
    
    and now we can then call getCommits

        const commits = await getCommits(repos[0])
    
    and then we can log the commits

        console.log(commits)

    Whenever we use await operator in a function, we need to decorate that function with the async modifier
    Since we used these commands outside of a function. Thus we need to wrap these commands inside a function,
    decorate it with async and then call it

        const showCommits = async () => {
            
            const user = await getUser(1)
            const repos = await getRepos(user)
            const commits = await getCommits(repos[0])
            console.log(commits)
        }

        showCommits()

    In async and await we don't have a catch method, we use 'try-catch' block to get the errors

        try {

            const showCommits = async () => {
                const user = await getUser(1)
                const repos = await getRepos(user)
                const commits = await getCommits(repos[0])
                console.log(commits)
            }

            showCommits()
        }

        catch (ex) {
            
            console.log(ex.message)
        }

*/
