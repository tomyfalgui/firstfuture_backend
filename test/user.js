const axios = require('axios');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const dotenv = require('dotenv').config({path:'../.env'});
const app = require('../index');
const sampleStudent = require('../docs/sample_student.json');
let {sequelize, User} = require('../database');

chai.use(chaiHttp);
chai.should();

describe('User', function(){
    before(function(){
        sequelize.sync({force:true});
    });
    
    it('should create a user', function(){
        chai.request(app).post('/api/auth/signup/user').set('content-type', 'application/json')
        .send(sampleStudent).end((err,res)=>{
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be('true');
        });
    });

    it('should not create a user if the email address already exists', function(){
        chai.request(app).post('/api/auth/signup/user').set('content-type', 'application/json')
        .send(sampleStudent).end((err,res)=>{
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.name.should.equal('SequelizeUniqueConstraintError');
            res.body.should.have.property('errors');
            res.body.errors.should.have.property('message');
            res.body.errors.message.should.equal('Email address already in use!');
        });
    });

    it('should only create one entry in the database', function(){
        return User.count({where:{email:sampleStudent.user.email}}).should.eventually.equal(1);
    });

    after(function(){
        sequelize.sync({force:true});
    });
});