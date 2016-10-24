'use strict';

/**
 * @ngdoc service
 * @name eventPlannerProjectApp.firebaseService
 * @description
 * # firebaseService
 * Service in the eventPlannerProjectApp.
 */
angular.module('eventPlannerProjectApp')
  .service('firebaseService',['$firebaseAuth', '$firebaseArray', '$firebaseObject', 'eventService', '$window',
  function ($firebaseAuth,$firebaseArray, $firebaseObject, eventService, $window ) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    self = this;
    self.currentUserEvents = [];

    this.getAuth = function(){
      return $firebaseAuth();
    };

    this.getCurrentUser = function(){
      if (!this.getAuth()) return;
      if (this.getAuth()._._auth.currentUser !== null) {
            return this.getAuth()._._auth.currentUser.uid;
      }else{
        if($window.localStorage.getItem('firebase:authUser:AIzaSyC_ZLFGMY_uaodRuaRmrti6ACxQIDEEU0M:[DEFAULT]')){
           var userId =  JSON.parse($window.localStorage.getItem('firebase:authUser:AIzaSyC_ZLFGMY_uaodRuaRmrti6ACxQIDEEU0M:[DEFAULT]'));
           return userId.uid;
        }else return false;
       }
    };

    this.isAuth = function(){
      if (this.getCurrentUser() && this.getAuth()){
        self = this;
        self.currentUserId = this.getCurrentUser();
        return true;
      }else{
        return false;
      }
    };



    self.setCurrentUserModel = function(usersRef){
        if (!this.isAuth()) {return};
        $firebaseArray(usersRef).$loaded().then(function(response){
            $.each(response, function(idx, value){
                if (self.currentUserId  === value.$id){
                    self.currentUserModel = value;
                }
            })
        }).catch(function(error){

        });
    };

    self.getEventsByUserKey = function(userKey){
        self.currentUserEvents = [];

        $firebaseArray(firebase.database().ref("events")).$loaded().then(function(response){
             $.each(response, function(idx, value){
                 if (value.event.userId !== undefined && userKey  === value.event.userId){
                      self.currentUserEvents.push(value);
                 };
             });
       }).catch(function(error){
         console.log("get events by user key " +  error);
       });
    };

    this.register = function(email, password){
        self = this;
        return this.getAuth().$createUserWithEmailAndPassword(email, password).then(function(firebaseUser) {
             console.log("Registered in as:", firebaseUser.uid);
             self.currentUserId = firebaseUser.uid;
             self.setCurrentUserModel(firebase.database().ref().child("users"));
             self.getEventsByUserKey(self.currentUserId);
             return firebaseUser;
        }).catch(function(error) {
              console.log("Registration failed:", error);
        });
    };

    this.login = function(email, password){
      self = this;
      return this.getAuth().$signInWithEmailAndPassword(email,password).then(function(firebaseUser) {
          console.log("Signed in as:", firebaseUser.uid);
          self.currentUserId = firebaseUser.uid;
          self.setCurrentUserModel(firebase.database().ref().child("users"));
          self.getEventsByUserKey(self.currentUserId);
          return firebaseUser;
      }).catch(function(error) {
        console.log("Authentication failed:", error);
      });
    };

    this.logOut = function(){
        // eventService.getEventsFromFile('model/eventplanner_events.json');
        try{
          this.getAuth().$signOut();
        }catch(error){
        }
    };

    this.setEventsRef = function(eventsRef){
      this.eventsRef = eventsRef;
    };

    this.getCurrentUserModel = function(){
      var usersModel = self.currentUserModel;
      return usersModel;
    };

    this.createEvent = function(event){
      var events = $firebaseArray(firebase.database().ref("events"));
      return events.$add({ event: event }).then(function(ref) {
          self.getEventsByUserKey(self.currentUserId);
          return ref.getKey();
      }).catch(function(error){
          console.log(error);
      });
    };

    this.saveUserDetails = function(user, key){
      if (this.isAuth()){
            return firebase.database().ref("users").child(key).set({
                  name: user.name,
                  email: user.email,
                  employer: user.employer,
                  jobtitle: user.jobtitle,
                  birthday: user.birthday
            }).then(function(response) {
            }).catch(function(error){
                console.log(error);
            });;
      }
    }

    this.deleteEvent = function(events, event){
      var vm = this;
       vm.event = event;
       events.$loaded().then(function(response){
          var oEvents = _(response).toArray();
          response.$remove(response.$getRecord(vm.event.$id)).then(function(ref) {
                var index = self.currentUserEvents.indexOf(vm.event);
                self.currentUserEvents.splice(index, 1);
                console.log("Event deleted successfully!");
         }).catch(function(error){
           console.log(error);
         });
       }).catch(function(error){
         console.log(error);
       })

    };

    this.getCurrentUserEvents = function(){
        if (this.isAuth()){
            return self.currentUserEvents;
        };
        return self.demoEvents;

    };


    this.getEventsArray = function(){
        var eventsArray =  $firebaseArray(firebase.database().ref("events"));
        return eventsArray;
    };

    this.getEventsObject = function(){
      return $firebaseObject(firebase.database().ref("events"));
    };

  }]);
