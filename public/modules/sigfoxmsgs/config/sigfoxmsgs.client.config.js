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
