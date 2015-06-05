'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Sigfoxdevice = mongoose.model('Sigfoxdevice'),
	_ = require('lodash');

/**
 * Create a Sigfoxdevice
 */
exports.create = function(req, res) {
	var sigfoxdevice = new Sigfoxdevice(req.body);
	sigfoxdevice.user = req.user;

	sigfoxdevice.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sigfoxdevice);
		}
	});
};

/**
 * Show the current Sigfoxdevice
 */
exports.read = function(req, res) {
	res.jsonp(req.sigfoxdevice);
};

/**
 * Update a Sigfoxdevice
 */
exports.update = function(req, res) {
	var sigfoxdevice = req.sigfoxdevice ;

	sigfoxdevice = _.extend(sigfoxdevice , req.body);

	sigfoxdevice.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sigfoxdevice);
		}
	});
};

/**
 * Delete an Sigfoxdevice
 */
exports.delete = function(req, res) {
	var sigfoxdevice = req.sigfoxdevice ;

	sigfoxdevice.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sigfoxdevice);
		}
	});
};

/**
 * List of Sigfoxdevices
 */
exports.list = function(req, res) { 
	Sigfoxdevice.find().sort('-created').populate('user', 'displayName').exec(function(err, sigfoxdevices) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sigfoxdevices);
		}
	});
};

/**
 * Sigfoxdevice middleware
 */
exports.sigfoxdeviceByID = function(req, res, next, id) { 
	Sigfoxdevice.findById(id).populate('user', 'displayName').exec(function(err, sigfoxdevice) {
		if (err) return next(err);
		if (! sigfoxdevice) return next(new Error('Failed to load Sigfoxdevice ' + id));
		req.sigfoxdevice = sigfoxdevice ;
		next();
	});
};

/**
 * Sigfoxdevice authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.sigfoxdevice.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

/**
 * Sigfoxdevice middleware
 */
exports.isDeviceAuthorized = function(req, res, next) {
    Sigfoxdevice.findOne({name: req.body.device}).exec(function(err, sigfoxdevice) {
        // remove device ID
        req.body.device = undefined;

        if (! sigfoxdevice)
            return res.status(403).send('Device is not authorized');

        req.sigfoxdevice = sigfoxdevice.id;
        next();
    });
};
