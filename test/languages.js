const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
require('dotenv').config({path: '../.env'});
const app = require('../index');
const sampleStudent = require('../docs/json samples/signup/user/1.json');
const validCredentialsStudent = require('../docs/json samples/login/user/1/valid.json');
const wrongStudent = require('../docs/json samples/signup/user/2.json');
const validCredentialsWrongStudent = require('../docs/json samples/login/user/2/valid.json');
const wrongCompany = require('../docs/json samples/signup/company/1.json');
const validCredentialsWrongCompany = require('../docs/json samples/login/company/1/valid.json');
const newLanguage = require('../docs/newLanguage.json');

const {sequelize} = require('../database');

chai.use(chaiHttp);
chai.should();

describe('Languages', function() {
  let jwt; let wrongJwt; let wrongCompanyJwt;

  before('testing, clear database', async function() {
    await sequelize.sync({force: true, truncate: true, cascade: true});
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

  describe('/api/languages/new', function() {
    it('should be able to create new languages', function(done) {
      chai.request(app).post('/api/languages/new')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + jwt)
          .send(newLanguage).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('id');
            res.body.id.should.equal(7);
            res.body.should.have.property('name');
            res.body.name.should.equal('Bahasa');
            res.body.should.have.property('speakingRating');
            res.body.speakingRating.should.equal(5);
            res.body.should.have.property('writingRating');
            res.body.writingRating.should.equal(5);
            res.body.should.have.property('readingRating');
            res.body.readingRating.should.equal(5);
            res.body.should.have.property('userId');
            res.body.userId.should.equal(1);
            done();
          });
    });

    it('should be not be able to create new languages if user is not authorized', function(done) {
      chai.request(app).post('/api/languages/new')
          .set('content-type', 'application/json')
          .send(newLanguage).end((err, res) => {
            res.should.have.status(401);
            res.body.should.deep.equal({});
            res.error.text.should.equal('Unauthorized');
            done();
          });
    });

    it('should be not allow companies to create languages', function(done) {
      chai.request(app).post('/api/languages/new')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + wrongCompanyJwt)
          .send(newLanguage).end((err, res) => {
            res.should.have.status(401);
            res.body.should.deep.equal({});
            res.error.text.should.equal('Unauthorized');
            done();
          });
    });
  });

  describe('/api/languages/edit', function() {
    it('should be able to edit languages', function(done) {
      chai.request(app).post('/api/languages/edit')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + jwt)
          .send({id: 7, deltas: {speakingRating:4,  readingRating:4}}).end((err, res) => {
            res.should.have.status(200);
            res.body.should.deep.equal([1]);
            done();
          });
    });
    it('should be not be able to edit languages if user is not authorized', function(done) {
      chai.request(app).post('/api/languages/edit')
          .set('content-type', 'application/json')
          .send({id: 7, deltas: {speakingRating:4,  readingRating:4}}).end((err, res) => {
            res.should.have.status(401);
            res.body.should.deep.equal({});
            res.error.text.should.equal('Unauthorized');
            done();
          });
    });
    it('should be not be able to edit languages if the target languages does not belong to the user', function(done) {
      chai.request(app).post('/api/languages/edit')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + wrongJwt)
          .send({id: 7, deltas: {speakingRating:4,  readingRating:4}}).end((err, res) => {
            res.should.have.status(200);
            res.body.should.deep.equal([0]);
            done();
          });
    });
    it('should be not allow companies to edit languages', function(done) {
      chai.request(app).post('/api/languages/edit')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + wrongCompanyJwt)
          .send({id: 7, deltas: {speakingRating:4,  readingRating:4}}).end((err, res) => {
            res.should.have.status(401);
            res.body.should.deep.equal({});
            res.error.text.should.equal('Unauthorized');
            done();
          });
    });
  });
  describe('/api/languages/delete/:id', function() {
    it('should be not be able to delete languages if user is not authorized', function(done) {
      chai.request(app).delete('/api/languages/delete/1')
          .set('content-type', 'application/json')
          .send().end((err, res) => {
            res.should.have.status(401);
            res.body.should.deep.equal({});
            res.error.text.should.equal('Unauthorized');
            done();
          });
    });
    it('should be not be able to delete languages if the target skill does not belong to the user', function(done) {
      chai.request(app).delete('/api/languages/delete/1')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + wrongJwt)
          .send().end((err, res) => {
            res.should.have.status(200);
            res.body.should.deep.equal(0);
            done();
          });
    });
    it('should not allow companies to delete languages', function(done) {
      chai.request(app).delete('/api/languages/delete/1')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + wrongCompanyJwt)
          .send().end((err, res) => {
            res.should.have.status(401);
            res.body.should.deep.equal({});
            res.error.text.should.equal('Unauthorized');
            done();
          });
    });
    it('should be able to delete languages', function(done) {
      chai.request(app).delete('/api/languages/delete/1')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + jwt)
          .send().end((err, res) => {
            res.should.have.status(200);
            res.body.should.equal(1);
            done();
          });
    });
  });


  after('testing, clear database', async function () {
    await sequelize.sync({ force: true, truncate: true, cascade: true });
  });
});
