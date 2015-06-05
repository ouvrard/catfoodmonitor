'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Sigfoxdevice = mongoose.model('Sigfoxdevice'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, sigfoxdevice;

/**
 * Sigfoxdevice routes tests
 */
describe('Sigfoxdevice CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Sigfoxdevice
		user.save(function() {
			sigfoxdevice = {
				name: 'Sigfoxdevice Name'
			};

			done();
		});
	});

	it('should be able to save Sigfoxdevice instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sigfoxdevice
				agent.post('/sigfoxdevices')
					.send(sigfoxdevice)
					.expect(200)
					.end(function(sigfoxdeviceSaveErr, sigfoxdeviceSaveRes) {
						// Handle Sigfoxdevice save error
						if (sigfoxdeviceSaveErr) done(sigfoxdeviceSaveErr);

						// Get a list of Sigfoxdevices
						agent.get('/sigfoxdevices')
							.end(function(sigfoxdevicesGetErr, sigfoxdevicesGetRes) {
								// Handle Sigfoxdevice save error
								if (sigfoxdevicesGetErr) done(sigfoxdevicesGetErr);

								// Get Sigfoxdevices list
								var sigfoxdevices = sigfoxdevicesGetRes.body;

								// Set assertions
								(sigfoxdevices[0].user._id).should.equal(userId);
								(sigfoxdevices[0].name).should.match('Sigfoxdevice Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Sigfoxdevice instance if not logged in', function(done) {
		agent.post('/sigfoxdevices')
			.send(sigfoxdevice)
			.expect(401)
			.end(function(sigfoxdeviceSaveErr, sigfoxdeviceSaveRes) {
				// Call the assertion callback
				done(sigfoxdeviceSaveErr);
			});
	});

	it('should not be able to save Sigfoxdevice instance if no name is provided', function(done) {
		// Invalidate name field
		sigfoxdevice.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sigfoxdevice
				agent.post('/sigfoxdevices')
					.send(sigfoxdevice)
					.expect(400)
					.end(function(sigfoxdeviceSaveErr, sigfoxdeviceSaveRes) {
						// Set message assertion
						(sigfoxdeviceSaveRes.body.message).should.match('Please fill Sigfoxdevice name');
						
						// Handle Sigfoxdevice save error
						done(sigfoxdeviceSaveErr);
					});
			});
	});

	it('should be able to update Sigfoxdevice instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sigfoxdevice
				agent.post('/sigfoxdevices')
					.send(sigfoxdevice)
					.expect(200)
					.end(function(sigfoxdeviceSaveErr, sigfoxdeviceSaveRes) {
						// Handle Sigfoxdevice save error
						if (sigfoxdeviceSaveErr) done(sigfoxdeviceSaveErr);

						// Update Sigfoxdevice name
						sigfoxdevice.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Sigfoxdevice
						agent.put('/sigfoxdevices/' + sigfoxdeviceSaveRes.body._id)
							.send(sigfoxdevice)
							.expect(200)
							.end(function(sigfoxdeviceUpdateErr, sigfoxdeviceUpdateRes) {
								// Handle Sigfoxdevice update error
								if (sigfoxdeviceUpdateErr) done(sigfoxdeviceUpdateErr);

								// Set assertions
								(sigfoxdeviceUpdateRes.body._id).should.equal(sigfoxdeviceSaveRes.body._id);
								(sigfoxdeviceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Sigfoxdevices if not signed in', function(done) {
		// Create new Sigfoxdevice model instance
		var sigfoxdeviceObj = new Sigfoxdevice(sigfoxdevice);

		// Save the Sigfoxdevice
		sigfoxdeviceObj.save(function() {
			// Request Sigfoxdevices
			request(app).get('/sigfoxdevices')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Sigfoxdevice if not signed in', function(done) {
		// Create new Sigfoxdevice model instance
		var sigfoxdeviceObj = new Sigfoxdevice(sigfoxdevice);

		// Save the Sigfoxdevice
		sigfoxdeviceObj.save(function() {
			request(app).get('/sigfoxdevices/' + sigfoxdeviceObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', sigfoxdevice.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Sigfoxdevice instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sigfoxdevice
				agent.post('/sigfoxdevices')
					.send(sigfoxdevice)
					.expect(200)
					.end(function(sigfoxdeviceSaveErr, sigfoxdeviceSaveRes) {
						// Handle Sigfoxdevice save error
						if (sigfoxdeviceSaveErr) done(sigfoxdeviceSaveErr);

						// Delete existing Sigfoxdevice
						agent.delete('/sigfoxdevices/' + sigfoxdeviceSaveRes.body._id)
							.send(sigfoxdevice)
							.expect(200)
							.end(function(sigfoxdeviceDeleteErr, sigfoxdeviceDeleteRes) {
								// Handle Sigfoxdevice error error
								if (sigfoxdeviceDeleteErr) done(sigfoxdeviceDeleteErr);

								// Set assertions
								(sigfoxdeviceDeleteRes.body._id).should.equal(sigfoxdeviceSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Sigfoxdevice instance if not signed in', function(done) {
		// Set Sigfoxdevice user 
		sigfoxdevice.user = user;

		// Create new Sigfoxdevice model instance
		var sigfoxdeviceObj = new Sigfoxdevice(sigfoxdevice);

		// Save the Sigfoxdevice
		sigfoxdeviceObj.save(function() {
			// Try deleting Sigfoxdevice
			request(app).delete('/sigfoxdevices/' + sigfoxdeviceObj._id)
			.expect(401)
			.end(function(sigfoxdeviceDeleteErr, sigfoxdeviceDeleteRes) {
				// Set message assertion
				(sigfoxdeviceDeleteRes.body.message).should.match('User is not logged in');

				// Handle Sigfoxdevice error error
				done(sigfoxdeviceDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Sigfoxdevice.remove().exec();
		done();
	});
});