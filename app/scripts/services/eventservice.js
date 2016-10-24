'use strict';

/**
 * @ngdoc service
 * @name eventPlannerProjectApp.eventService
 * @description
 * # eventService
 * Service in the eventPlannerProjectApp.
 */
angular.module('eventPlannerProjectApp')
  .service('eventService', function () {
    self = this;
    self.eventGuests = [];
    self.predefEvents = {
         "events": {
            "-KSeX0iN-RAr5H1h_Wgv": {
               "event": {
                  "fromDate": "Wed Sep 28 2016 12:00:00 GMT+0300 (EEST)",
                  "host": "Mimi",
                  "location": "Myanmar (Burma)",
                  "message": "Surprises!",
                  "guests": [
                     "the company"
                  ],
                  "title": "Extreme Adventure",
                  "toDate": "Thu Sep 29 2016 22:00:00 GMT+0300 (EEST)",
                  "type": "Team Building Event"
               }
            },
            "-KSetmyz3JKSKIgD123R": {
               "event": {
                  "fromDate": "Wed Sep 22 2016 12:00:00 GMT+0300 (EEST)",
                  "guests": [
                     "All of you"
                  ],
                  "host": "Yoyu",
                  "location": "Barcelona, Spain",
                  "message": "Be there!",
                  "title": "Party like a Rockstar",
                  "toDate": "Thu Sep 23 2016 22:00:00 GMT+0300 (EEST)",
                  "type": "Party"
               }
            }
         }
      };

     self.demoEvents =  _(self.predefEvents).toArray()[0];

    // this.getEventsFromFile = function(file){
        // self = this;
         // $.getJSON(file).then(function(response) {
         //     self.demoEvents = _(response).toArray()[0];
         // });
    // }
  });
