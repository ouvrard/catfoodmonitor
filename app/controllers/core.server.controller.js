'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Sigfoxmsg = mongoose.model('Sigfoxmsg'),
    _ = require('lodash');

exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};
exports.days = {};


function dailyData2() {
    // Today @ 00:00
    var today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Get daily data
    Sigfoxmsg.aggregate([
        // Match the date range
        { $match: { date: { $gt: today} } },
        { $sort: { date: -1}},
        { $group : {
            _id : { hr: { $hour: '$date' } },
            load  : { $avg : '$slot_Load'},
            delta : { $sum : '$delta'}
        }}
    ]).exec(function(err, data) {
        if (err) {
            return undefined;
        } else {
            return data;
        }
    });
}


exports.calc = function(req, res) {
    exports.days = dailyData2();
    console.log(exports.days);

    res.jsonp({});
};
