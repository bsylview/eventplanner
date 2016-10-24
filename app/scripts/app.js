(function () {
    'use strict';
/**
 * @ngdoc overview
 * @name eventPlannerProjectApp
 * @description
 * # eventPlannerProjectApp
 *
 * Main module of the application.
 */
	var app = angular.module('eventPlannerProjectApp', ['ui.router','firebase','ngMaterial','ngMessages','ae-datetimepicker']);
  app.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/events/currentevents');
    $stateProvider
        .state('register',{
            url: '/register',
            templateUrl: 'views/register.html',
            controller:'RegisterCtrl as registerController'
        })
        .state('accountdetails',{
            url: '/accountdetails',
            templateUrl: 'views/accountdetails.html',
            controller:'AccountdetailsCtrl as accountController',
              resolve: {
                security: ['$q', 'firebaseService', '$location', function($q,firebaseService, $location){
                    if(!firebaseService.getCurrentUser()){
                       return $q.reject("'/login'");
                    }
                }]
             }
        })
        .state('login',{
            url: '/login',
            templateUrl: 'views/login.html',
            controller:'LoginCtrl as loginController'
        })
        .state('events',{
              url: '/events',
              templateUrl: 'views/events.html',
              controller:'EventsCtrl as eventsController'
        }).state('events.current',{
                url: '/currentevents',
                templateUrl: 'views/events-current.html',
                controller:'EventsCtrl as eventsController'
        }).state('events.all',{
                url: '/allevents',
                templateUrl: 'views/events-all.html',
                controller:'EventsCtrl as eventsController'
        }).state('newevent',{
            url: '/newevent',
            templateUrl: 'views/newevent.html',
            controller:'NeweventCtrl as newEventController',
              resolve: {
                security: ['$q', 'firebaseService', function($q,firebaseService){
                    if(!firebaseService.getCurrentUser()){
                       return $q.reject("'/login'");
                    }
                }]
             }
          });
  }]);

  app.controller('mainCtrl', ['firebaseService','eventService','$scope','$location', function(firebaseService, eventService, $scope, $location) {

      $scope.logOut = function(){
          firebaseService.logOut();
      };

      $scope.getCurrentUser = function(){
        return firebaseService.getCurrentUser();
      };
      if (firebaseService.isAuth()){
          firebaseService.setCurrentUserModel(firebase.database().ref("users"));
          firebaseService.setEventsRef(firebase.database().ref("events"));
          firebaseService.getEventsByUserKey(firebaseService.currentUserId);
      };
    	// eventService.getEventsFromFile('model/eventplanner_events.json');
	}]);

  app.directive('autoFocus', function($timeout) {
    return {
        restrict: 'AC',
        link: function(_scope, _element) {
            $timeout(function(){
                _element[0].focus();
            }, 0);
        }
    };
  });

})();
