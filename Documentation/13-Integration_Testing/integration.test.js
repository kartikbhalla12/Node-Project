const request = require('supertest');
const { Genre } = require('../../models/Genre');
const { User } = require('../../models/User');

let server;
describe('api/genres', () => {
	beforeEach(() => {
		server = require('../../index');
	});
	afterEach(async () => {
		server.close();
		await Genre.remove({});
	});

	describe('GET /', () => {
		it('should return all the genres', async () => {
			await Genre.collection.insertMany([
				{ name: 'genre1' },
				{ name: 'genre2' },
				{ name: 'genre3' },
			]);

			const res = await request(server).get('/api/genres');
			expect(res.status).toBe(200);
			expect(res.body.length).toBe(3);
			expect(res.body.find((g) => g.name === 'genre1')).toBeTruthy();
		});
	});

	describe('GET /:id', () => {
		it('should return a genre if valid id is passed', async () => {
			const genre = new Genre({ name: 'genre1' });
			await genre.save();
			const res = await request(server).get(`/api/genres/${genre.id}`);
			expect(res.body).toHaveProperty('name', 'genre1');
		});

		it('should return 404 if invalid id is passed', async () => {
			const res = await request(server).get(`/api/genres/1`);
			expect(res.status).toBe(404);
		});
	});

	describe('POST /', () => {
		it('should return 401 if the client is not logged in', async () => {
			const res = await request(server)
				.post('/api/genres')
				.send({ name: 'genre1' });

			expect(res.status).toBe(401);
		});

		it('should return 400 if the genre is less than 5 characters', async () => {
			const token = new User().generateToken();

			const res = await request(server)
				.post('/api/genres')
				.set('x-auth-token', token)
				.send({ name: '123' });

			expect(res.status).toBe(400);
		});

		it('should return 400 if the genre is less than 5 characters', async () => {
			const token = new User().generateToken();

			const res = await request(server)
				.post('/api/genres')
				.set('x-auth-token', token)
				.send({ name: new Array(52).join('a') });

			expect(res.status).toBe(400);
		});

		it('should save genre if it is valid', async () => {
			const token = new User().generateToken();

			const res = await request(server)
				.post('/api/genres')
				.set('x-auth-token', token)
				.send({ name: 'genre1' });

			expect(res.status).toBe(200);

			const genre = await Genre.findOne({ name: 'genre1' });
			expect(genre).not.toBe(null);
		});

		it('should return the genre if it is valid', async () => {
			const token = new User().generateToken();

			const res = await request(server)
				.post('/api/genres')
				.set('x-auth-token', token)
				.send({ name: 'genre1' });

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('_id');
			expect(res.body).toHaveProperty('name', 'genre1');
		});
	});
});
