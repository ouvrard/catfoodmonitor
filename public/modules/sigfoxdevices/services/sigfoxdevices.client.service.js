'use strict';

//Sigfoxdevices service used to communicate Sigfoxdevices REST endpoints
angular.module('sigfoxdevices').factory('Sigfoxdevices', ['$resource',
	function($resource) {
		return $resource('sigfoxdevices/:sigfoxdeviceId', { sigfoxdeviceId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);