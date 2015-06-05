'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var sigfoxdevices = require('../../app/controllers/sigfoxdevices.server.controller');

	// Sigfoxdevices Routes
	app.route('/sigfoxdevices')
		.get(users.requiresLogin, sigfoxdevices.list)
		.post(users.requiresLogin, sigfoxdevices.create);

	app.route('/sigfoxdevices/:sigfoxdeviceId')
		.get(users.requiresLogin, sigfoxdevices.read)
		.put(users.requiresLogin, sigfoxdevices.hasAuthorization, sigfoxdevices.update)
		.delete(users.requiresLogin, sigfoxdevices.hasAuthorization, sigfoxdevices.delete);

	// Finish by binding the Sigfoxdevice middleware
	app.param('sigfoxdeviceId', sigfoxdevices.sigfoxdeviceByID);
};
