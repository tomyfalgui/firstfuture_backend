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
const newExtraCurricular = require('../docs/newExtraCurricular.json');

const {sequelize} = require('../database');

chai.use(chaiHttp);
chai.should();

describe('ExtraCurriculars', function() {
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

  describe('/api/extracurriculars/new', function() {
    it('should be able to create new extracurriculars', function(done) {
      chai.request(app).post('/api/extracurriculars/new')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + jwt)
          .send(newExtraCurricular).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('id');
            res.body.id.should.equal(5);
            res.body.should.have.property('orgName');
            res.body.orgName.should.equal('GDG');
            res.body.should.have.property('description');
            res.body.description.should.equal('Google Dev Group');
            res.body.should.have.property('yearsActive');
            res.body.yearsActive.should.equal(10);
            res.body.should.have.property('userId');
            res.body.userId.should.equal(1);
            done();
          });
    });

    it('should be not be able to create new extracurriculars if user is not authorized', function(done) {
      chai.request(app).post('/api/extracurriculars/new')
          .set('content-type', 'application/json')
          .send(newExtraCurricular).end((err, res) => {
            res.should.have.status(401);
            res.body.should.deep.equal({});
            res.error.text.should.equal('Unauthorized');
            done();
          });
    });

    it('should be not allow companies to create extracurriculars', function(done) {
      chai.request(app).post('/api/extracurriculars/new')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + wrongCompanyJwt)
          .send(newExtraCurricular).end((err, res) => {
            res.should.have.status(401);
            res.body.should.deep.equal({});
            res.error.text.should.equal('Unauthorized');
            done();
          });
    });
  });

  describe('/api/extracurriculars/edit', function() {
    it('should be able to edit extracurriculars', function(done) {
      chai.request(app).post('/api/extracurriculars/edit')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + jwt)
          .send({id: 5, deltas: {positionsHeld: ['President', 'Secretary-General']}}).end((err, res) => {
            res.should.have.status(200);
            res.body.should.deep.equal([1]);
            done();
          });
    });
    it('should be not be able to edit extracurriculars if user is not authorized', function(done) {
      chai.request(app).post('/api/extracurriculars/edit')
          .set('content-type', 'application/json')
          .send({id: 5, deltas: {positionsHeld: ['President', 'Secretary-General']}}).end((err, res) => {
            res.should.have.status(401);
            res.body.should.deep.equal({});
            res.error.text.should.equal('Unauthorized');
            done();
          });
    });
    it('should be not be able to edit extracurriculars if the target extracurriculars does not belong to the user', function(done) {
      chai.request(app).post('/api/extracurriculars/edit')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + wrongJwt)
          .send({id: 5, deltas: {positionsHeld: ['President', 'Secretary-General']}}).end((err, res) => {
            res.should.have.status(200);
            res.body.should.deep.equal([0]);
            done();
          });
    });
    it('should be not allow companies to edit extracurriculars', function(done) {
      chai.request(app).post('/api/extracurriculars/edit')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + wrongCompanyJwt)
          .send({id: 5, deltas: {positionsHeld: ['President', 'Secretary-General']}}).end((err, res) => {
            res.should.have.status(401);
            res.body.should.deep.equal({});
            res.error.text.should.equal('Unauthorized');
            done();
          });
    });
  });
  describe('/api/extracurriculars/delete/:id', function() {
    it('should be not be able to delete extracurriculars if user is not authorized', function(done) {
      chai.request(app).delete('/api/extracurriculars/delete/1')
          .set('content-type', 'application/json')
          .send().end((err, res) => {
            res.should.have.status(401);
            res.body.should.deep.equal({});
            res.error.text.should.equal('Unauthorized');
            done();
          });
    });
    it('should be not be able to delete extracurriculars if the target skill does not belong to the user', function(done) {
      chai.request(app).delete('/api/extracurriculars/delete/1')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + wrongJwt)
          .send().end((err, res) => {
            res.should.have.status(200);
            res.body.should.deep.equal(0);
            done();
          });
    });
    it('should not allow companies to delete extracurriculars', function(done) {
      chai.request(app).delete('/api/extracurriculars/delete/1')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + wrongCompanyJwt)
          .send().end((err, res) => {
            res.should.have.status(401);
            res.body.should.deep.equal({});
            res.error.text.should.equal('Unauthorized');
            done();
          });
    });
    it('should be able to delete extracurriculars', function(done) {
      chai.request(app).delete('/api/extracurriculars/delete/1')
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
});