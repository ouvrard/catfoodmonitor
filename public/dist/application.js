'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'catfoodmonitor';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'chart.js'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

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

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('metrics');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('sigfoxdevices');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('sigfoxmsgs');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
/* TODO : core module routes
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider) {

		// Home state routing
		$stateProvider.

        state('howItWorks', {
            url: '/howItWorks',
            templateUrl: 'modules/core/views/hiw.client.view.html',
            controller: 'skrollrCtrl'
        }).
        state('more', {
            url: '/more',
            templateUrl: 'modules/core/views/more.client.view.html'
        });

	}
]);
 */

'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
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

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}
			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar', true);
	}
]);

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
                var now = moment().utc();
                var yesterday = moment().utc().subtract(1, 'day');
                var hourAgo = moment().utc().subtract(1, 'hour');

                $scope.hour = now.hour();
                $scope.day = now.day();
                $scope.hourAgo = hourAgo.hour();
                $scope.lastDay = yesterday.day();
                $scope.TZOffset = moment().utcOffset()/60;

                // Weekly food consumption chart
                $scope.daysOfTheWeek = ['D', 'L', 'M', 'Me', 'J', 'V', 'S'];
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

                // Iterators vars
                var i, j, n;

                //console.log($scope);

                var len = $scope.metric.dailyMetrics.length;
                var m, iUTC;
                // Today
                for(i=0; i<len; i++)
                {
                    m = $scope.metric.dailyMetrics[i];
                    iUTC = (m._id + $scope.TZOffset)%24;

                    // Labels for level history chart
                    if(i%4 === 0 || i === len-1)
                        $scope.labels[i] = ((iUTC<10)? '0':'') + iUTC;
                    else
                        $scope.labels[i] = '';

                    // Value for level history chart
                    $scope.data[0][i] = $scope.metric.dailyMetrics[i].load;

                    // Initialize value --> Chart display issues
                    $scope.dayData[0][i] = 0;

                    if (m._id <= $scope.hour) {
                        // Values for the food bar chart
                        $scope.dayData[0][iUTC] = $scope.metric.dailyMetrics[m._id].delta;
                        // Sum hourly food consumption
                        $scope.today += $scope.metric.dailyMetrics[m._id].delta;
                    }
                }

                // Round food consumption sum
                $scope.today = Math.round($scope.today);

                // Current food container level
                if(len > 1) {
                    $scope.now = Math.round($scope.metric.dailyMetrics[(len-1)].load);
                    $scope.oneHourAgo =  Math.round($scope.now - $scope.metric.dailyMetrics[(len-2)].load);
                }

                // Weekly metrics
                for(i=0,n=7; i<n; ++i)
                {
                    // Find the index of the next day of the week (...+1)
                    var d = (i + $scope.day +1)%n;
                    $scope.weekLabels[i] = $scope.daysOfTheWeek[d];

                    // Initialize value
                    $scope.weekData[0][i] = 0;

                    // Loop through the raw data array to find a record for the day i
                    for(j=0, m=$scope.metric.weeklyMetrics.length;j<m;j++){
                        // Mongo day index: 1 to 7 / JS: 0 to 6
                        if($scope.metric.weeklyMetrics[j]._id - 1 === d){
                            $scope.weekData[0][i] = $scope.metric.weeklyMetrics[j].delta;
                            break;
                        }
                    }

                    // Food consumption
                    if(i < m)
                        $scope.week += $scope.metric.weeklyMetrics[i].delta;
                }
                $scope.week = Math.round($scope.week);
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

metricsModule.controller('slidesCtrl', ['$scope',
    function ($scope) {
        $scope.interval = 0;
        $scope.pause = true;
        $scope.slides = [
            {
                image: '/modules/metrics/img/story/01.jpg',
                caption:'Suivi en temps réel de la consommation alimentaire de mes chats',
                desc:'Le principe repose sur la mesure du poids du récipient contenant la nourriture de mes chats au cours du temps pour en déduire la variation de masse et donc la quantité consommée.'
            },
            {
                image: '/modules/metrics/img/story/02.jpg',
                caption:'Matériel nécessaire',
                desc:''
            },
            {
                image: '/modules/metrics/img/story/03.jpg',
                caption:'La balance',
                desc:'Il s\'agit d\'une balance de cuisine que l\'on trouve dans le commerce.'
            },
            {
                image: '/modules/metrics/img/story/04.jpg',
                caption:'',
                desc:'Il faut la démonter pour accéder à la carte électronique.'
            },{
                image: '/modules/metrics/img/story/05.jpg',
                caption:'',
                desc:'Le capteur possède 4 fils repérés B, G, Y et R.'
            },{
                image: '/modules/metrics/img/story/06.jpg',
                caption:'',
                desc:'On désoude les fils du capteur et on les rallonge pour les faire sortir.'
            },{
                image: '/modules/metrics/img/story/07.jpg',
                caption:'',
                desc:'On peut maintenant raccorder le capteur à la carte Arduino.'
            },{
                image: '/modules/metrics/img/story/08.jpg',
                caption:'Le montage életronique',
                desc:'Le signal du capteur de force dans la balance est trop faible pour être détécté. Le rôle du circuit imprimmé est d\'amplifier le signal.'
            },{
                image: '/modules/metrics/img/story/09.jpg',
                caption:'',
                desc:'Voici le montage fini...'
            },{
                image: '/modules/metrics/img/story/10.jpg',
                caption:'',
                desc:'Après calibration au potentiomètre, la résistance de gain pour l\'amplificateur doit être d\'environ 50 Ohms... Ce qui explique les 5 résitances de 10 Ohms en série !'
            },{
                image: '/modules/metrics/img/story/11.jpg',
                caption:'',
                desc:'Les cartes Akeru sont des Arduino avec un modem radio UNB pour émettre sur les fréquences utilisées par SigFox (868 mHz). Il faut simplement charger la bibliothèque Akeru pour faire fonctionner le modem.'
            },{
                image: '/modules/metrics/img/story/12.jpg',
                caption:'',
                desc:'A la mise sous tension, le programme fait la tare du récipent pour ne peser que son contenu. Ensuite, toutes les 15 minutes, la masse est envoyée sur le réseaux Sigfox.'
            },{
                image: '/modules/metrics/img/story/13.jpg',
                caption:'Transit sur le réseau Sigfox',
                desc:'Le message émis par la carte est capté par les antennes de Sigfox, puis transféré sur le serveur de l\'application'
            },{
                image: '/modules/metrics/img/story/14.jpg',
                caption:'Application',
                desc:'L’application (client/serveur) est basée sur MEAN.JS qui est une solution javascript fullstack. MongoDB (base de données), Express (framework Node.JS), AngularJS (framework client) et Node.JS (serveur).'
            },{
                image: '/modules/metrics/img/story/15.jpg',
                caption:'',
                desc:'L’application serveur dispose d’une API pour réceptionner les messages provenant du réseau Sigfox mais assure également les interactions avec le client web. L’application client est une Single Page Application sous AnugularJs qui dialogue avec l’application serveur via une autre API, notamment pour l’affichage des métriques.'
            },{
                image: '/modules/metrics/img/story/16.jpg',
                caption:'Conclusion',
                desc:'Le système en fonctionnement.'
            },{
                image: '/modules/metrics/img/story/17.jpg',
                caption:'',
                desc:'Aucun animal n’a été blessé pendant ce projet.'
            }
        ];
    }
]);

'use strict';

//Metrics service used to communicate Metrics REST endpoints
angular.module('metrics').factory('Metrics', ['$resource',
	function($resource) {
		return $resource('metrics/:metricId', { metricId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

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
'use strict';

// Sigfoxdevices controller
angular.module('sigfoxdevices').controller('SigfoxdevicesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sigfoxdevices',
	function($scope, $stateParams, $location, Authentication, Sigfoxdevices) {
		$scope.authentication = Authentication;

		// Create new Sigfoxdevice
		$scope.create = function() {
			// Create new Sigfoxdevice object
			var sigfoxdevice = new Sigfoxdevices ({
				name: this.name
			});

			// Redirect after save
			sigfoxdevice.$save(function(response) {
				$location.path('sigfoxdevices/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Sigfoxdevice
		$scope.remove = function(sigfoxdevice) {
			if ( sigfoxdevice ) { 
				sigfoxdevice.$remove();

				for (var i in $scope.sigfoxdevices) {
					if ($scope.sigfoxdevices [i] === sigfoxdevice) {
						$scope.sigfoxdevices.splice(i, 1);
					}
				}
			} else {
				$scope.sigfoxdevice.$remove(function() {
					$location.path('sigfoxdevices');
				});
			}
		};

		// Update existing Sigfoxdevice
		$scope.update = function() {
			var sigfoxdevice = $scope.sigfoxdevice;

			sigfoxdevice.$update(function() {
				$location.path('sigfoxdevices/' + sigfoxdevice._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Sigfoxdevices
		$scope.find = function() {
			$scope.sigfoxdevices = Sigfoxdevices.query();
		};

		// Find existing Sigfoxdevice
		$scope.findOne = function() {
			$scope.sigfoxdevice = Sigfoxdevices.get({ 
				sigfoxdeviceId: $stateParams.sigfoxdeviceId
			});
		};
	}
]);
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
'use strict';

// Sigfoxmsgs controller
angular.module('sigfoxmsgs').controller('SigfoxmsgsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sigfoxmsgs',
	function($scope, $stateParams, $location, Authentication, Sigfoxmsgs) {
		$scope.authentication = Authentication;

		// Create new Sigfoxmsg
		$scope.create = function() {
			// Create new Sigfoxmsg object
			var sigfoxmsg = new Sigfoxmsgs ({
				name: this.name
			});

			// Redirect after save
			sigfoxmsg.$save(function(response) {
				$location.path('sigfoxmsgs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Sigfoxmsg
		$scope.remove = function(sigfoxmsg) {
			if ( sigfoxmsg ) { 
				sigfoxmsg.$remove();

				for (var i in $scope.sigfoxmsgs) {
					if ($scope.sigfoxmsgs [i] === sigfoxmsg) {
						$scope.sigfoxmsgs.splice(i, 1);
					}
				}
			} else {
				$scope.sigfoxmsg.$remove(function() {
					$location.path('sigfoxmsgs');
				});
			}
		};

		// Update existing Sigfoxmsg
		$scope.update = function() {
			var sigfoxmsg = $scope.sigfoxmsg;

			sigfoxmsg.$update(function() {
				$location.path('sigfoxmsgs/' + sigfoxmsg._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Sigfoxmsgs
		$scope.find = function() {
			$scope.sigfoxmsgs = Sigfoxmsgs.query();
		};

		// Find existing Sigfoxmsg
		$scope.findOne = function() {
			$scope.sigfoxmsg = Sigfoxmsgs.get({ 
				sigfoxmsgId: $stateParams.sigfoxmsgId
			});
		};
	}
]);
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
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route

angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		/*state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).*/
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);