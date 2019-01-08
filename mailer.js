let nodemailer = require('nodemailer');
let hbs = require('nodemailer-express-handlebars');
require('dotenv').config();
const path = require('path');

let smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'steven.gonzales11145@gmail.com',
        pass: 'balltrack13'
    }
});

const handlebarsOptions = {
    viewEngine: 'handlebars',
    viewPath: path.resolve('./templates/'),
    extName: '.html'
};

smtpTransport.use('compile', hbs(handlebarsOptions));

module.exports = smtpTransport;