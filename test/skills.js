const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
require('dotenv').config({ path: '../.env' });
const app = require('../index');
const sampleStudent = require('../docs/json samples/signup/user/1.json');
const validCredentialsStudent = require('../docs/json samples/login/user/1/valid.json');
const wrongStudent = require('../docs/json samples/signup/user/2.json');
const validCredentialsWrongStudent = require('../docs/json samples/login/user/2/valid.json');
const wrongCompany = require('../docs/json samples/signup/company/1.json');
const validCredentialsWrongCompany = require('../docs/json samples/login/company/1/valid.json');
const newSkill = require('../docs/json samples/newSkill.json');
const { Region, Province, City } = require('../database');
const cities = require('../docs/locations/refcitymun.json');
const provinces = require('../docs/locations/refprovince.json');
const regions = require('../docs/locations/refregion.json');
const { sequelize } = require('../database');
const processMessage = require('../email-parser.js');


chai.use(chaiHttp);
chai.should();

describe('Skills', function() {
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

    before('testing, login the company account to check if user and company profiles are segregated', (done) => {
        chai.request(app).post('/api/auth/login/company')
            .set('content-type', 'application/json')
            .send(validCredentialsWrongCompany).end((err, res) => {
                wrongCompanyJwt = res.body.token;
                done();
            });
    });

    describe('/api/skills/new', function() {
        it('should be able to create new skills', function(done) {
            chai.request(app).post('/api/skills/new')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + jwt)
                .send(newSkill).end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id');
                    res.body.id.should.equal(5);
                    res.body.should.have.property('name');
                    res.body.name.should.equal('node.js');
                    res.body.should.have.property('description');
                    res.body.description.should.equal('Can write RESTful services in node.js');
                    res.body.should.have.property('rating');
                    res.body.rating.should.equal(5);
                    res.body.should.have.property('userId');
                    res.body.userId.should.equal(1);
                    done();
                });
        });

        it('should be not be able to create new skills if user is not authorized', function(done) {
            chai.request(app).post('/api/skills/new')
                .set('content-type', 'application/json')
                .send(newSkill).end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.deep.equal({});
                    res.error.text.should.equal('Unauthorized');
                    done();
                });
        });

        it('should be not allow companies to create skills', function(done) {
            chai.request(app).post('/api/skills/new')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + wrongCompanyJwt)
                .send(newSkill).end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.deep.equal({});
                    res.error.text.should.equal('Unauthorized');
                    done();
                });
        });
    });

    describe('/api/skills/edit', function() {
        it('should be able to edit skills', function(done) {
            chai.request(app).post('/api/skills/edit')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + jwt)
                .send({ id: 5, deltas: { name: 'Express.js', description: 'Can use express to write RESTful web services' } }).end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.deep.equal([1]);
                    done();
                });
        });
        it('should be not be able to edit skills if user is not authorized', function(done) {
            chai.request(app).post('/api/skills/edit')
                .set('content-type', 'application/json')
                .send({ id: 5, deltas: { name: 'Express.js', description: 'Can use express to write RESTful web services' } }).end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.deep.equal({});
                    res.error.text.should.equal('Unauthorized');
                    done();
                });
        });

        it('should be not be able to edit skills if the target skill does not belong to the user', function(done) {
            chai.request(app).post('/api/skills/edit')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + wrongJwt)
                .send({ id: 5, deltas: { name: 'Express.js', description: 'Can use express to write RESTful web services' } }).end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.deep.equal([0]);
                    done();
                });
        });
        it('should be not allow companies to edit skills', function(done) {
            chai.request(app).post('/api/skills/edit')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + wrongCompanyJwt)
                .send({ id: 5, deltas: { name: 'Express.js', description: 'Can use express to write RESTful web services' } }).end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.deep.equal({});
                    res.error.text.should.equal('Unauthorized');
                    done();
                });
        });
    });
    describe('/api/skills/delete/:id', function() {
        it('should be not be able to delete skills if user is not authorized', function(done) {
            chai.request(app).delete('/api/skills/delete/1')
                .set('content-type', 'application/json')
                .send().end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.deep.equal({});
                    res.error.text.should.equal('Unauthorized');
                    done();
                });
        });
        it('should be not be able to delete skills if the target skill does not belong to the user', function(done) {
            chai.request(app).delete('/api/skills/delete/1')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + wrongJwt)
                .send().end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.deep.equal(0);
                    done();
                });
        });
        it('should not allow companies to delete skills', function(done) {
            chai.request(app).delete('/api/skills/delete/1')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + wrongCompanyJwt)
                .send().end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.deep.equal({});
                    res.error.text.should.equal('Unauthorized');
                    done();
                });
        });
        it('should be able to delete skills', function(done) {
            chai.request(app).delete('/api/skills/delete/1')
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