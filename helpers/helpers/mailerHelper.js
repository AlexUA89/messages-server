var mailer = require('express-mailer');
var environment = require('configuration');
var User = require('models').User;

var global = require('../../app');


/**
 * Initialises mailer for the app
 *
 * @param app
 */
exports.getMailer = function (app) {

    mailer.extend(app, {
        from: environment.get('smtp:smtp_from'),
        host: environment.get('smtp:smtp_host'), // hostname
        secureConnection: true, // use SSL
        port: environment.get('smtp:smtp_port'), // port for secure SMTP
        transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
        auth: {
            user: environment.get('smtp:smtp_user'),
            pass: environment.get('smtp:smtp_pass')
        }
    });
};


/**
 * Sends email to the user based on the info (for confirming email and for resetting password)
 *
 * @param user
 * @param view
 * @param subject
 * @param locals
 * @param req
 */
exports.sendResetEmailWithToken = function (user, view, subject, locals, req) {

    if (typeof user.email !== 'undefined') {
        var email = user.email;

        User.generateConfirmToken(user, function (token) {

            locals.token = token;

            global.app.mailer.send(view, {
                to: email, // REQUIRED. This can be a comma delimited string just like a normal email to field.
                subject: subject, // REQUIRED.
                locals: locals,
                baseUrl: req.headers.host
            }, function (err) {

                if (err) {
                    throw err;
                }
            });
        });
    }
};