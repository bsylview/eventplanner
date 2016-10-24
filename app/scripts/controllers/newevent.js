
'use strict';
/**
 * @ngdoc function
 * @name eventPlannerProjectApp.controller:NeweventCtrl
 * @description
 * # NeweventCtrl
 * Controller of the eventPlannerProjectApp
 */
angular.module('eventPlannerProjectApp')
  .controller('NeweventCtrl', ['firebaseService', 'eventService', '$location', '$timeout','$q','$log', '$window', function (firebaseService, eventService, $location, $timeout, $q, $log, $window) {

      this.dateOptions = {
           format: 'MM/DD/YYYY HH:mm',
           useCurrent: false
      };

      this.eventTypes = ['Conference','Seminars','Meeting','Team Building Event',
      'Trade Show','Business Dinner','Golf event', 'Press Conference','Networking event', 'Incentive travel',
      'Opening Ceremony', 'Product Launch', 'Theme Party', 'VIP Event', 'Trade Fair', 'Shareholder Meeting',
      'Award Ceremony', 'Incentive Event', 'Board Meeting', 'Executive Retreat', 'Weeding', 'Birthday', 'Family Event'];

      eventService.eventGuests = [];

      this.isAuth = function(){
          return firebaseService.isAuth();
      };

      this.createNewEvent = function(event){
        var ev = {
              userId: self.currentUserId,
              title: event.title,
              host:event.host,
              type: event.type,
              fromDate: event.fromDate !== undefined ? event.fromDate.toString() : "",
              toDate: event.toDate !== undefined ? event.toDate.toString() : "",
              location: angular.element(document.querySelector('#eventlocation'))[0].value,
              guests: eventService.eventGuests.length !== 0 ? eventService.eventGuests:[event.guest.toString()],
              message: event.message !== undefined ? event.message : ""
          };
          firebaseService.createEvent(ev).then(function(eventKey){
              console.log("the event was created successfully with key: " + eventKey);
              $location.path('/events/currentevents');
          }).catch(function(error){
              //display errors
          });
      };

      this.getEventGuests = function(){
        return eventService.eventGuests;
      }
      this.addGuest = function(guest){
          if(guest !== undefined && !~eventService.eventGuests.indexOf(guest)){
              eventService.eventGuests.push(guest);
          }
      };

      this.removeGuest = function(guest){
          if(guest !== undefined){
            var index =   eventService.eventGuests.indexOf(guest);
            eventService.eventGuests.splice(index, 1);
        }
      };

      this.initMap = function() {
        if ($window.navigator.geolocation) {
            $window.navigator.geolocation.getCurrentPosition(function(position) {
              var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
              });
            });
        }
      };


  }]).directive('validateBefore', function(){

          return {
              restrict: 'A',
              require: '?ngModel',
              link: function ($scope, $element, $attrs, ngModel) {
                  ngModel.$validators.validateBefore = function (modelValue) {
                      var compareTo = $scope.$eval($attrs.validateBefore).$viewValue;
                      var now = moment();
                       if (!!modelValue) {
                           return (/*modelValue.isBefore(compareTo) &&*/ modelValue.isAfter(now));
                       } else {
                           return true;
                       }
                  };
              }
          };

  })

  .directive('validateAfter', function(){

          return {
              restrict: 'A',
              require: '?ngModel',
              link: function ($scope, $element, $attrs, ngModel) {
                  ngModel.$validators.validateAfter = function (modelValue) {
                      var compareTo = $scope.$eval($attrs.validateAfter).$viewValue;
                      var now = moment();
                      if (!!modelValue) {
                          return modelValue.isAfter(compareTo);
                      } else {
                          return true;
                      }
                  };
              }
          };

  });
