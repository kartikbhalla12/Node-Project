/* 
What is node? 

    Created by ryan Dahl

    Node is a open source and cross platform runtime environment for 
    executing js code outside the browser

    Often used to create back-end services (API or Application Programming Interface)

    APIs are services used to power client applications (front-end) like web app or mobile app.

    Storing data, managing logins etc are managed by API which a client might require.

    Node is super fast and highly scalable, uses Js as a programming language which makes 
    code more cleaner and more consistent, and included many open source libraries

    Node is used by big companies like Paypal, Netflix, Uber etc


Node Architecture.

    Node is built on Chrome's v8 engine in C++ language.

    Doesn't contain front-end 'document' object, rather has many different objects (modules)
    for working with files, os, network, database, etc
    
    Node is neither a programming language(C, Java, etc) nor a framework( ASP.NET, Django, etc). Node is a runtime environment.


Node Working

    Highly Scalable
        This is due to non-blocking or asynchronous nature of node.

        Thread doesn't wait for the request to be processed, rather it moves to the next request. 
        It later receives the response when the request is processed

    Node is a single thread runtime environment as compared to multi thread env like ASP.net etc.
    This means for multi thread environment, there is a practical limitation of the no. of threads that a server can handle.
    as there are limited number of threads.

    Node uses a single thread to handle the requests ( creates an event queue ).

    Node should not be used in CPU intensive applications like video encoding or image manipulation services.


Installing Node

    Download Link : https://nodejs.org/en/download/


First Node Program

    Create a new file with name <any name>.js (app.js)

    Create a simple function which logs a message with your name

    function sayHello(name) {
        console.log(`Hello ${name}!`)
    }

    and call it in file

    sayHello('kartik')

    run this js file in the terminal using 'node <any name>.js' ( node app.js )

    the output will be like this : Hello kartik!

*/