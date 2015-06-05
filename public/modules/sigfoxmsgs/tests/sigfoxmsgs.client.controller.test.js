'use strict';

(function() {
	// Sigfoxmsgs Controller Spec
	describe('Sigfoxmsgs Controller Tests', function() {
		// Initialize global variables
		var SigfoxmsgsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Sigfoxmsgs controller.
			SigfoxmsgsController = $controller('SigfoxmsgsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Sigfoxmsg object fetched from XHR', inject(function(Sigfoxmsgs) {
			// Create sample Sigfoxmsg using the Sigfoxmsgs service
			var sampleSigfoxmsg = new Sigfoxmsgs({
				name: 'New Sigfoxmsg'
			});

			// Create a sample Sigfoxmsgs array that includes the new Sigfoxmsg
			var sampleSigfoxmsgs = [sampleSigfoxmsg];

			// Set GET response
			$httpBackend.expectGET('sigfoxmsgs').respond(sampleSigfoxmsgs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sigfoxmsgs).toEqualData(sampleSigfoxmsgs);
		}));

		it('$scope.findOne() should create an array with one Sigfoxmsg object fetched from XHR using a sigfoxmsgId URL parameter', inject(function(Sigfoxmsgs) {
			// Define a sample Sigfoxmsg object
			var sampleSigfoxmsg = new Sigfoxmsgs({
				name: 'New Sigfoxmsg'
			});

			// Set the URL parameter
			$stateParams.sigfoxmsgId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/sigfoxmsgs\/([0-9a-fA-F]{24})$/).respond(sampleSigfoxmsg);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sigfoxmsg).toEqualData(sampleSigfoxmsg);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Sigfoxmsgs) {
			// Create a sample Sigfoxmsg object
			var sampleSigfoxmsgPostData = new Sigfoxmsgs({
				name: 'New Sigfoxmsg'
			});

			// Create a sample Sigfoxmsg response
			var sampleSigfoxmsgResponse = new Sigfoxmsgs({
				_id: '525cf20451979dea2c000001',
				name: 'New Sigfoxmsg'
			});

			// Fixture mock form input values
			scope.name = 'New Sigfoxmsg';

			// Set POST response
			$httpBackend.expectPOST('sigfoxmsgs', sampleSigfoxmsgPostData).respond(sampleSigfoxmsgResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Sigfoxmsg was created
			expect($location.path()).toBe('/sigfoxmsgs/' + sampleSigfoxmsgResponse._id);
		}));

		it('$scope.update() should update a valid Sigfoxmsg', inject(function(Sigfoxmsgs) {
			// Define a sample Sigfoxmsg put data
			var sampleSigfoxmsgPutData = new Sigfoxmsgs({
				_id: '525cf20451979dea2c000001',
				name: 'New Sigfoxmsg'
			});

			// Mock Sigfoxmsg in scope
			scope.sigfoxmsg = sampleSigfoxmsgPutData;

			// Set PUT response
			$httpBackend.expectPUT(/sigfoxmsgs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/sigfoxmsgs/' + sampleSigfoxmsgPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid sigfoxmsgId and remove the Sigfoxmsg from the scope', inject(function(Sigfoxmsgs) {
			// Create new Sigfoxmsg object
			var sampleSigfoxmsg = new Sigfoxmsgs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Sigfoxmsgs array and include the Sigfoxmsg
			scope.sigfoxmsgs = [sampleSigfoxmsg];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/sigfoxmsgs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSigfoxmsg);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.sigfoxmsgs.length).toBe(0);
		}));
	});
}());