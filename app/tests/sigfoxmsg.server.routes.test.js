'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Sigfoxmsg = mongoose.model('Sigfoxmsg'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, sigfoxmsg;

/**
 * Sigfoxmsg routes tests
 */
describe('Sigfoxmsg CRUD tests', function() {
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

		// Save a user to the test db and create new Sigfoxmsg
		user.save(function() {
			sigfoxmsg = {
				name: 'Sigfoxmsg Name'
			};

			done();
		});
	});

	it('should be able to save Sigfoxmsg instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sigfoxmsg
				agent.post('/sigfoxmsgs')
					.send(sigfoxmsg)
					.expect(200)
					.end(function(sigfoxmsgSaveErr, sigfoxmsgSaveRes) {
						// Handle Sigfoxmsg save error
						if (sigfoxmsgSaveErr) done(sigfoxmsgSaveErr);

						// Get a list of Sigfoxmsgs
						agent.get('/sigfoxmsgs')
							.end(function(sigfoxmsgsGetErr, sigfoxmsgsGetRes) {
								// Handle Sigfoxmsg save error
								if (sigfoxmsgsGetErr) done(sigfoxmsgsGetErr);

								// Get Sigfoxmsgs list
								var sigfoxmsgs = sigfoxmsgsGetRes.body;

								// Set assertions
								(sigfoxmsgs[0].user._id).should.equal(userId);
								(sigfoxmsgs[0].name).should.match('Sigfoxmsg Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Sigfoxmsg instance if not logged in', function(done) {
		agent.post('/sigfoxmsgs')
			.send(sigfoxmsg)
			.expect(401)
			.end(function(sigfoxmsgSaveErr, sigfoxmsgSaveRes) {
				// Call the assertion callback
				done(sigfoxmsgSaveErr);
			});
	});

	it('should not be able to save Sigfoxmsg instance if no name is provided', function(done) {
		// Invalidate name field
		sigfoxmsg.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sigfoxmsg
				agent.post('/sigfoxmsgs')
					.send(sigfoxmsg)
					.expect(400)
					.end(function(sigfoxmsgSaveErr, sigfoxmsgSaveRes) {
						// Set message assertion
						(sigfoxmsgSaveRes.body.message).should.match('Please fill Sigfoxmsg name');
						
						// Handle Sigfoxmsg save error
						done(sigfoxmsgSaveErr);
					});
			});
	});

	it('should be able to update Sigfoxmsg instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sigfoxmsg
				agent.post('/sigfoxmsgs')
					.send(sigfoxmsg)
					.expect(200)
					.end(function(sigfoxmsgSaveErr, sigfoxmsgSaveRes) {
						// Handle Sigfoxmsg save error
						if (sigfoxmsgSaveErr) done(sigfoxmsgSaveErr);

						// Update Sigfoxmsg name
						sigfoxmsg.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Sigfoxmsg
						agent.put('/sigfoxmsgs/' + sigfoxmsgSaveRes.body._id)
							.send(sigfoxmsg)
							.expect(200)
							.end(function(sigfoxmsgUpdateErr, sigfoxmsgUpdateRes) {
								// Handle Sigfoxmsg update error
								if (sigfoxmsgUpdateErr) done(sigfoxmsgUpdateErr);

								// Set assertions
								(sigfoxmsgUpdateRes.body._id).should.equal(sigfoxmsgSaveRes.body._id);
								(sigfoxmsgUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Sigfoxmsgs if not signed in', function(done) {
		// Create new Sigfoxmsg model instance
		var sigfoxmsgObj = new Sigfoxmsg(sigfoxmsg);

		// Save the Sigfoxmsg
		sigfoxmsgObj.save(function() {
			// Request Sigfoxmsgs
			request(app).get('/sigfoxmsgs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Sigfoxmsg if not signed in', function(done) {
		// Create new Sigfoxmsg model instance
		var sigfoxmsgObj = new Sigfoxmsg(sigfoxmsg);

		// Save the Sigfoxmsg
		sigfoxmsgObj.save(function() {
			request(app).get('/sigfoxmsgs/' + sigfoxmsgObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', sigfoxmsg.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Sigfoxmsg instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sigfoxmsg
				agent.post('/sigfoxmsgs')
					.send(sigfoxmsg)
					.expect(200)
					.end(function(sigfoxmsgSaveErr, sigfoxmsgSaveRes) {
						// Handle Sigfoxmsg save error
						if (sigfoxmsgSaveErr) done(sigfoxmsgSaveErr);

						// Delete existing Sigfoxmsg
						agent.delete('/sigfoxmsgs/' + sigfoxmsgSaveRes.body._id)
							.send(sigfoxmsg)
							.expect(200)
							.end(function(sigfoxmsgDeleteErr, sigfoxmsgDeleteRes) {
								// Handle Sigfoxmsg error error
								if (sigfoxmsgDeleteErr) done(sigfoxmsgDeleteErr);

								// Set assertions
								(sigfoxmsgDeleteRes.body._id).should.equal(sigfoxmsgSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Sigfoxmsg instance if not signed in', function(done) {
		// Set Sigfoxmsg user 
		sigfoxmsg.user = user;

		// Create new Sigfoxmsg model instance
		var sigfoxmsgObj = new Sigfoxmsg(sigfoxmsg);

		// Save the Sigfoxmsg
		sigfoxmsgObj.save(function() {
			// Try deleting Sigfoxmsg
			request(app).delete('/sigfoxmsgs/' + sigfoxmsgObj._id)
			.expect(401)
			.end(function(sigfoxmsgDeleteErr, sigfoxmsgDeleteRes) {
				// Set message assertion
				(sigfoxmsgDeleteRes.body.message).should.match('User is not logged in');

				// Handle Sigfoxmsg error error
				done(sigfoxmsgDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Sigfoxmsg.remove().exec();
		done();
	});
});