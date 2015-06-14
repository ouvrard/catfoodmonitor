'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

// Bug fix : boostrap's carousel doesn't work with angular
// Disable NgAnimate for with carousel class
 angular.module(ApplicationConfiguration.applicationModuleName).config(['$animateProvider',
    function($animateProvider) {
        $animateProvider.classNameFilter(/animate-/);
        //$animateProvider.classNameFilter(/prefix-/);
    }
 ]);
