'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Sigfoxmsg = mongoose.model('Sigfoxmsg');

/**
 * Globals
 */
var user, sigfoxmsg;

/**
 * Unit tests
 */
describe('Sigfoxmsg Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			sigfoxmsg = new Sigfoxmsg({
				name: 'Sigfoxmsg Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return sigfoxmsg.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			sigfoxmsg.name = '';

			return sigfoxmsg.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Sigfoxmsg.remove().exec();
		User.remove().exec();

		done();
	});
});