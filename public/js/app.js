var app = angular.module('my-app', ['ngRoute', 'ngDialog','ngFx', 'ngAnimate']);

app.config(['$routeProvider',
  function($routeProvider) {
    var rp = $routeProvider;

    rp.when('/', {
      templateUrl: 'views/initial.html',
      controller: 'initialController'
    });

    rp.when('/groups', {
      templateUrl: 'views/groups.html',
      controller: 'groupsController'
    });

    rp.when('/group', {
      templateUrl: 'views/group.html',
      controller: 'groupController'
    });

    rp.when('/welcome', {
      templateUrl: 'views/welcome.html',
      controller: 'welcomeController'
    });

    rp.when('/api/show/:id', {
      templateUrl: 'views/api.html',
      controller: 'documentController'
    });

    rp.when('/api/example', {
      templateUrl: 'views/api_example.html'
    });

    rp.when('/project/new', {
      templateUrl: 'views/new-project.html',
      controller: 'newProjectController'
    });

    rp.when('/configuration', {
      templateUrl: 'views/configuration.html',
      controller: "configurationController"
    });

    rp.otherwise({
      redirectTo: '/'
    });

  }]);

app.run(function($rootScope, $window, $http){

  $rootScope.headerTemplate = null;

  $rootScope.go = function(uri){
    $window.location = uri;
  };

  $rootScope.signOut = function(){
    localStorage.clear();
    alert("sdsd");
    $window.location = "/";
  }
});
