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
