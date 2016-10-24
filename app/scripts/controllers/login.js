'use strict';

/**
 * @ngdoc function
 * @name eventPlannerProjectApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the eventPlannerProjectApp
 */
angular.module('eventPlannerProjectApp')
  .controller('LoginCtrl',['firebaseService', '$location', '$scope', function (firebaseService, $location, $scope) {

    this.signIn = function(user){
       var email = user.email;
       var password = user.password;

       firebaseService.login(email, password).then(function(user){
              if (user !== undefined){
                  $location.path('/events/currentevents');
              }else{
                  $scope.regError = true;
                  $scope.regErrorMessage = "Wrong email or password!";
              };
       }).catch(function(error) {
             $scope.regError = true;
             $scope.regErrorMessage = error;
       });
    };

    this.logOut = function(){
      firebaseService.logOut();
    }
  }]);
