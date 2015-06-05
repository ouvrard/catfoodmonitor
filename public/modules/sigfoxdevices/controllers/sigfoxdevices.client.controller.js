'use strict';

// Sigfoxdevices controller
angular.module('sigfoxdevices').controller('SigfoxdevicesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sigfoxdevices',
	function($scope, $stateParams, $location, Authentication, Sigfoxdevices) {
		$scope.authentication = Authentication;

		// Create new Sigfoxdevice
		$scope.create = function() {
			// Create new Sigfoxdevice object
			var sigfoxdevice = new Sigfoxdevices ({
				name: this.name
			});

			// Redirect after save
			sigfoxdevice.$save(function(response) {
				$location.path('sigfoxdevices/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Sigfoxdevice
		$scope.remove = function(sigfoxdevice) {
			if ( sigfoxdevice ) { 
				sigfoxdevice.$remove();

				for (var i in $scope.sigfoxdevices) {
					if ($scope.sigfoxdevices [i] === sigfoxdevice) {
						$scope.sigfoxdevices.splice(i, 1);
					}
				}
			} else {
				$scope.sigfoxdevice.$remove(function() {
					$location.path('sigfoxdevices');
				});
			}
		};

		// Update existing Sigfoxdevice
		$scope.update = function() {
			var sigfoxdevice = $scope.sigfoxdevice;

			sigfoxdevice.$update(function() {
				$location.path('sigfoxdevices/' + sigfoxdevice._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Sigfoxdevices
		$scope.find = function() {
			$scope.sigfoxdevices = Sigfoxdevices.query();
		};

		// Find existing Sigfoxdevice
		$scope.findOne = function() {
			$scope.sigfoxdevice = Sigfoxdevices.get({ 
				sigfoxdeviceId: $stateParams.sigfoxdeviceId
			});
		};
	}
]);