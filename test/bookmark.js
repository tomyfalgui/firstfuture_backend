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
const { Region, Province, City } = require('../database');
const cities = require('../docs/locations/refcitymun.json');
const provinces = require('../docs/locations/refprovince.json');
const regions = require('../docs/locations/refregion.json');
const { sequelize } = require('../database');
const newBookmark = require('../docs/json samples/newBookmark.json');
const invalidBookmark = require('../docs/json samples/invalidBookmark.json');

chai.use(chaiHttp);
chai.should();

describe('Bookmarks', function() {
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
    });

    describe('/api/bookmarks/new', function() {
        it('should be able to create a bookmark', function(done) {
            chai.request(app).post('/api/bookmarks/new')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + jwt)
                .send(newBookmark).end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id');
                    res.body.id.should.equal(1);
                    res.body.should.have.property('userId');
                    res.body.should.have.property('jobListingId');
                    done();
                });
        });

        it('should not create a bookmark if job listing does not exist', function(done) {
            chai.request(app).post('/api/bookmarks/new')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + jwt)
                .send(invalidBookmark).end((err, res) => {
                    res.should.have.status(404);
                    res.err.text.should.equal(err);
                    done();
                })
        });

        it('should be not be able to create a bookmark if user is not authorized', function(done) {
            chai.request(app).post('/api/bookmarks/new')
                .set('content-type', 'application/json')
                .send(newBookmark).end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.deep.equal({});
                    res.error.text.should.equal('Unauthorized');
                    done();
                });
        });

        it('should not allow companies to apply to a job listing', function(done) {
            chai.request(app).post('/api/bookmarks/new')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + wrongCompanyJwt)
                .send(newBookmark).end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.deep.equal({});
                    res.error.text.should.equal('Unauthorized');
                    done();
                });
        });
    });

    describe('/api/bookmarks/delete/:id', function() {
        it('should be not be able to delete bookmarks if user is not authorized', function(done) {
            chai.request(app).delete('/api/bookmarks/delete/1')
                .set('content-type', 'application/json')
                .send().end((err, res) => {
                  res.should.have.status(401);
                  res.body.should.deep.equal({});
                  res.error.text.should.equal('Unauthorized');
                  done();
                });
          });
          it('should be not be able to delete bookmarks if the target bookmark does not belong to the user', function(done) {
            chai.request(app).delete('/api/bookmarks/delete/1')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + wrongJwt)
                .send().end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.deep.equal(0);
                  done();
                });
          });
          it('should not allow companies to delete bookmarks', function(done) {
            chai.request(app).delete('/api/bookmarks/delete/1')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + wrongCompanyJwt)
                .send().end((err, res) => {
                  res.should.have.status(401);
                  res.body.should.deep.equal({});
                  res.error.text.should.equal('Unauthorized');
                  done();
                });
          });
          it('should not delete a non-existing bookmark', function(done) {
              chai.request(app).delete('/api/bookmarks/delete/500')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + jwt)
                .send().end((err, res) => {
                    res.should.have.status(400);
                    res.error.text.should.equal(err);
                    done();
                })
          })
          it('should be able to delete bookmarks', function(done) {
            chai.request(app).delete('/api/bookmarks/delete/1')
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
        await sequelize.sync({force: true, truncate: true, cascade: true});
    });
})