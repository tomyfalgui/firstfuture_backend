const axios = require('axios');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const dotenv = require('dotenv').config({path:'../.env'});
const app = require('../index');
const sampleStudent = require('../docs/sampleStudent.json');
const validCredentials = require('../docs/correctCredentials.json')
let {sequelize, User, Skill, WorkExperience, Language, ExtraCurricular} = require('../database');

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
        .send(validCredentials).end((err,res)=>{
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('user');
            res.body.user.should.have.property('id');
            res.body.should.have.property('token');
            done();
        });
    });

    describe('should delete associated entries when deleted',function(){
        before('testing, clear user table',async () =>{
            await User.destroy({where:{}});
        });
        it('should have no skills related to the user', function(){
            return Skill.count({where:{userId:1}}).should.eventually.equal(0);
        });
        it('should have no work experiences related to the user', function(){
            return WorkExperience.count({where:{userId:1}}).should.eventually.equal(0);
        });
        it('should have no extra curriculars related to the user', function(){
            return ExtraCurricular.count({where:{userId:1}}).should.eventually.equal(0);
        });
        it('should have no languages related to the user', function(){
            return Language.count({where:{userId:1}}).should.eventually.equal(0);
        });
    });

    after('testing, clear database',async () =>{
        await sequelize.sync({force:true, truncate:true, cascade:true});
    });
});