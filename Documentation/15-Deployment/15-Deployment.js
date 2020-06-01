/*

Introduction

    We have two options for deploying applications, we can either use a Platform as a Service Provider (PaaS) like heroku, aws, azure, 
    google cloud platform or we can use Docker which is deploying a copy of your application to your own computer. Usually PaaS is 
    preferred for deploying these applications as it automatically majority of the work that is needed during deployment, otherwise
    docker is preferred if you want manual control over everything. These notes will walk you through for deploying your application 
    on heroku. 


Preparing the App

    For production, we need to have some packages that are necessary, first is 'helmet' and it is used to protect our web application
    from most of the vulnerabilities out there that can potentially affect our app. Second is 'compression', which is used to compress
    the http responses that are sent to the client. Install these using npm

        npm i helmet
        npm i compression

    These both when loaded returns a middleware functions, that can be then inserted into request processing pipeline.

        const helmet = require('helmet')
        const compression = require('compression')

        app.use(helmet())
        app.use(compression())


Heroku 

    Heroku link: https://heroku.com

    First, we need to create an account on heroku, and then install the Heroku CLI (command line interface) which will be used in terminal.
    We need to login to heroku using the heroku cli, so to login use

        heroku login

    This will open a webpage where you can login with your credentials. Earlier we learned how we can define npm commands under the scripts section.
    Heroku starts our application by running the npm start. so we need to add a new property in the scripts

        "start": "node index.js"

    To tell heroku, which version of node we are using, we need to define a new property engines where we define the version of node we are using.

        "engines" : {
            "node": "12.16.2"
        }

Adding the code to our git repository

    Before we deploy our app to heroku, we have to add our code inside a git repository. So in the root directory, we can initialize the git repository by

        git init
        git add .
        git commit -m "First Commit"
    
    and we can push our code to github if we want.


Deploying to Heroku

    Once we have a git repository set up, we can use the heroku cli to deploy our application to heroku. So inside the repository use,

        heroku create

    This commands create an empty application in heroku and secondly it creates a git remote of 'heroku' that we can push to, So we can push to heroku using

        git push heroku master

    This will install the engine, node in this case and all the npm dependencies that our application requires and finally deploys the application


Viewing Logs

    We can heroku logs using the terminal using

        heroku logs

    We can use the terminal of the heroku either by connecting to the heroku server (heroku dyno) using SSH, or we can use the dashboard to run the console.


Setting Environment Variables

    We can set environment variables using the heroku cli using,

        heroku config:set vidly_jwtPrivateKey=1234
        heroku config:set NODE_ENV=production

    and we can see all the environment variables that we have set using

        heroku config


MongoDB in the cloud

    We can use mLab to create a database which provides free plan upto 0.5Gb Storage. It will generate a link which can be used to contact with the mongoDB.
    We can enter this link in our heroku's db as an environment variable and then commit and push to heroku, which will restart the heroku server and run 
    our application


*/
