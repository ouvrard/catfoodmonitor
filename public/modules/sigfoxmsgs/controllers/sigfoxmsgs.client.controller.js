'use strict';

// Sigfoxmsgs controller
angular.module('sigfoxmsgs').controller('SigfoxmsgsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sigfoxmsgs',
	function($scope, $stateParams, $location, Authentication, Sigfoxmsgs) {
		$scope.authentication = Authentication;

		// Create new Sigfoxmsg
		$scope.create = function() {
			// Create new Sigfoxmsg object
			var sigfoxmsg = new Sigfoxmsgs ({
				name: this.name
			});

			// Redirect after save
			sigfoxmsg.$save(function(response) {
				$location.path('sigfoxmsgs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Sigfoxmsg
		$scope.remove = function(sigfoxmsg) {
			if ( sigfoxmsg ) { 
				sigfoxmsg.$remove();

				for (var i in $scope.sigfoxmsgs) {
					if ($scope.sigfoxmsgs [i] === sigfoxmsg) {
						$scope.sigfoxmsgs.splice(i, 1);
					}
				}
			} else {
				$scope.sigfoxmsg.$remove(function() {
					$location.path('sigfoxmsgs');
				});
			}
		};

		// Update existing Sigfoxmsg
		$scope.update = function() {
			var sigfoxmsg = $scope.sigfoxmsg;

			sigfoxmsg.$update(function() {
				$location.path('sigfoxmsgs/' + sigfoxmsg._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Sigfoxmsgs
		$scope.find = function() {
			$scope.sigfoxmsgs = Sigfoxmsgs.query();
		};

		// Find existing Sigfoxmsg
		$scope.findOne = function() {
			$scope.sigfoxmsg = Sigfoxmsgs.get({ 
				sigfoxmsgId: $stateParams.sigfoxmsgId
			});
		};
	}
]);