'use strict';

/**
 * @ngdoc function
 * @name eventPlannerProjectApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the eventPlannerProjectApp
 */
angular.module('eventPlannerProjectApp')
  .controller('RegisterCtrl',['firebaseService','$location', '$log','$scope', function (firebaseService, $location, $log, $scope) {
    this.dateOptions = {format: 'MM/DD/YYYY', showClear: true};


    this.register = function(user){
       var email = user.email;
       var password = user.password;
       self = this;
       firebaseService.register(email, password).then(function(response){
              var firebaseUser = response;
              var userModel  = {
                          "name": user.name,
                          "email": user.email,
                          "employer": user.employer !== undefined ? user.employer : "",
                          "jobtitle": user.jobtitle !== undefined ? user.jobtitle : "",
                          "birthday": user.birthday !== undefined ? user.birthday.toString() : "false"
              };
               firebaseService.saveUserDetails(userModel, response.uid)
                   .then(function(response){})
                   .catch(function(error){})
              $location.path('/events/currentevents');
       }).catch(function(error) {
                console.log(error);
                $scope.regError = true;
                $scope.regErrorMessage = error;

                //TODO: pass errors to view
                //ex: the username already exists  - error
                // this.regError = true;
                // this.regErrorMessage = error.message;
       });


    }
  }]);
