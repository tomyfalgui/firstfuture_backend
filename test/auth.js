const axios = require('axios');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const dotenv = require('dotenv').config({path:'../.env'});
const app = require('../index');
const sampleStudent = require('../docs/sampleStudent.json');
const sampleCompany = require('../docs/sampleCompany.json');
const validCredentialsStudent = require('../docs/correctCredentialsStudent.json');
const validCredentialsCompany = require('../docs/correctCredentialsCompany.json');
const invalidCredentialsStudent = require('../docs/incorrectCredentialsStudent.json');
const invalidCredentialsCompany = require('../docs/incorrectCredentialsCompany.json');
let {sequelize, User, Skill, WorkExperience, Language, ExtraCurricular,Company} = require('../database');

chai.use(chaiHttp);
chai.should();

describe('User', function(){
    
    before('testing, clear database',async () =>{
        await sequelize.sync({force:true, truncate:true, cascade:true});
    });

    it('should create a user when data is posted', function(done){
        chai.request(app).post('/api/auth/signup/user').set('content-type', 'application/json')
        .send(sampleStudent).end((err,res)=>{
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('user');
            done();
        });
    });

    it('should not create a user if the email address already exists', function(done){
        chai.request(app).post('/api/auth/signup/user').set('content-type', 'application/json')
        .send(sampleStudent).end((err,res)=>{
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

    it('should only create one entry in the database', function(){
        return User.count({where:{email:sampleStudent.user.email}}).should.eventually.equal(1);
    });

    it('should be able to login with the given credentials', function(done){
        chai.request(app).post('/api/auth/login/user').set('content-type', 'application/json')
        .send(validCredentialsStudent).end((err,res)=>{
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('user');
            res.body.user.should.have.property('id');
            res.body.should.have.property('token');
            done();
        });
    });

    it('should not be able to login with the incorrect credentials', function(done){
        chai.request(app).post('/api/auth/login/user').set('content-type', 'application/json')
        .send(invalidCredentialsStudent).end((err,res)=>{
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

    after('testing, clear database',async () =>{
        await sequelize.sync({force:true, truncate:true, cascade:true});
    });
});

describe('Companies', function(){
    
    before('testing, clear database',async () =>{
        await sequelize.sync({force:true, truncate:true, cascade:true});
    });

    it('should create a company when data is posted', function(done){
        chai.request(app).post('/api/auth/signup/company').set('content-type', 'application/json')
        .send(sampleCompany).end((err,res)=>{
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            done();
        });
    });

    it('should not create a company if the email address already exists', function(done){
        chai.request(app).post('/api/auth/signup/company').set('content-type', 'application/json')
        .send(sampleCompany).end((err,res)=>{
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

    it('should only create one entry in the database', function(){
        return Company.count({where:{email:sampleCompany.email}}).should.eventually.equal(1);
    });

    it('should be able to login with the given credentials', function(done){
        chai.request(app).post('/api/auth/login/company').set('content-type', 'application/json')
        .send(validCredentialsCompany).end((err,res)=>{
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('user');
            res.body.user.should.have.property('id');
            res.body.should.have.property('token');
            done();
        });
    });

    it('should not be able to login with the incorrect credentials', function(done){
        chai.request(app).post('/api/auth/login/company').set('content-type', 'application/json')
        .send(invalidCredentialsCompany).end((err,res)=>{
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

    after('testing, clear database',async () =>{
        await sequelize.sync({force:true, truncate:true, cascade:true});
    });
});