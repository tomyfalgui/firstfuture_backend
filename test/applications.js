const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
require('dotenv').config({ path: '../.env' });
const app = require('../index');
const sampleStudent = require('../docs/json samples/signup/user/1.json');
const sampleListing = require('../docs/json samples/newListing.json');
const validCredentialsStudent = require('../docs/json samples/login/user/1/valid.json');
const wrongStudent = require('../docs/json samples/signup/user/2.json');
const validCredentialsWrongStudent = require('../docs/json samples/login/user/2/valid.json');
const wrongCompany = require('../docs/json samples/signup/company/1.json');
const validCredentialsWrongCompany = require('../docs/json samples/login/company/1/valid.json');
const newWorkExperience = require('../docs/json samples/newWorkExperience.json');
const { Region, Province, City } = require('../database');
const cities = require('../docs/locations/refcitymun.json');
const provinces = require('../docs/locations/refprovince.json');
const regions = require('../docs/locations/refregion.json');
const { sequelize } = require('../database');
const newApplication = require('../docs/json samples/newApplication.json');

chai.use(chaiHttp);
chai.should();

describe('Applications', function() {
    let jwt;
    let wrongJwt;
    let wrongCompanyJwt;

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
        chai.request(app).post('/api/auth/signup/user')
            .set('content-type', 'application/json')
            .send(sampleStudent).end((err, res) => {
                done();
            });
    });

    before('testing, create second profile to check if access constraints are in place', (done) => {
        chai.request(app).post('/api/auth/signup/user')
            .set('content-type', 'application/json')
            .send(wrongStudent).end((err, res) => {
                done();
            });
    });

    before('testing, create company profile to ensure company and user profiles are segregated', (done) => {
        chai.request(app).post('/api/auth/signup/company')
            .set('content-type', 'application/json')
            .send(wrongCompany).end((err, res) => {
                done();
            });
    });

    before('testing, login', (done) => {
        chai.request(app).post('/api/auth/login/user')
            .set('content-type', 'application/json')
            .send(validCredentialsStudent).end((err, res) => {
                jwt = res.body.token;
                done();
            });
    });

    before('testing, login the second account for checking access constraints', (done) => {
        chai.request(app).post('/api/auth/login/user')
            .set('content-type', 'application/json')
            .send(validCredentialsWrongStudent).end((err, res) => {
                wrongJwt = res.body.token;
                done();
            });
    });

    before('testing, login the company account to check if user and company profiles are segregated', (done) => {
        chai.request(app).post('/api/auth/login/company')
            .set('content-type', 'application/json')
            .send(validCredentialsWrongCompany).end((err, res) => {
                wrongCompanyJwt = res.body.token;
                done();
            });
    });

    
    before('testing, create listing', (done) => {
        chai.request(app).post('/api/listings/new')
            .set('content-type', 'application/json')
            .set('Authorization', 'Bearer ' + jwt)
            .send(sampleListing).end((err, res) => {
                done();
            });
    })

    describe('/api/applications/new', function() {
        it('should be able to create new job application', function(done) {
            chai.request(app).post('/api/applications/new')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + jwt)
                .send(newApplication).end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id');
                    res.body.id.should.equal(1);
                    res.body.should.have.property('userId');
                    res.body.name.should.equal(1);
                    res.body.should.have.property('jobListingId');
                    res.body.speakingRating.should.equal(1);
                    res.body.should.have.property('status');
                    res.body.writingRating.should.equal(1);
                    done();
                });
        });

        it('should be not be able to create new job applicationif user is not authorized', function(done) {
            chai.request(app).post('/api/applications/new')
                .set('content-type', 'application/json')
                .send(newApplication).end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.deep.equal({});
                    res.error.text.should.equal('Unauthorized');
                    done();
                });
        });

        it('should not allow companies to apply to a job listing', function(done) {
            chai.request(app).post('/api/applications/new')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + wrongCompanyJwt)
                .send(newApplication).end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.deep.equal({});
                    res.error.text.should.equal('Unauthorized');
                    done();
                });
        });
    });

    //edit
    describe('/api/applications/edit', function() {
        it('should be able to edit applications', function(done) {
            chai.request(app).post('/api/applications/edit')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + jwt)
                .send({ id: 1, deltas: { status: 2 } }).end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.deep.equal([1]);
                    done();
                });
        });
        it('should be not be able to edit applications if user is not authorized', function(done) {
            chai.request(app).post('/api/applications/edit')
                .set('content-type', 'application/json')
                .send({ id: 1, deltas: { status: 2 } }).end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.deep.equal({});
                    res.error.text.should.equal('Unauthorized');
                    done();
                });
        });
        it('should be not be able to edit applications if the target applications does not belong to the user', function(done) {
            chai.request(app).post('/api/applications/edit')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + wrongJwt)
                .send({ id: 1, deltas: { status: 2 } }).end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.deep.equal([0]);
                    done();
                });
        });
        it('should be not allow companies to edit applications', function(done) {
            chai.request(app).post('/api/applications/edit')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + wrongCompanyJwt)
                .send({ id: 1, deltas: { status: 2 } }).end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.deep.equal({});
                    res.error.text.should.equal('Unauthorized');
                    done();
                });
        });
    });

    //delete
    describe('/api/applications/delete/:id', function() {
        it('should be not be able to delete applications if user is not authorized', function(done) {
            chai.request(app).delete('/api/applications/delete/1')
                .set('content-type', 'application/json')
                .send().end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.deep.equal({});
                    res.error.text.should.equal('Unauthorized');
                    done();
                });
        });
        it('should be not be able to delete applications if the target skill does not belong to the user', function(done) {
            chai.request(app).delete('/api/applications/delete/1')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + wrongJwt)
                .send().end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.deep.equal(0);
                    done();
                });
        });
        it('should not allow companies to delete applications', function(done) {
            chai.request(app).delete('/api/applications/delete/1')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + wrongCompanyJwt)
                .send().end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.deep.equal({});
                    res.error.text.should.equal('Unauthorized');
                    done();
                });
        });
        it('should be able to delete applications', function(done) {
            chai.request(app).delete('/api/applications/delete/1')
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