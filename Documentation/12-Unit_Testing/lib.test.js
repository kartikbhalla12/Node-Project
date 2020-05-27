absolute = (number) => {
	return number >= 0 ? number : -number;
};

greet = (name) => `Welcome ${name}!`;

getCurrencies = () => ['INR', 'USD', 'EUR'];

getProduct = function (productId) {
	return { id: productId, price: 10 };
};

getUser = function (username) {
	if (!username) throw new Error('invalid username');
	return { id: new Date().getTime(), username };
};
const db = { getCustomerSync() {} };
const mail = { send() {} };
applyDiscount = function (order) {
	const customer = db.getCustomerSync(order.customerId);
	if (customer.points > 10) order.totalPrice *= 0.9;
};

notifyCustomer = function (order) {
	const customer = db.getCustomerSync(order.customerId);

	mail.send(customer.email, 'Your order was placed successfully');
};

describe('absolute', () => {
	it('should return a positive number if the input is positive', () => {
		const result = absolute(1);
		expect(result).toBe(1);
	});

	it('should return a positive number if the input is negative', () => {
		const result = absolute(-1);
		expect(result).toBe(1);
	});

	it('should return a 0 if the input is 0', () => {
		const result = absolute(0);
		expect(result).toBe(0);
	});
});

describe('greet', () => {
	it('should return the greeting message', () => {
		const result = greet('name');
		expect(result).toContain('name');
	});
});

describe('getCurrencies', () => {
	const result = getCurrencies();
	it('should return supported currencies', () => {
		expect(result).toEqual(expect.arrayContaining(['INR', 'USD', 'EUR']));
	});
});

describe('getProduct', () => {
	it('should return the product with the given id', () => {
		const result = getProduct(1);
		expect(result).toEqual({ id: 1, price: 10 });
	});
});

describe('getUser', () => {
	it('should throw an exception when username is falsy', () => {
		const args = [null, NaN, undefined, '', 0, false];
		args.forEach((arg) => {
			expect(() => getUser(arg)).toThrow();
		});
	});

	it('should return a user object when username is valid', () => {
		const result = getUser('name');
		expect(result).toHaveProperty('id');
		expect(result.id).toBeGreaterThan(0);
		expect(result).toMatchObject({ username: 'name' });
	});
});

describe('applyDiscount', () => {
	it('should apply 10% discount if the customer has more than 10 points', () => {
		db.getCustomerSync = function (customerId) {
			return { id: customerId, points: 20 };
		};
		const order = { customerId: 1, totalPrice: 10 };
		applyDiscount(order);
		expect(order.totalPrice).toBe(9);
	});
});
describe('notifyCustomers', () => {
	it('should send an email to the customer', () => {
		db.getCustomerSync = jest.fn().mockReturnValue({ email: 'a' });
		mail.send = jest.fn();

		notifyCustomer({ customerId: 1 });

		expect(mail.send).toHaveBeenCalled();
	});
});
