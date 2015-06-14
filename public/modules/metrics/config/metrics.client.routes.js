'use strict';

//Setting up route
angular.module('metrics').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

        // Default route
        $urlRouterProvider.otherwise('/metrics/5575fd637dccc10b00f52377');

		// Metrics state routing
		$stateProvider.
        state('viewMetric', {
            url: '/metrics/:metricId',
            templateUrl: 'modules/metrics/views/view-metric.client.view.html'
        }).
		state('listMetrics', {
			url: '/metrics',
			templateUrl: 'modules/metrics/views/list-metrics.client.view.html'
		}).
		state('createMetric', {
			url: '/metrics/create',
			templateUrl: 'modules/metrics/views/create-metric.client.view.html'
		}).
        state('editMetric', {
			url: '/metrics/:metricId/edit',
			templateUrl: 'modules/metrics/views/edit-metric.client.view.html'
		});
	}
]);
