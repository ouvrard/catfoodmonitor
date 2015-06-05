'use strict';

(function() {
	// Sigfoxdevices Controller Spec
	describe('Sigfoxdevices Controller Tests', function() {
		// Initialize global variables
		var SigfoxdevicesController,
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

			// Initialize the Sigfoxdevices controller.
			SigfoxdevicesController = $controller('SigfoxdevicesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Sigfoxdevice object fetched from XHR', inject(function(Sigfoxdevices) {
			// Create sample Sigfoxdevice using the Sigfoxdevices service
			var sampleSigfoxdevice = new Sigfoxdevices({
				name: 'New Sigfoxdevice'
			});

			// Create a sample Sigfoxdevices array that includes the new Sigfoxdevice
			var sampleSigfoxdevices = [sampleSigfoxdevice];

			// Set GET response
			$httpBackend.expectGET('sigfoxdevices').respond(sampleSigfoxdevices);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sigfoxdevices).toEqualData(sampleSigfoxdevices);
		}));

		it('$scope.findOne() should create an array with one Sigfoxdevice object fetched from XHR using a sigfoxdeviceId URL parameter', inject(function(Sigfoxdevices) {
			// Define a sample Sigfoxdevice object
			var sampleSigfoxdevice = new Sigfoxdevices({
				name: 'New Sigfoxdevice'
			});

			// Set the URL parameter
			$stateParams.sigfoxdeviceId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/sigfoxdevices\/([0-9a-fA-F]{24})$/).respond(sampleSigfoxdevice);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sigfoxdevice).toEqualData(sampleSigfoxdevice);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Sigfoxdevices) {
			// Create a sample Sigfoxdevice object
			var sampleSigfoxdevicePostData = new Sigfoxdevices({
				name: 'New Sigfoxdevice'
			});

			// Create a sample Sigfoxdevice response
			var sampleSigfoxdeviceResponse = new Sigfoxdevices({
				_id: '525cf20451979dea2c000001',
				name: 'New Sigfoxdevice'
			});

			// Fixture mock form input values
			scope.name = 'New Sigfoxdevice';

			// Set POST response
			$httpBackend.expectPOST('sigfoxdevices', sampleSigfoxdevicePostData).respond(sampleSigfoxdeviceResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Sigfoxdevice was created
			expect($location.path()).toBe('/sigfoxdevices/' + sampleSigfoxdeviceResponse._id);
		}));

		it('$scope.update() should update a valid Sigfoxdevice', inject(function(Sigfoxdevices) {
			// Define a sample Sigfoxdevice put data
			var sampleSigfoxdevicePutData = new Sigfoxdevices({
				_id: '525cf20451979dea2c000001',
				name: 'New Sigfoxdevice'
			});

			// Mock Sigfoxdevice in scope
			scope.sigfoxdevice = sampleSigfoxdevicePutData;

			// Set PUT response
			$httpBackend.expectPUT(/sigfoxdevices\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/sigfoxdevices/' + sampleSigfoxdevicePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid sigfoxdeviceId and remove the Sigfoxdevice from the scope', inject(function(Sigfoxdevices) {
			// Create new Sigfoxdevice object
			var sampleSigfoxdevice = new Sigfoxdevices({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Sigfoxdevices array and include the Sigfoxdevice
			scope.sigfoxdevices = [sampleSigfoxdevice];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/sigfoxdevices\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSigfoxdevice);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.sigfoxdevices.length).toBe(0);
		}));
	});
}());