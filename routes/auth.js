require('dotenv').config({ path: '../.env' });
const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {
    User,
    ExtraCurricular,
    Skill,
    Language,
    WorkExperience,
    Company
} = require('../database');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const smtpTransport = require('../mailer');
const crypto = require('crypto');

const saltRounds = parseInt(process.env.SALT_ROUNDS);

router.post('/login/user', (req, res) => {
    login('local', req, res);
});

router.post('/login/company', (req, res) => {
    login('company-local', req, res);
});

router.post('/signup/user', (req, res) => {
    const plaintext = req.body.user.password;
    req.body.user.password = encryptPassword(plaintext);
    User.create(req.body.user,
            // {fields: ['id','firstName','lastName','password','middleName','userName',
            //     'email','phone','birthdate','sex','isGraduate','graduationDate','shs',
            //     'strand','generalAverage','gradeCeiling','honors',
            //     'englishSpeakingRating','englishWritingRating','englishReadingRating',
            //     'filipinoSpeakingRating','filipinoWritingRating',
            //     'filipinoReadingRating',]}
        ).then((user) => {
            const id = user.id;

            const promisesSkill = [];
            const promisesExtraCurricular = [];
            const promisesWorkExperience = [];
            const promisesLanguage = [];

            for (const skill of req.body.skills) {
                skill.userId = id;
                promisesSkill.push(Skill.create(skill));
            }
            for (const extracurricular of req.body.extracurriculars) {
                extracurricular.userId = id;
                promisesExtraCurricular.push(ExtraCurricular.create(extracurricular));
            }
            for (const workExperience of req.body.workExperiences) {
                workExperience.userId = id;
                promisesWorkExperience.push(WorkExperience.create(workExperience));
            }
            for (const language of req.body.languages) {
                language.userId = id;
                promisesLanguage.push(Language.create(language));
            }

            Promise.all([
                    Promise.all(promisesSkill),
                    Promise.all(promisesExtraCurricular),
                    Promise.all(promisesWorkExperience),
                    Promise.all(promisesLanguage),
                ])
                .then(() => {
                    updateAndMail(user, true, 'emailVerification',
                        'First Future - Email Verification', process.env.VERIFY_URL);
                    res.json(true);
                })
                .catch((err) => {
                    user.destroy();
                    res.json(err);
                });
        })
        .catch((err) => res.json(err));
});

router.post('/signup/company', (req, res) => {
    req.body.password = encryptPassword(req.body.password);
    Company.create(req.body,
            // {fields:['userName','email', 'password','companyName'
            // ,'contactNumber','desciption','city']}
        ).then((company) => {
            updateAndMail(company, false, 'emailVerification',
                'First Future - Email Verification',
                process.env.VERIFICATION_URL);
            res.json(true);
        })
        .catch((err) => res.json(err));
});

router.post('/verify/student', (req, res) => {
    validateUser(User, req, res);
});

router.post('/verify/company', (req, res) => {
    validateUser(Company, req, res);
});

router.post('/account_recovery/student', (req, res) => {
    recoverAccount(User, req, res);
});

router.post('/account_recovery/company', (req, res) => {
    recoverAccount(Company, req, res);
});

router.post('/password_reset/student', (req, res) => {
    passwordReset(User, req, res);
});

router.post('/password_reset/company', (req, res) => {
    passwordReset(Company, req, res);
});

/**
 * Resets password stored in the database given the user defined in the request
 * @param {object} model - Sequelize model
 * @param {Request} req - HTTP Request
 * @param {Response} res - HTTP Response
 */
function passwordReset(model, req, res) {
    try {
        const isStudent = (model == User);
        // eslint-disable-next-line max-len
        const secret = process.env.JWTSecret;
        const decoded = jwt.verify(req.body.token, secret);
        const validRole = isStudent ? decoded.isStudent : !decoded.isStudent;
        if (validRole) {
            const deltas = {
                password: encryptPassword(req.body.newPassword),
                passwordResetToken: null,
            };
            const identifiers = {
                where: {
                    id: decoded.user,
                    passwordResetToken: decoded.resetToken,
                },
            };
            model.update(deltas, identifiers).then(() => {
                res.json(true);
            });
        } else throw new Error('Role mismatch');
    } catch (err) {
        res.json(err);
    }
}

/**
 * Checks if the given token is valid; if yes, verifies the user
 * @param {object} model - Sequelize model
 * @param {Request} req - HTTP Request
 * @param {Response} res - HTTP Response
 */
function validateUser(model, req, res) {
    try {
        const isStudent = (model == User);
        // eslint-disable-next-line max-len
        const secret = process.env.JWTSecret;
        const decoded = jwt.verify(req.body.token, secret);
        const validRole = isStudent ? decoded.isStudent : !decoded.isStudent;
        if (validRole) {
            const deltas = {
                verified: true,
                passwordResetToken: null,
            };
            const identifiers = {
                where: {
                    id: decoded.user,
                    passwordResetToken: decoded.resetToken,
                },
            };
            model.update(deltas, identifiers).then((out) => {
                // if out is [0] i.e. the transaction didn't work, return error
                if (out) {
                    res.json(true);
                } else res.json(new Error('Error validating user'));
            });
        } else throw new Error('Role mismatch');
    } catch (err) {
        res.json(err);
    }
}

/**
 * Sends password reset email and logs reset request into the database
 * @param {object} model - Sequelize model
 * @param {Request} req - HTTP Request
 * @param {Response} res - HTTP Response
 */
function recoverAccount(model, req, res) {
    const isStudent = model == User ? true : false;
    model.findOne({ where: { email: req.body.email, verified: true } })
        .then((out) => {
            updateAndMail(out, isStudent, 'forgotPasswordUser',
                'Password Reset', process.env.RESET_URL);
            res.json(true);
        })
        .catch((err) => res.json(new Error('Unable to reset password')));
}

/**
 * Updates the user's passwordResetToken field and sends email with
 * the arguments specified
 * @param {object} out - Sequelize Instance
 * @param {Boolean} isStudent - If the model to use is Company or not
 * @param {String} template - Specifies which template to use
 * @param {String} subject - Specifies the subject field of email to send
 * @param {String} targetURL - Specifies which url to send with the email
 */
function updateAndMail(out, isStudent, template, subject, targetURL) {
    const buffer = crypto.randomBytes(30).toString('hex');
    out.update({ passwordResetToken: buffer }).then(() => {
        const name = isStudent ? out.firstName : out.userName;
        const claims = {
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            user: out.id,
            resetToken: buffer,
            isStudent: isStudent,
        };
        const jwtToSend = jwt.sign(claims, process.env.JWTSecret);
        const emailContext = {
            url: targetURL + jwtToSend,
            name: name,
        };
        sendMail(out.email, template, subject, emailContext);
    });
}

/**
 * Composes email to send to the specified address witht the stated contents
 * @param {String} email - Receipient of the email being sent
 * @param {String} template - Specifies which template to use
 * @param {String} subject -  Specifies the subject field of email to send
 * @param {object} context - Content to fill out the template with
 * @return {Promise} - Returns the mail sending as a promise
 */
function sendMail(email, template, subject, context) {
    const data = {
        to: email,
        from: process.env.MAILER_SERVICE_USER,
        template: template,
        subject: subject,
        context: context,
    };
    return smtpTransport.sendMail(data);
}

/**
 * Hashes the password of the user to allow it to be stored in the DB securely
 * @param {string} plaintext - Unhashed password
 * @return {password} - Hashed password
 */
function encryptPassword(plaintext) {
    const salt = bcrypt.genSaltSync(saltRounds);
    const password = bcrypt.hashSync(plaintext, salt);
    return (password);
}

/**
 * Logs the user in and generates a JWT for the user
 * @param {string} strategy - which passport strategy to use for authentication
 * @param {Request} req - HTTP request sent to the server
 * @param {Response} res - HTTP response
 */
function login(strategy, req, res) {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user: user,
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            const token = jwt.sign(user, process.env.JWTSecret);
            return res.json({ user, token });
        });
    })(req, res);
}

module.exports = router;