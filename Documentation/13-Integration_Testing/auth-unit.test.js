const auth = require('../../middleware/auth');
const { User } = require('../../models/User');
const mongoose = require('mongoose');

describe('auth middleware', () => {
	it('should populate the req.user with payload of a valid JWT', () => {
		const user = {
			_id: mongoose.Types.ObjectId().toHexString(),
			isAdmin: true,
		};

		const token = new User(user).generateToken();
		req = {
			header: jest.fn().mockReturnValue(token),
		};
		res = {};
		next = jest.fn();
		auth(req, res, next);

		expect(req.user).toMatchObject(user);
	});
});
