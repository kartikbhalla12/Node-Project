
// TDD Approach
//
// create a POST request to /api/returns with a valid customerId and movieId
// set dateReturned and rentalFee in rentals
// restock movie
// send updated rentals document to client
// 
// TEST CASES
//
// return 401 if client is not logged in.
// return 400 if customer id is not provided or invalid.
// return 400 if movie id is not provided or invalid.
// return 404 if the movie doesn't exists for the given id.      // need no to be done as movie and customer
// return 404 if the customer doesn't exists for the given id.   // are already validated when creating rentals
// return 404 if no rental found for the given movie and customer id.
// return 400 if return already processed ( dateReturned and rentalFee already set ).
// return 200 if the return is processed successfully ( set dateReturned and rentalFee and return updated rental ).
// set the return date if input is valid
// calculate and set the rentalFee
// add the movie back to stock
// return the rental




const request = require('supertest')
const mongoose = require('mongoose')
const { User } = require('../../../models/User');
const { Movie } = require('../../../models/Movie');
const Customer = require('../../../models/Customer');
const { Genre } = require('../../../models/Genre');
const { Rental } = require('../../../models/Rental');
const moment = require('moment');


let server, rental, ret, movie;

describe('/api/returns', () => {
    beforeEach(async () => {
        server = require('../../../');

        const genre = new Genre({
            name: 'genre1'
        })
        await genre.save()
        
        movie = new Movie({
            title: 'movie1',
            genre: genre._id,
            numberInStock: 10,
            dailyRentalRate: 5
        })
        await movie.save();

        const customer = new Customer({
            name: 'name1',
            isGold: true,
            phone: 12345
        })
        await customer.save();
       
        
        rental = new Rental({
            customer: customer._id,
            movie: movie._id,

        })
        await rental.save();

        ret = {
            customer: customer._id,
            movie: movie._id,
        }
    });
    afterEach(async () => {
        await server.close();
        await Genre.remove({});
        await Rental.remove({});
        await Movie.remove({});
        await Customer.remove({});
    });
    describe('POST /', () => {

        let token;

        let exec = () => {
            return request(server)
            .post('/api/returns')
            .set('x-auth-token',token)
            .send(ret);
        }

        beforeEach(() => {
            token = new User().generateToken();
        })

        it('should return 401 if client is not logged in.', async () => {

            token = "";
            const res = await exec();

            expect(res.status).toBe(401);
        })

        it('should return 400 if customer id is not provided or invalid.', async () => {
           
            ret.customer = ""
            const res = await exec();

            expect(res.status).toBe(400);
        })

        it('should return 400 if movie id is not provided or invalid.', async () => {
            
            ret.movie = ""
            const res = await exec();

            expect(res.status).toBe(400);
        })
        
        it('return 404 if no rental found for the given movie and customer id..', async () => {
           
            ret = {
                customer: new mongoose.Types.ObjectId(),
                movie: new mongoose.Types.ObjectId()
            }

            const res = await exec();
            
            expect(res.status).toBe(404);
        })

        it('should return 400 if return already processed.', async () => {
            
            rental.dateReturned = Date.now();
            rental.rentalFee = 1
            await rental.save();

            const res = await exec();
            
            expect(res.status).toBe(400);
        })

        
        it('should return 200 if the return is processed successfully.', async () => {
            
            const res = await exec();
            
            expect(res.status).toBe(200);
        })

        it('should set the return date if input is valid ', async () => {
            const res = await exec();

            rentalDB = await Rental.findOne({_id: rental.id});
                
            expect(rentalDB.dateReturned).toBeDefined();

            const diff = Date.now() - rentalDB.dateReturned;
            expect(diff).toBeLessThan(10 * 1000);
        })

        it('should calculate and set the rentalFee ', async () => {

            rental.dateOut = moment().add(-7, 'days').toDate();
            await rental.save();

            const res = await exec();

            rentalDB = await Rental.findOne({_id: rental._id});
            expect(rentalDB.rentalFee).toBe(7 * movie.dailyRentalRate);
        })

        it('should add the movie back to stock ', async () => {

            const res = await exec();

            movieDB = await Movie.findOne({_id: movie._id})  
            expect(movieDB.numberInStock).toBe(movie.numberInStock + 1);
        })

        it('should return the rental ', async () => {

            
            const res = await exec();
            
            rentalDB = await Rental.findOne({_id: rental._id});    
            // expect(res.body).toMatchObject(rentalDB);
            expect(Object.keys(res.body))
                .toEqual(expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie']))
        })
    })
})