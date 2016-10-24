'use strict';

/**
 * @ngdoc function
 * @name eventPlannerProjectApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the eventPlannerProjectApp
 */
angular.module('eventPlannerProjectApp')
  .controller('EventsCtrl', ['firebaseService', 'eventService', '$scope', function (firebaseService, eventService,$scope) {

      $scope.allEvents = firebaseService.getEventsArray();

      this.isAuth = function(){
          return firebaseService.isAuth();
      };

      this.getEvents = function(){
          if (!this.isAuth()){ return eventService.demoEvents}
            else{ return firebaseService.getCurrentUserEvents()};
      }

      this.deleteEvent = function(event){
          firebaseService.deleteEvent(firebaseService.getEventsArray(), event);
      };

  }]);
