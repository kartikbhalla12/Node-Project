const fs = require('fs');


fs.readdir('./', function(err, files) {
    if(err) return console.log('error', err);
    return console.log('Files', files);
})
