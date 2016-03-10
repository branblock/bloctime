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

.constant('SESSION_TIME', {
  work: 1500,
  break: 300
})

.controller('HomeCtrl', ['$scope', '$interval', '$firebaseObject',
  function($scope, $interval, $firebaseObject) {
    var ref = new Firebase('https://brilliant-inferno-3345.firebaseio.com/');
    $scope.data = $firebaseObject(ref);


  $scope.isDisabled = false;

  $scope.disableButton = function() {
    $scope.isDisabled = true;
  }
}])

.directive('timer', ['SESSION_TIME', '$interval', function(SESSION_TIME, $interval) {
  return {
    restrict: 'E',
    templateUrl: '/templates/timer.html',
    replace: true,
    scope: { },
    link: function(scope, element, attributes) {
      scope.time = SESSION_TIME.work;
      scope.workButton = 'Pomodoro!';
      scope.onBreak = false;
      var timer;

      scope.countdown = function() {
        if (scope.workButton === 'Reset Pomodoro') {
          scope.time = SESSION_TIME.work;
          $interval.cancel(timer);
          scope.workButton = 'Pomodoro!';
        } else {
          scope.workButton = 'Reset Pomodoro';
          timer = $interval(function() {
            scope.time--;
            if (scope.time < 0) {
              $interval.cancel(timer);
              if (!scope.onBreak) {
                scope.onBreak = true;
                scope.time = SESSION_TIME.break;
                scope.breakText = 'Break time! Chill.';
                timer = $interval(function() {
                  scope.time--;
                  if (scope.time < 0) {
                    $interval.cancel(timer);
                    scope.onBreak = false;
                    scope.time = SESSION_TIME.work;
                    scope.workButton = 'Pomodoro!';
                  }
                }, 1000);
              }
            }
          }, 1000);
        }
      }
    }
  }
}])

.filter('timeDisplay', function() {
  return function(seconds) {
    var displayTime = new Date(0,0,0,0,0,0,0);
    displayTime.setSeconds(seconds);
    return displayTime;
  };
});
