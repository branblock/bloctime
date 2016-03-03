var bloctime = angular.module('bloctime', ['firebase', 'ui.router']);

bloctime.config(function($stateProvider, $locationProvider) {
  $locationProvider
    .html5Mode({
      enabled: true,
      requireBase: false
    });

  $stateProvider
    .state('home', {
      url: '/',
      controller: 'HomeCtrl',
      templateUrl: '/templates/home.html'
    });
});

bloctime.controller('HomeCtrl', function($scope, $firebaseObject) {
  var ref = new Firebase('https://brilliant-inferno-3345.firebaseio.com/');
  // download the data into a local object
  var syncObject = $firebaseObject(ref);
  // synchronize the object with a three-way data binding
  // click on `index.html` above to see it used in the DOM!
  syncObject.$bindTo($scope, "data");
});
