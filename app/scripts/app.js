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
  // work: 1500,
  // shortBreak: 300,
  // longBreak: 1800
  // for testing
  work: 10,
  shortBreak: 5,
  longBreak: 8
})

.controller('HomeCtrl', ['$scope', '$interval', '$firebaseObject',
  function($scope, $interval, $firebaseObject) {
    var ref = new Firebase('https://brilliant-inferno-3345.firebaseio.com/');
    $scope.data = $firebaseObject(ref);
  }
])

.directive('pomodoroTimer', ['SESSION_TIME', '$interval', function(SESSION_TIME, $interval) {
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
      var sessionsCounter = 0;
      var sessionSound = new buzz.sound( "/assets/sounds/ding.mp3", {
        preload: true
      });

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
              sessionsCounter++;
              if (!scope.onBreak) {
                scope.onBreak = true;
                if (sessionsCounter >= 4) {
                  scope.time = SESSION_TIME.longBreak;
                  scope.breakText = "That's 4 sessions! Take a long break!";
                  sessionsCounter = 0;
                } else {
                  scope.time = SESSION_TIME.shortBreak;
                  scope.breakText = 'Take a short break!';
                }
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

      scope.$watch('time', function() {
        if (scope.time === 0) {
          sessionSound.play();
        }
      })

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
