const { User } = require('../../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose')



describe('User.generateAuthToken', () => {
    it('should return a valid JWT', () => {
        const id = new mongoose.Types.ObjectId();
        const user = new User({
            _id: id,
            isAdmin: true
        })
        const token = user.generateToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey')); //config needs a test.json for Jest 
        expect(decoded).toMatchObject({
            _id: id.toHexString(),  //JWT converts objectId to HEX
            isAdmin: true
        })
    })
})