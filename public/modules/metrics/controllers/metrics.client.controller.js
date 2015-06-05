'use strict';

var metricsModule = angular.module('metrics');

// Metrics controller
metricsModule.controller('MetricsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Metrics',
	function($scope, $stateParams, $location, Authentication, Metrics) {
		$scope.authentication = Authentication;

		// Create new Metric
		$scope.create = function() {
			// Create new Metric object
			var metric = new Metrics ({
				name: this.name
			});

			// Redirect after save
			metric.$save(function(response) {
				$location.path('metrics/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Metric
		$scope.remove = function(metric) {
			if ( metric ) { 
				metric.$remove();

				for (var i in $scope.metrics) {
					if ($scope.metrics [i] === metric) {
						$scope.metrics.splice(i, 1);
					}
				}
			} else {
				$scope.metric.$remove(function() {
					$location.path('metrics');
				});
			}
		};

		// Update existing Metric
		$scope.update = function() {
			var metric = $scope.metric;

			metric.$update(function() {
				$location.path('metrics/' + metric._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Metrics
		$scope.find = function() {
			$scope.metrics = Metrics.query();
		};

		// Find existing Metric
		$scope.findOne = function() {
            $scope.dayData = [];

            $scope.metric = Metrics.get({metricId: $stateParams.metricId});

            $scope.metric.$promise.then(function() {
                var today = new Date();
                var yesterday = new Date(today.getTime() - (1000*60*60*24));
                var hourago = new Date(today.getTime() - (1000*60*60));
                $scope.hour = today.getHours();
                $scope.day = today.getDay();
                $scope.hourAgo = hourago.getHours();
                $scope.lastDay = yesterday.getDay();

                // Weekly food consumption chart
                $scope.daysOfTheWeek = ['Mon', 'Thue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
                $scope.weekLabels = [];
                $scope.weekData = [[]];

                // Daily food consumption chart
                $scope.dayLabels = ['00', '', '', '03', '', '', '06', '', '', '09', '', '', '12', '', '', '15', '', '', '18', '', '', '21', '', ''];
                $scope.dayData = [[]];

                // Daily food level chart
                $scope.labels = [];
                $scope.data = [[]];

                // Food consumption
                $scope.today = 0;
                $scope.week = 0;

                // Current food container level
                $scope.now = (typeof $scope.metric.dailyMetrics[$scope.hour] !== 'undefined')? $scope.metric.dailyMetrics[$scope.hour].load : 'n/a';
                $scope.oneHourAgo = (typeof $scope.metric.dailyMetrics[$scope.hourAgo] !== 'undefined')? $scope.metric.dailyMetrics[$scope.hourAgo].load : 'n/a';

                // Iterators vars
                var i, j, n, m;
                var iH;

                // Today
                for(i=0; i<24; i++)
                {
                    // Labels
                    iH = (i+$scope.hour)%24;
                    if(i%4 === 0 || i === 23)
                        $scope.labels[i] = ((iH<10)? '0':'') + iH;
                    else
                        $scope.labels[i] = '';

                    // Initialize value --> Chart display issues
                    $scope.data[0][i] = 0;
                    $scope.dayData[0][i] = 0;

                    // Loop through the raw data array to find a record for the day i
                    for(j = 0,n=$scope.metric.dailyMetrics.length;j<n;j++) {
                        if ($scope.metric.dailyMetrics[j]._id === i) {
                            $scope.dayData[0][i] = $scope.metric.dailyMetrics[j].delta;
                        }
                        if ($scope.metric.dailyMetrics[j]._id === iH) {
                            $scope.data[0][i] = $scope.metric.dailyMetrics[j].load;
                        }
                    }

                    // Food consumption
                    if(i < n)
                        $scope.today += $scope.metric.dailyMetrics[i].delta;
                }

                // Weekly metrics
                for(i=0,n=7; i<n; ++i)
                {
                    // Find the index of the day
                    var d = (i+$scope.day)%n;
                    $scope.weekLabels[i] = $scope.daysOfTheWeek[d];

                    // Initialize value
                    $scope.weekData[0][i] = 0;

                    // Loop through the raw data array to find a record for the day i
                    for(j=0, m=$scope.metric.weeklyMetrics.length;j<m;j++){
                        // Mongo day index: 1 to 7 / JS: 0 to 6
                        if($scope.metric.weeklyMetrics[j]._id - 1 === d){
                            $scope.weekData[0][i] = $scope.metric.weeklyMetrics[j].delta;
                        }
                    }

                    // Food consumption
                    if(i < m)
                        $scope.week += $scope.metric.weeklyMetrics[i].delta;
                }
            });
        };
	}
]);

metricsModule.controller('aDayAgoChart', ['$scope',
    function ($scope) {}
]);

metricsModule.controller('foodConsChartCtrl', ['$scope',
    function ($scope) {}
]);

metricsModule.controller('foodConsumptionCtrl', ['$scope',
    function ($scope) {}
]);

metricsModule.controller('foodLevelCtrl', ['$scope',
    function ($scope) {}
]);
