const jwt = require('jsonwebtoken');
const config = require('config')

function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access Denied, no token provided....')
    console.log(token)

    try{
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        console.log(decoded)
        req.user = decoded;
        next();
    }
    catch(ex) {
        res.status(400).send('Invalid token provided...')
    }
}

module.exports = auth;