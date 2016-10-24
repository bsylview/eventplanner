'use strict';

/**
 * @ngdoc function
 * @name eventPlannerProjectApp.controller:AccountdetailsCtrl
 * @description
 * # AccountdetailsCtrl
 * Controller of the eventPlannerProjectApp
 */
angular.module('eventPlannerProjectApp')
  .controller('AccountdetailsCtrl',['firebaseService', '$location',function (firebaseService, $location) {

      this.currentUser = firebaseService.getCurrentUserModel();
      if (this.currentUser !== undefined){
          this.birthday = (this.currentUser.birthday !== undefined && this.currentUser.birthday !== "false") ? this.currentUser.birthday : moment();
          this.user = {name: this.currentUser.name, employer: this.currentUser.employer, jobtitle: this.currentUser.jobtitle, birthday: this.birthday};
          this.dateOptions = {format: 'MM/DD/YYYY', showClear: true, useCurrent:false, defaultDate: new Date(this.birthday)};
      }else{
          this.dateOptions = {format: 'MM/DD/YYYY', showClear: true};
      };

      this.saveUserDetails = function(user){
          var userModel = {
                              "email"   : this.currentUser.email,
                              "name"    : user.name,
                              "employer": user.employer,
                              "jobtitle": user.jobtitle,
                              "birthday": user.birthday !== undefined ? user.birthday.toString() : "false"
                          }
          var key = firebaseService.getCurrentUser();
          firebaseService.saveUserDetails(userModel,key)
            .then(function(response){
                console.log("Details successfully updated!")
            })
            .catch(function(error){
                console.log(error);
            });
            $location.path('/events/currentevents');
      };

      this.isAuth = function(){
          return firebaseService.isAuth();
      }

}]);
