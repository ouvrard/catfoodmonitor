'use strict';

// Configuring the Articles module
angular.module('core').run(['Menus',
	function(Menus) {

		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Mes', 'mes', 'dropdown', '/mes(/create)?');
		Menus.addSubMenuItem('topbar', 'mes', 'List Mes', 'mes');
		Menus.addSubMenuItem('topbar', 'mes', 'New Me', 'mes/create');
	}
]);


angular.module('metrics').config(['ChartJsProvider', function (ChartJsProvider) {
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
