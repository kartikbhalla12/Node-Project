const request = require('supertest');
const { Genre } = require('../../../models/Genre');
const { User } = require('../../../models/User');
const mongoose = require('mongoose');

let server;

describe('/api/genres', () => {
    beforeEach(() => {
        server = require('../../../index');
    });
    afterEach(async () => {
        await server.close();
        await Genre.remove({});
    });
    describe('GET /', () => {
        it('should return all genres', async () => {
            // const genre = new Genre({
            //     name: "Horror"
            // })
            // await genre.save();
            await Genre.collection.insertMany([           //inserts more than 1 documents in database.
                {
                    name: "genre1"
                },
                {
                    name: "genre2"
                }
            ]);
            
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        })
    });

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({
                name: 'genre1'
            });
            await genre.save();
            const res = await request(server).get(`/api/genres/${genre._id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid id is provided', async () => {
            const res = await request(server).get(`/api/genres/1`);
            expect(res.status).toBe(404);
        });

        it('should return 404 if genre doesn\'t exist for the given valid id', async () => {
            const id = new mongoose.Types.ObjectId();
            const genre = new Genre({
                name: 'genre1'
            });
            await genre.save();
            const res = await request(server).get(`/api/genres/${id}`);
            expect(res.status).toBe(404);
            
        });
    });

    describe('POST /', () => {

        //Clean Tests - Define the happy path and then in each test, we change one parameter that clearly aligns with the name of the test.

        let token;
        let name;
        let exec = () => {
            return request(server)
            .post('/api/genres')
            .send({ name })
            .set('x-auth-token',token);
        };

        beforeEach(() => {
            token = new User().generateToken();
            name = 'genre1';
        });

        it('should return 401 if the user is not logged in', async() => {
            token ="";
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if the genre is less than 5 characters', async () => {
            
            name = '1234' 
            const res = await exec();
            
            expect(res.status).toBe(400);
        });

        it('should return 400 if the genre is greater than 50 characters', async () => {
            name = new Array(55).join('a');
            const res = await exec();
            
            expect(res.status).toBe(400);
        });

        it('should return 200 and save the genre if it is valid', async() => {
            const res = await exec();

            const genre = await Genre.findOne({ name });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', genre.name);

        });
    });

    describe('PUT /:id', () => {

        let token;
        let name;
        let genre;
        let id;
        let exec = async () => {
            return await request(server)
            .put(`/api/genres/${id}`)
            .send({ name })
            .set('x-auth-token',token);
        };

        beforeEach(async () => {
            token = new User().generateToken();
            name = 'genre2';
            await new Genre({ name: 'genre1'}).save();
            genre = await Genre.findOne({name: 'genre1'});
            id=genre.id;
        });


        it('should return 401 if the user is not logged in', async() => {
            token = "";
            
            // let genre = new Genre({ name: 'genre1'});            //before refractoring
            // await genre.save();
            // genre = await Genre.findOne({name: 'genre1'});

            // const res = await request(server)
            //     .put(`/api/genres/${genre._id}`)
            //     .send({ name: "genre2"})
            //     .set('x-auth-token', token)

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 404 if invalid id is provided', async () => {
            
            id=1;

            const res = await exec();
            expect(res.status).toBe(404);
        });


        it('should return 404 if genre doesn\'t exist for the given valid id', async () => {
            id = new mongoose.Types.ObjectId();
            
            const res = await exec();
            expect(res.status).toBe(404);
            
        });

        it('should return 400 if the genre is less than 5 characters', async () => {
            
            name = '1234';

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if the genre is greater than 50 characters', async () => {
            
            name = new Array(55).join('a');

            const res = await exec();
            expect(res.status).toBe(400);
        });
        
        it('should return a 200 status if genre is updated successfully', async ()=> {
            
            const res = await exec();

            expect(res.status).toBe(200);
        });
    });

    describe('DELETE /:id', () => {
        
        let token;
        let name;
        let genre;
        let id;
        let exec = async () => {
            return await request(server)
            .delete(`/api/genres/${id}`) //TODO: 
            .send({ name })
            .set('x-auth-token',token);
        };

        beforeEach(async () => {
            user = new User({
                name: "user1",
                isAdmin: true,
            }) 
            token = new User(user).generateToken();
            name = 'genre2';
            await new Genre({ name: 'genre1'}).save();
            genre = await Genre.findOne({name: 'genre1'});
            id=genre.id;
        });


        it('should return 401 if the user is not logged in', async() => {
            token = "";
            
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 404 if invalid id is provided', async () => {
            
            id=1;

            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should return 403 status if the user is not an admin', async () => {
            
            user = new User({
                name: "user1",
                isAdmin: false,
            }) 
            token = new User(user).generateToken();

            const res = await exec();
            expect(res.status).toBe(403);
        })


        it('should return 404 if genre doesn\'t exist for the given valid id', async () => {
            id = new mongoose.Types.ObjectId();

            const res = await exec();
            expect(res.status).toBe(404);
            
        });

        it('should return 200 status if genre is deleted successfully', async () => {

            const res = await exec();
            expect(res.status).toBe(200);
            
        });

    })

});