'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    crypto = require('crypto');

/**
 * Sigfoxdevice Schema
 */
var SigfoxdeviceSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Sigfoxdevice name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

/**
 * Hook a pre save method to hash the password
 */
SigfoxdeviceSchema.pre('save', function(next) {
    if (this.password && this.password.length > 6) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }

    next();
});

/**
 * Create instance method for hashing a password
 */
SigfoxdeviceSchema.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
SigfoxdeviceSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

mongoose.model('Sigfoxdevice', SigfoxdeviceSchema);
