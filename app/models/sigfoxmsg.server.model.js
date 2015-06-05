'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
/**
 * Sigfoxmsg Schema
 */

var SigfoxmsgSchema = new Schema({
    // Sigfox server time
    time: {
		type: Date,
		default: Date.now
	},
    // Server time
    date: {
        type: Date,
        default: Date.now
    },
    // Sigfox signal strenth
    signal: {
        type : Number
    },
    // Raw data
    data: {
        type: String
    },
    // Prefetch data from Sigfox server
    slot_Load: {
        type : Number
    },
    // Difference between last message
    delta: {
        type : Number
    },
    // Sigfox modem
    device: {
        type: Schema.ObjectId,
        ref: 'Sigfoxdevice'
    }
});

mongoose.model('Sigfoxmsg', SigfoxmsgSchema);
