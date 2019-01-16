const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
require('dotenv').config({ path: '../.env' });
const app = require('../index');
const wrongStudent = require('../docs/json samples/signup/user/2.json');
const validCredentialsWrongStudent = require('../docs/json samples/login/user/2/valid.json');
const sampleCompany = require('../docs/json samples/signup/company/1.json');
const validCredentialsCompany = require('../docs/json samples/login/company/1/valid.json');
const wrongCompany = require('../docs/json samples/signup/company/2.json');
const validCredentialsWrongCompany = require('../docs/json samples/login/company/2/valid.json');
const newListing = require('../docs/json samples/newListing.json');
const { Region, Province, City } = require('../database');
const cities = require('../docs/locations/refcitymun.json');
const provinces = require('../docs/locations/refprovince.json');
const regions = require('../docs/locations/refregion.json');
const { sequelize } = require('../database');
const processMessage = require('../email-parser.js');


chai.use(chaiHttp);
chai.should();

describe('Listings', function() {
    let jwt;
    let wrongJwt;
    let wrongUserJwt;

    before('testing, clear database', async function() {
        await sequelize.sync({ force: true, truncate: true, cascade: true })
            .then(() => {
                const locations = [Region, Province, City];
                const data = [regions, provinces, cities];

                for (let i = 0; i < locations.length; i++) {
                    locations[i].bulkCreate(data[i].RECORDS);
                }
            });
    });

    before('testing, create profile', (done) => {
        chai.request(app).post('/api/auth/signup/company')
            .set('content-type', 'application/json')
            .send(sampleCompany).end((err, res) => {
                done();
            });
    });

    before('testing, create second profile to check if access constraints are in place', (done) => {
        chai.request(app).post('/api/auth/signup/company')
            .set('content-type', 'application/json')
            .send(wrongCompany).end((err, res) => {
                done();
            });
    });

    before('testing, create user profile to ensure company and user profiles are segregated', (done) => {
        chai.request(app).post('/api/auth/signup/user')
            .set('content-type', 'application/json')
            .send(wrongStudent).end((err, res) => {
                done();
            });
    });

    before('testing', 'verify email for company', (done) => {
        chai.request(app).post('/api/auth/verify/company')
            .set('content-type', 'application/json')
            .send().end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('token');
                res.body.token.should.equal(processMessage);
                done();
            });
    });
    before('testing, login', (done) => {
        chai.request(app).post('/api/auth/login/company')
            .set('content-type', 'application/json')
            .send(validCredentialsCompany).end((err, res) => {
                jwt = res.body.token;
                done();
            });
    });

    before('testing, login the second account for checking access constraints', (done) => {
        chai.request(app).post('/api/auth/login/company')
            .set('content-type', 'application/json')
            .send(validCredentialsWrongCompany).end((err, res) => {
                wrongJwt = res.body.token;
                done();
            });
    });

    before('testing', 'verify email for user', (done) => {
        chai.request(app).post('/api/auth/verify/student')
            .set('content-type', 'application/json')
            .send().end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('token');
                res.body.token.should.equal(processMessage);
                done();
            });
    });

    before('testing, login the company account to check if user and company profiles are segregated', (done) => {
        chai.request(app).post('/api/auth/login/user')
            .set('content-type', 'application/json')
            .send(validCredentialsWrongStudent).end((err, res) => {
                wrongUserJwt = res.body.token;
                done();
            });
    });

    describe('/api/listings/new', function() {
        it('should be able to create new listings', function(done) {
            chai.request(app).post('/api/listings/new')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + jwt)
                .send(newListing).end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id');
                    res.body.id.should.equal(1);
                    res.body.should.have.property('strands');
                    res.body.strands.should.deep.equal([1, 2, 3]);
                    res.body.should.have.property('position');
                    res.body.position.should.equal('Web Developer Intern');
                    res.body.should.have.property('description');
                    res.body.description.should.equal('You will be working to develop an app to do app things');
                    res.body.should.have.property('deadline');
                    res.body.deadline.should.equal('2018-11-22T08:37:22.000Z');
                    res.body.should.have.property('companyId');
                    res.body.companyId.should.equal(1);
                    res.body.should.have.property('category');
                    res.body.category.should.equal(5);
                    done();
                });
        });

        it('should be not be able to create new listings if user is not authorized', function(done) {
            chai.request(app).post('/api/listings/new')
                .set('content-type', 'application/json')
                .send(newListing).end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.deep.equal({});
                    res.error.text.should.equal('Unauthorized');
                    done();
                });
        });

        it('should be not allow users to create listings', function(done) {
            chai.request(app).post('/api/listings/new')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + wrongUserJwt)
                .send(newListing).end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.deep.equal({});
                    res.error.text.should.equal('Unauthorized');
                    done();
                });
        });
    });

    describe('/api/listings/edit', function() {
        it('should be able to edit listings', function(done) {
            chai.request(app).post('/api/listings/edit')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + jwt)
                .send({ id: 1, deltas: { position: 'Front-end Web Developer Intern', description: 'Will front-end' } }).end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.deep.equal([1]);
                    done();
                });
        });
        it('should be not be able to edit listings if user is not authorized', function(done) {
            chai.request(app).post('/api/listings/edit')
                .set('content-type', 'application/json')
                .send({ id: 1, deltas: { position: 'Front-end Web Developer Intern', description: 'Will front-end' } }).end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.deep.equal({});
                    res.error.text.should.equal('Unauthorized');
                    done();
                });
        });
        it('should be not be able to edit listings if the target listing does not belong to the user', function(done) {
            chai.request(app).post('/api/listings/edit')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + wrongJwt)
                .send({ id: 1, deltas: { position: 'Front-end Web Developer Intern', description: 'Will front-end' } }).end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.deep.equal([0]);
                    done();
                });
        });
        it('should be not allow users to edit listings', function(done) {
            chai.request(app).post('/api/listings/edit')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + wrongUserJwt)
                .send({ id: 1, deltas: { position: 'Front-end Web Developer Intern', description: 'Will front-end' } }).end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.deep.equal({});
                    res.error.text.should.equal('Unauthorized');
                    done();
                });
        });
    });
    describe('/api/listings/delete/:id', function() {
        it('should be not be able to delete listings if user is not authorized', function(done) {
            chai.request(app).delete('/api/listings/delete/1')
                .set('content-type', 'application/json')
                .send().end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.deep.equal({});
                    res.error.text.should.equal('Unauthorized');
                    done();
                });
        });
        it('should be not be able to delete listings if the target listing does not belong to the user', function(done) {
            chai.request(app).delete('/api/listings/delete/1')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + wrongJwt)
                .send().end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.deep.equal(0);
                    done();
                });
        });
        it('should not allow users to delete listings', function(done) {
            chai.request(app).delete('/api/listings/delete/1')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + wrongUserJwt)
                .send().end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.deep.equal({});
                    res.error.text.should.equal('Unauthorized');
                    done();
                });
        });
        it('should be able to delete listings', function(done) {
            chai.request(app).delete('/api/listings/delete/1')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + jwt)
                .send().end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.equal(1);
                    done();
                });
        });
    });


    after('testing, clear database', async function() {
        await sequelize.sync({ force: true, truncate: true, cascade: true });
    });
});