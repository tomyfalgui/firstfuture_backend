const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
require('dotenv').config({ path: '../.env' });
const app = require('../index');
const sampleStudent = require('../docs/json samples/signup/user/1.json');
const sampleCompany = require('../docs/json samples/signup/company/1.json');
const validCredentialsStudent = require('../docs/json samples/login/user/1/valid.json');
const validCredentialsCompany = require('../docs/json samples/login/company/1/valid.json');
const invalidCredentialsStudent = require('../docs/json samples/login/user/1/invalid.json');
const invalidCredentialsCompany = require('../docs/json samples/login/company/1/invalid.json');
const { sequelize, User, Company } = require('../database');
const { Region, Province, City } = require('../database');
const cities = require('../docs/locations/refcitymun.json');
const provinces = require('../docs/locations/refprovince.json');
const regions = require('../docs/locations/refregion.json');
const processMessage = require('../email-parser.js');

chai.use(chaiHttp);
chai.should();

describe('User', function() {
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

    describe('/api/auth/signup/user', () => {
        it('should create a user when data is posted', function(done) {
            // eslint-disable-next-line no-invalid-this
            this.timeout(7000);
            chai.request(app).post('/api/auth/signup/user').set('content-type', 'application/json')
                .send(sampleStudent).end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.equal(true);
                    done();
                });
        });

        it('should not create a user if the email address already exists', function(done) {
            chai.request(app).post('/api/auth/signup/user').set('content-type', 'application/json')
                .send(sampleStudent).end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.name.should.equal('SequelizeUniqueConstraintError');
                    res.body.should.have.property('errors');
                    res.body.errors[0].should.have.property('message');
                    res.body.errors[0].message.should.equal('Email address already in use!');
                    done();
                });
        });

        it('should only create one entry in the database', function() {
            return User.count({ where: { email: sampleStudent.user.email } }).should.eventually.equal(1);
        });
    });

    describe('/api/auth/verify/student', () => {
        it('verify email', function(done) {
            chai.request(app).post('/api/auth/verify/student').set('content-type', 'application/json')
                .send().end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('token');
                    res.body.token.should.equal(processMessage);
                    done();
                });
        });

        describe('/api/auth/login/user', () => {
            it('should be able to login with the given credentials', function(done) {
                chai.request(app).post('/api/auth/login/user').set('content-type', 'application/json')
                    .send(validCredentialsStudent).end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('user');
                        res.body.user.should.have.property('id');
                        res.body.should.have.property('token');
                        done();
                    });
            });

            it('should not be able to login with the incorrect credentials', function(done) {
                chai.request(app).post('/api/auth/login/user').set('content-type', 'application/json')
                    .send(invalidCredentialsStudent).end((err, res) => {
                        res.should.have.status(400);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('message');
                        res.body.message.should.equal('Something is not right');
                        res.body.should.have.property('user');
                        res.body.user.should.equal(false);
                        done();
                    });
            });
        });
    });

    describe('Companies', function() {
        describe('/api/auth/signup/company', () => {
            it('should create a company when data is posted', function(done) {
                chai.request(app).post('/api/auth/signup/company').set('content-type', 'application/json')
                    .send(sampleCompany).end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.equal(true);
                        done();
                    });
            });

            it('should not create a company if the email address already exists', function(done) {
                chai.request(app).post('/api/auth/signup/company').set('content-type', 'application/json')
                    .send(sampleCompany).end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('name');
                        res.body.name.should.equal('SequelizeUniqueConstraintError');
                        res.body.should.have.property('errors');
                        res.body.errors[0].should.have.property('message');
                        res.body.errors[0].message.should.equal('Email address already in use!');
                        done();
                    });
            });

            it('should only create one entry in the database', function() {
                return Company.count({ where: { email: sampleCompany.email } }).should.eventually.equal(1);
            });
        });

        describe('/api/auth/verify/company', () => {
            it('verify email', function(done) {
                chai.request(app).post('/api/auth/verify/student').set('content-type', 'application/json')
                    .send().end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.have.property('token');
                        res.body.token.should.equal(processMessage);
                        done();
                    });
            });
            describe('/api/auth/signup/company', () => {
                it('should be able to login with the given credentials', function(done) {
                    chai.request(app).post('/api/auth/login/company').set('content-type', 'application/json')
                        .send(validCredentialsCompany).end((err, res) => {
                            res.should.have.status(200);
                            res.should.be.json;
                            res.body.should.be.a('object');
                            res.body.should.have.property('user');
                            res.body.user.should.have.property('id');
                            res.body.should.have.property('token');
                            done();
                        });
                });

                it('should not be able to login with the incorrect credentials', function(done) {
                    chai.request(app).post('/api/auth/login/company').set('content-type', 'application/json')
                        .send(invalidCredentialsCompany).end((err, res) => {
                            res.should.have.status(400);
                            res.should.be.json;
                            res.body.should.be.a('object');
                            res.body.should.have.property('message');
                            res.body.message.should.equal('Something is not right');
                            res.body.should.have.property('user');
                            res.body.user.should.equal(false);
                            done();
                        });
                });
            });

            after('testing, clear database', async function() {
                await sequelize.sync({ force: true, truncate: true, cascade: true });
            });
        });
    });
});