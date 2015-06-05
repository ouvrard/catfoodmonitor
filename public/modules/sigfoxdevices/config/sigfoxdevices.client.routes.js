'use strict';

//Setting up route
angular.module('sigfoxdevices').config(['$stateProvider',
	function($stateProvider) {
		// Sigfoxdevices state routing
		$stateProvider.
		state('listSigfoxdevices', {
			url: '/sigfoxdevices',
			templateUrl: 'modules/sigfoxdevices/views/list-sigfoxdevices.client.view.html'
		}).
		state('createSigfoxdevice', {
			url: '/sigfoxdevices/create',
			templateUrl: 'modules/sigfoxdevices/views/create-sigfoxdevice.client.view.html'
		}).
		state('viewSigfoxdevice', {
			url: '/sigfoxdevices/:sigfoxdeviceId',
			templateUrl: 'modules/sigfoxdevices/views/view-sigfoxdevice.client.view.html'
		}).
		state('editSigfoxdevice', {
			url: '/sigfoxdevices/:sigfoxdeviceId/edit',
			templateUrl: 'modules/sigfoxdevices/views/edit-sigfoxdevice.client.view.html'
		});
	}
]);