var express = require('express');
var apiRoutes = express.Router();
var accountRouter = require('./bundles/account');
var messagesRouter = require('./bundles/messages');
var eventsRouter = require('./bundles/events');

/**
 * Set routes for the application.
 *
 * @param app
 */
exports.setRoutes = function (app) {

    if (!process.env.APPLICATION_PART || process.env.APPLICATION_PART === "another") {
        app.use(accountRouter.baseRoute, accountRouter.init(app));
        app.use(eventsRouter.baseRoute, eventsRouter.init(app));
    }
    if (!process.env.APPLICATION_PART || process.env.APPLICATION_PART === "messages") {
        app.use(messagesRouter.baseRoute, messagesRouter.init(app));
    }

    app.get('/', function (req, res) {

        res.render('home/index');
    });
    app.get('/success', function (req, res) {

        res.render('home/success');
    });
    app.get('/fail', function (req, res) {

        res.render('home/fail');
    });

    app.use('/api', apiRoutes);

    app.get('*', function (req, res) {

        res.status(404).render('home/404', {

            title: 'Page not Found'
        });
    });


};