'use strict';

//Sigfoxmsgs service used to communicate Sigfoxmsgs REST endpoints
angular.module('sigfoxmsgs').factory('Sigfoxmsgs', ['$resource',
	function($resource) {
		return $resource('sigfoxmsgs/:sigfoxmsgId', { sigfoxmsgId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);