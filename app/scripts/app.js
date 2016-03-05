angular.module('bloctime', ['firebase', 'ui.router'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

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
})

.controller('HomeCtrl', ['$scope', '$interval', '$firebaseObject',
  function($scope, $interval, $firebaseObject) {
    var ref = new Firebase('https://brilliant-inferno-3345.firebaseio.com/');
    $scope.data = $firebaseObject(ref);
}])

.directive('timer', function($interval) {
  return {
    restrict: 'E',
    templateUrl: '/templates/timer.html',
    replace: true,
    scope: { },
    link: function(scope, element, attributes) {
      scope.counter = 1500;
      scope.button = 'Start';
      scope.time = null;
      scope.startTime = function() {
        if (scope.button == "Reset") {
          scope.counter = 1500;
          scope.button = 'Start';
          $interval.cancel(time);
        } else {
          time = $interval(function() {
            scope.counter--;
            scope.button = 'Reset';
          }, 1000);
        }
 		  }
    }
  }
})

.filter('timeDisplay', function() {
  return function(seconds) {
    var displayTime = new Date(0,0,0,0,0,0,0);
    displayTime.setSeconds(seconds);
    return displayTime;
  };
});
