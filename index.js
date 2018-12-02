const express = require('express');
const {User,Company,ExtraCurricular,Skill,Language,WorkExperience} = require('./database');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();
var cors = require('cors');

const saltRounds = parseInt(process.env.SALT_ROUNDS);

var app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.post('/api/users/new', cors(), (req, res) => {
	User.create(req.body).then(user => res.json(user))
});

app.post('/api/users/edit', cors(), (req, res) => {
    let plaintext = req.body.user.password;
    req.body.user.salt = bcrypt.genSaltSync(saltRounds);
    req.body.user.password = bcrypt.hashSync(plaintext,req.body.user.salt);
    User.create(req.body.user).then((user)=>{
        let id = user.id;
        for(let skill of req.body.skills){
            skill.userId = id;
            Skill.create(skill);
        }
        for(let extracurricular of req.body.extracurriculars){
            extracurricular.userId = id;
            ExtraCurricular.create(extracurricular);
        }
        for(let workExperience of req.body.workExperiences){
            workExperience.userId = id;
            WorkExperience.create(workExperience)
        }
        for(let language of req.body.languages){
            language.userId = id;
            Language.create(language);
        }
    })
    .then(() => res.json(true))

})

app.post('/api/company/new', cors(), (req, res) => {
    let plaintext = req.body.password;
    req.body.salt = bcrypt.genSaltSync(saltRounds);
    req.body.password = bcrypt.hashSync(plaintext,req.body.salt);
    Company.create(req.body)
        .then(company => res.json(company))
})

const port = process.env.PORT || 3000;
app.listen(port,()=>{
	console.log("Application starting");
});
