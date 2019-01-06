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
const newWorkExperience = require('../docs/newWorkExperience.json');

const {sequelize} = require('../database');

chai.use(chaiHttp);
chai.should();

describe('Work Experiences', function() {
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

  describe('/api/workexperiences/new', function() {
    it('should be able to create new work experience entries', function(done) {
      chai.request(app).post('/api/workexperiences/new')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + jwt)
          .send(newWorkExperience).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('id');
            res.body.id.should.equal(7);
            res.body.should.have.property('company');
            res.body.company.should.equal('Twitter');
            res.body.should.have.property('typeOfWork');
            res.body.typeOfWork.should.equal('Software Engineering Intern SRE');
            res.body.should.have.property('hours');
            res.body.hours.should.equal(500);
            res.body.should.have.property('description');
            res.body.description.should.equal('Interned on the Database - SRE team');
            res.body.should.have.property('userId');
            res.body.userId.should.equal(1);
            done();
          });
    });

    it('should be not be able to create new work experience entries if user is not authorized', function(done) {
      chai.request(app).post('/api/workexperiences/new')
          .set('content-type', 'application/json')
          .send(newWorkExperience).end((err, res) => {
            res.should.have.status(401);
            res.body.should.deep.equal({});
            res.error.text.should.equal('Unauthorized');
            done();
          });
    });

    it('should be not allow companies to create work experience entries', function(done) {
      chai.request(app).post('/api/workexperiences/new')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + wrongCompanyJwt)
          .send(newWorkExperience).end((err, res) => {
            res.should.have.status(401);
            res.body.should.deep.equal({});
            res.error.text.should.equal('Unauthorized');
            done();
          });
    });
  });

  describe('/api/workexperiences/edit', function() {
    it('should be able to edit work experience entries', function(done) {
      chai.request(app).post('/api/workexperiences/edit')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + jwt)
          .send({id: 7, deltas: {description: 'Developed a Flask App to monitor database clusters'}}).end((err, res) => {
            res.should.have.status(200);
            res.body.should.deep.equal([1]);
            done();
          });
    });
    it('should be not be able to edit work experience entries if user is not authorized', function(done) {
      chai.request(app).post('/api/workexperiences/edit')
          .set('content-type', 'application/json')
          .send({id: 7, deltas: {description: 'Developed a Flask App to monitor database clusters'}}).end((err, res) => {
            res.should.have.status(401);
            res.body.should.deep.equal({});
            res.error.text.should.equal('Unauthorized');
            done();
          });
    });
    it('should be not be able to edit skills if the target work experience entry does not belong to the user', function(done) {
      chai.request(app).post('/api/workexperiences/edit')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + wrongJwt)
          .send({id: 7, deltas: {description: 'Developed a Flask App to monitor database clusters'}}).end((err, res) => {
            res.should.have.status(200);
            res.body.should.deep.equal([0]);
            done();
          });
    });
    it('should be not allow companies to edit work experience entries', function(done) {
      chai.request(app).post('/api/workexperiences/edit')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + wrongCompanyJwt)
          .send({id: 5, deltas: {description: 'Developed a Flask App to monitor database clusters'}}).end((err, res) => {
            res.should.have.status(401);
            res.body.should.deep.equal({});
            res.error.text.should.equal('Unauthorized');
            done();
          });
    });
  });
  describe('/api/skills/delete/:id', function() {
    it('should be not be able to delete work experience entries if user is not authorized', function(done) {
      chai.request(app).delete('/api/workexperiences/delete/1')
          .set('content-type', 'application/json')
          .send().end((err, res) => {
            res.should.have.status(401);
            res.body.should.deep.equal({});
            res.error.text.should.equal('Unauthorized');
            done();
          });
    });
    it('should be not be able to delete work experience entries if the target work experience entry does not belong to the user', function(done) {
      chai.request(app).delete('/api/workexperiences/delete/1')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + wrongJwt)
          .send().end((err, res) => {
            res.should.have.status(200);
            res.body.should.deep.equal(0);
            done();
          });
    });
    it('should not allow companies to delete work experience entries', function(done) {
      chai.request(app).delete('/api/workexperiences/delete/1')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + wrongCompanyJwt)
          .send().end((err, res) => {
            res.should.have.status(401);
            res.body.should.deep.equal({});
            res.error.text.should.equal('Unauthorized');
            done();
          });
    });
    it('should be able to delete work experience entries', function(done) {
      chai.request(app).delete('/api/workexperiences/delete/1')
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
