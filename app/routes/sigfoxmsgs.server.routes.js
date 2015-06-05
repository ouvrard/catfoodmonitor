'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
    var sigfoxdevices = require('../../app/controllers/sigfoxdevices.server.controller');
	var sigfoxmsgs = require('../../app/controllers/sigfoxmsgs.server.controller');
    var metrics = require('../../app/controllers/metrics.server.controller');


	// Sigfoxmsgs Routes
	app.route('/sigfoxmsgs')
		.get(users.requiresLogin, sigfoxmsgs.list)
		.post(
            // Search the device in DB
            sigfoxdevices.isDeviceAuthorized,
            // Calculate load variation since last message
            sigfoxmsgs.calculateDelta,
            // Store the new message in DB
            sigfoxmsgs.storeMsg,
            // Get data for the metrics
            sigfoxmsgs.getDailyMetrics,
            sigfoxmsgs.getWeeklyMetrics,
            // Store the metrics
            metrics.storeMetrics);

	app.route('/sigfoxmsgs/:sigfoxmsgId')
		.get(users.requiresLogin, sigfoxmsgs.read)
		.put(users.requiresLogin, sigfoxmsgs.hasAuthorization, sigfoxmsgs.update)
		.delete(users.requiresLogin, sigfoxmsgs.hasAuthorization, sigfoxmsgs.delete);

	// Finish by binding the Sigfoxmsg middleware
	app.param('sigfoxmsgId', sigfoxmsgs.sigfoxmsgByID);
};
