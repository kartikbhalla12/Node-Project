const { User } = require('../../../models/User');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');

describe('auth middleware', () => {

    it('should populate req.user with the payload of valid JWT', () => {
        id = new mongoose.Types.ObjectId();
        const user = {
            _id: id.toHexString(),
            isAdmin: true
        }
        const token = new User(user).generateToken();
        const req = {
            header: jest.fn().mockReturnValue(token)
        };
        const res = {};
        const next = jest.fn();
        auth(req, res, next)

        expect(req.user).toBeDefined();
        expect(req.user).toMatchObject(user);
    })
})