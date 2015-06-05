'use strict';

//Setting up route
angular.module('sigfoxmsgs').config(['$stateProvider',
	function($stateProvider) {
		// Sigfoxmsgs state routing
		$stateProvider.
		state('listSigfoxmsgs', {
			url: '/sigfoxmsgs',
			templateUrl: 'modules/sigfoxmsgs/views/list-sigfoxmsgs.client.view.html'
		}).
		state('createSigfoxmsg', {
			url: '/sigfoxmsgs/create',
			templateUrl: 'modules/sigfoxmsgs/views/create-sigfoxmsg.client.view.html'
		}).
		state('viewSigfoxmsg', {
			url: '/sigfoxmsgs/:sigfoxmsgId',
			templateUrl: 'modules/sigfoxmsgs/views/view-sigfoxmsg.client.view.html'
		}).
		state('editSigfoxmsg', {
			url: '/sigfoxmsgs/:sigfoxmsgId/edit',
			templateUrl: 'modules/sigfoxmsgs/views/edit-sigfoxmsg.client.view.html'
		});
	}
]);