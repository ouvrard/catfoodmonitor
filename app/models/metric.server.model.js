'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Metric Schema
 */
var MetricSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
    dailyMetrics: {
        type: Schema.Types.Mixed
    },
    weeklyMetrics: {
        type: Schema.Types.Mixed
    },
    // Sigfox modem
    device: {
        type: Schema.ObjectId,
        ref: 'Sigfoxdevice'
    }
});

mongoose.model('Metric', MetricSchema);
