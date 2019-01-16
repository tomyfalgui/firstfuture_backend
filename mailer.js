let nodemailer = require('nodemailer');
let hbs = require('nodemailer-express-handlebars');
require('dotenv').config();
const path = require('path');

let smtpTransport = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE_PROVIDER,
    auth: {
        user: process.env.MAILER_SERVICE_USER,
        pass: process.env.MAILER_SERVICE_PASSWORD
    }
});

const handlebarsOptions = {
    viewEngine: 'handlebars',
    viewPath: path.resolve('./templates/'),
    extName: '.html'
};

smtpTransport.use('compile', hbs(handlebarsOptions));

module.exports = smtpTransport;