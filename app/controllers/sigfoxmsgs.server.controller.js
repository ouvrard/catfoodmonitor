'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Sigfoxmsg = mongoose.model('Sigfoxmsg'),
	_ = require('lodash'),
    moment = require('moment');

/**
 * Create a Sigfoxmsg
 */
exports.create = function(req, res) {
	var sigfoxmsg = new Sigfoxmsg(req.body);

	sigfoxmsg.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sigfoxmsg);
		}
	});
};

/**
 * Show the current Sigfoxmsg
 */
exports.read = function(req, res) {
	res.jsonp(req.sigfoxmsg);
};

/**
 * Update a Sigfoxmsg
 */
exports.update = function(req, res) {
	var sigfoxmsg = req.sigfoxmsg;

	sigfoxmsg = _.extend(sigfoxmsg , req.body);

	sigfoxmsg.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sigfoxmsg);
		}
	});
};

/**
 * Delete an Sigfoxmsg
 */
exports.delete = function(req, res) {
	var sigfoxmsg = req.sigfoxmsg ;

	sigfoxmsg.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sigfoxmsg);
		}
	});
};

/**
 * List of Sigfoxmsgs
 */
exports.list = function(req, res) {
    Sigfoxmsg.find().sort('-created').populate('user', 'displayName').exec(function(err, sigfoxmsgs) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(sigfoxmsgs);
        }
    });
};

/**
 * Sigfoxmsg middleware
 */
exports.sigfoxmsgByID = function(req, res, next, id) {
	Sigfoxmsg.findById(id).populate('user', 'displayName').exec(function(err, sigfoxmsg) {
		if (err) return next(err);
		if (! sigfoxmsg) return next(new Error('Failed to load Sigfoxmsg ' + id));
		req.sigfoxmsg = sigfoxmsg ;
		next();
	});
};

/**
 * Sigfoxmsg authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.sigfoxmsg.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

/**
 * Sigfoxmsg requiresLogin middleware
 */
exports.requiresLogin = function(req, res, next) {
    if (req.sigfoxmsg.device !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};


/**
 * Middleware: Store a Sigfox message
 */
exports.storeMsg = function(req, res, next) {
    var sigfoxmsg = new Sigfoxmsg(req.body);

    // Get parameters from middlewares
    sigfoxmsg.device = req.sigfoxdevice;
    sigfoxmsg.delta = req.delta;

    // Convert Unix TS to JavaScript TS
    if(sigfoxmsg.time)
        sigfoxmsg.time *= 1000;

    // Clear body
    req.body = {};

    sigfoxmsg.save(function(err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            next();
        }
    });
};


/**
 * Middleware: Calculate load variation since last message
 */
exports.calculateDelta = function(req, res, next) {
    // Find last Sigfox message to calculate difference
    // Only one device -> search last document in db
    // Todo : implement a more robust method to deal with more than 1 device
    Sigfoxmsg.findOne().sort({ _id: -1 }).exec(function(err, lastMsg) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if(lastMsg)
                req.delta = lastMsg.slot_Load - req.body.slot_Load;
            else
                req.delta = 0;

            // Check if a food refill happens
            if(req.delta < 0 )
                req.delta = 0;
            next();
        }
    });
};

/**
 * Middleware: Calculate daily metrics
 */

exports.getDailyMetrics = function(req, res, next) {
    // Today @ 00:00
    var aDayAgo = moment().add(1, 'hour').startOf('hour').subtract(1, 'day');

    // Get daily data
    Sigfoxmsg.aggregate([
        // Match the date range
        { $match: { date: { $gte: aDayAgo._d} } },

        { $group : {
            _id: { $hour: '$date' },
            load  : { $last : '$slot_Load'},
            delta : { $sum : '$delta'}
        }},
        { $sort: { date: -1}}
        /*,
        {$sort: {_id:1}}*/
    ]).exec(function(err, data) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.body.dailyMetrics = data;
            next();
        }
    });
};

/**
 * Middleware: Calculate weekly metrics
 */
exports.getWeeklyMetrics = function(req, res, next) {
    // 7 days ago
    var sevenDaysAgo = moment().endOf('day').subtract(7, 'day');

    // Get weekly data
    Sigfoxmsg.aggregate([
        // Match the date range
        { $match: { date: { $gte: sevenDaysAgo._d} } },
        { $sort: { date: -1}},
        { $group: {
            _id: { $dayOfWeek: '$date' },
            delta: { $sum: '$delta'}
        }},
        {$sort: {_id:1}}
    ]).exec(function(err, data) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.body.weeklyMetrics = data;
            next();
        }
    });
};
