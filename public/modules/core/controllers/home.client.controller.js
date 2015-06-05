'use strict';

var coreApp = angular.module('core');

coreApp.controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);

coreApp.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
        //colours: ['#FF5252', '#FF8A80'],
        responsive: true,
        // String - Template string for single tooltips
        tooltipTemplate: '<%= value %>'
    });
    // Configure all line charts
    ChartJsProvider.setOptions('Line', {
        bezierCurve : false
    });
}]);

coreApp.controller('HeaderController', ['$scope', function($scope) {
    $scope.isCollapsed = false;

    $scope.toggleCollapsibleMenu = function() {
        $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function() {
        $scope.isCollapsed = false;
    });
}]);

coreApp.controller('aDayAgoChart', ['$scope',
    function ($scope) {

        $scope.options = {
            colours: ['#FF5200', '#FF8A80'],
            color:'#F7464A',
            scaleShowHorizontalLines: false,
            label: 'My First dataset',
            fillColor: 'rgba(220,220,220,0.2)',
            strokeColor: 'rgba(220,220,220,1)'
        };

        $scope.labels = ['8h', '09', '', '', '12', '', '', '15', '', '', '18',
            '', '', '21', '', '', '00', '', '', '03', '', '', '06', '07'];
        $scope.series = ['Series A'];
        $scope.data = [
            [130, 130, 122, 115, 97, 96, 73, 50, 225, 210, 190]
        ];
    }
]);

coreApp.controller('foodConsChartCtrl', ['$scope',
    function ($scope) {
        $scope.weekLabels = ['Thue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun', 'Mon'];
        $scope.dayLabels = ['01', '', '', '04', '', '', '', '08', '', '', '', '12', '', '', '', '16', '', '', '', '20', '', '', '', '00'];
        $scope.series = ['Series A'];

        $scope.dayData = [
            [28, 48, 40, 19, 86, 27, 90]
        ];
        $scope.weekData = [
            [28, 48, 40, 19, 86, 27, 90]
        ];

    }
]);

coreApp.controller('foodConsumptionCtrl', ['$scope',
    function ($scope) {
        $scope.today = 15;
        $scope.week = 154;
    }
]);

coreApp.controller('foodLevelCtrl', ['$scope',
    function ($scope) {
        $scope.now = 124;
        $scope.oneHourAgo = -17;
    }
]);
