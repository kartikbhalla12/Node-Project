const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
const config = require('config')

module.exports = function(){
    
winston.add(new winston.transports.File({ filename: 'index.log', format: winston.format.combine(
    winston.format.prettyPrint()
  )}));
winston.add(new winston.transports.MongoDB({db: config.get('db'), options: { useNewUrlParser: true, useUnifiedTopology: true} }))

winston.add(new winston.transports.Console({ format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple(),
    winston.format.prettyPrint(),
    winston.format.json(),

  )}));



process.on('uncaughtException', function(ex) {
    console.log(`Uncaught Exception`);
    winston.error(ex.message, ex)
 });
 process.on('unhandledRejection', function(ex) {
    console.log(`Unhandled Rejection`);
    winston.error(ex.message, ex)
 });

}