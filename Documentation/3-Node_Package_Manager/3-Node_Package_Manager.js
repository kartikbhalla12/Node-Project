/*

NPM
    NPM or Node Package Manager is a CLI tool and registry service for 
    all 3rd party libraries. Link: https://npmjs.com


Installing NPM

    NPM is automatically installed when installing node. To check npm version, 
    open terminal and write

        npm -v


Installing a NPM Package

    To Install a node package, write

        npm i <package name>
        eg : npm i underscore
    
    i means install. This installs this package as a dependency of this app 
    under node_modules folder. To install a package globally we use -g

        npm i -g <package name>
    
    This installs the package globally independent of the app we are working on.
    To install a package with the desired version, we use

        npm i <package name>@<version>
        eg : npm i underscore@1.10.2
    
    On opening Package.json, we can see we have a dependency created of underscore module

        "dependencies": {
            "underscore": "^1.10.2"
        }


Using a package

    In app.js, we import this by using,
    
        const _ = require('underscore')
    
    ' _ ' is a general convention for defining underscore module as a constant


Package Dependencies
    
        It is possible that the module we installed is dependent upon another modules,
        These dependencies are also installed inside the node_modules folder


Restoring Package Dependencies

    Usually, we don't upload node_modules folder in our source code. 
    This is because this folder contains all the dependencies and that are mentioned 
    in our json file, which can be installed again by a single command using
    
        npm i


Semantic Versioning (SemVer)

    In SemVer, version of a packager consists of 3 components. The first component is called 
    the 'major version', the second one is called the 'minor version' and the third one is 
    called the 'patch release'. Patch release is updated when a bug is fixed. Minor version is 
    updated when a new feature is added and it doesn't break the existing features 
    major version is updated when a new feature and can potentially break the old features

    "dependencies": {
            "underscore": "^1.10.2"
        }
    
    In Package.json dependencies, we see ^ ahead of the version

    ^ means when updating npm packages, npm is allowed to update up to minor release
    that means 1.x in this case

    ~ means when updating npm packages, npm is only allowed to update the patch release,
    that means 1.10.x in this case

    * means when updating npm packages, npm is allowed to update up to major release
    that means x in this case

    "underscore": "1.10.2" means that this project strictly uses 1.10.2 of underscore module


Listing installed NPM Packages

    We can see all NPM packages installed using,
        
        npm list
    
    It shows all the dependencies and their dependencies(if any). To see the the 
    dependencies of your app only write,
        
        npm list --depth=0

    To check all the global packages installed, run

        npm list -g --depth=0

Info about any package (installed or not)

    To see the info about any package, use
        
        npm view <package name>
        eg: npm view mongoose

    To check dependencies of any package, use

        npm view <package name> dependencies
        eg: npm view mongoose dependencies      
    
    To view versions of any packager, use

        npm view <packager name> versions
        eg: npm view mongoose versions


Outdated Packages

    To check for outdated packages, run

        npm outdated

    It will show all the packages that are outdated and can be updated.

        Current version shows the package version installed on our project
        
        Wanted version shows the latest version that can be 
        installed tou you project according to SemVer
        
        Latest version shows the latest version available by the developer
    
    you can update the outdated versions using 
        
        npm update

    But this will only install the minor version and patch releases

npm-check-updates (ncu)

    To update a major release of a package, we need a npm package called 
    npm-check-updates. So install it by

        npm i -g npm-check-updates
    
    To check for updates, run
        
        ncu (or npm-check-updates)
    
    This will like all the modules that can be updated, update them using

        ncu -u


Development Dependencies

    There are some dependencies that are only used in development, For example
    there are dependencies that are used to perform unit test, etc. These 
    dependencies should not be in production. So to install dependencies
    that are for development only, use

        npm i <package name> --save-dev

    This installs the package in node_modules folder as well but it goes with 
    a diff property in the package.json

        "devDependencies": {
        "underscore": "^1.10.2"
    }


Uninstalling a Package

    To uninstall a package, run

        npm un <package name>
        eg: npm un mongoose
    
    This removes mongoose from node_modules folder and from the dependencies 
    in package.json

    
*/
