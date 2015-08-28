var app = angular.module('my-app', ['ngRoute', 'ngDialog']);

app.config(['$routeProvider',
  function($routeProvider) {
    var rp = $routeProvider;

    rp.when('/api/show', {
      templateUrl: 'views/api.html',
      controller: 'Document'
    });

    rp.when('/api/example', {
      templateUrl: 'views/api_example.html'
    });

    rp.when('/project/new', {
      templateUrl: 'views/new-project.html',
      controller: 'newProject'
    });

    rp.otherwise({
      redirectTo: '/api/show'
    });

  }]);

app.run(function($rootScope, $window){
  $rootScope.headerTemplate = "views/templates/headers/document.html";

  $rootScope.go = function(uri){
    $window.location = uri;
  };
});

app.controller("leftMenu", function($scope, Projects){
  $scope.projects = Projects.get();

  $scope.$watch(Projects.get,function(data){
      $scope.projects = data;
  });

});

app.controller('newProject', function($scope,Projects, ngDialog, $rootScope){
  $rootScope.headerTemplate = "views/templates/headers/new-project.html";
  $scope.project = {};

  function error(res){
    $scope.message = res.data;

    ngDialog.open({
      template: 'views/templates/dialogs/new-project-error.html',
      scope: $scope
    });
  }

  function sucess(){
    alert("tudo ok");
  }

  $scope.create = function(){

    if( ($scope.project.origin == null     || $scope.project.origin.length == 0)
    || ($scope.project.repository == null || $scope.project.repository.length == 0)
    || ($scope.project.path == null       || $scope.project.path.length == 0)){
      error({ data: 'All fields are required'});
      return
    }


    Projects.create($scope.project).then(sucess,error);
  }

});

app.controller('Document', function($scope, $rootScope){
  $rootScope.headerTemplate = "views/templates/headers/document.html";

  $scope.resources = [];

  function applyRelativeUri(tree, uri){

    var baseUri = uri;
    // Para todos os recursos
    for (var i = 0; i < tree.length; i++) {

      // faça na profundidade atual
      var relativeUri = tree[i].relativeUri;
      if(tree[i].methods){
        for (var j = 0; j < tree[i].methods.length; j++) {
          tree[i].methods[j].relativeUri = uri + relativeUri;
        }
      }

      // indo mais para baixo
      if(tree[i].resources){
        tree[i].resources = applyRelativeUri(tree[i].resources, relativeUri);
      }
    }

    return tree;
  }

  function moveMethods(tree){

    var layerMethods = [];

    function addMethods(array){
      for (var i = 0; i < array.length; i++) {
        layerMethods.push(array[i]);
      }
    }

    function addshiftMethods(array){
      for (var i = 0; i < array.length; i++) {
        layerMethods.unshift(array[i]);
      }
    }

    // tem recursos? desça!
    if(tree.resources){
       for (var i = 0; i < tree.resources.length; i++) {
         addMethods( moveMethods(tree.resources[i]) );
       }
    }

    tree.methods = tree.methods || []

    addshiftMethods(tree.methods);

    return layerMethods;
  }

  function joinMethods (tree){
    // para cada resource
    for (var i = 0; i < tree.length; i++) {
      var methods = moveMethods(tree[i]);

      tree[i].methods = [];
    //  methods = methods.reverse();
      for (var j = 0; j < methods.length; j++) {
        tree[i].methods.push(methods[j]);
      }
    }
    return tree;
  }

  RAML.Parser.loadFile('http://localhost:3000/papudinho.raml').then( function(data) {
   console.log(data);
   $scope.$apply(function(){
     $scope.resources = applyRelativeUri(data.resources, '');
     $scope.resources = joinMethods($scope.resources);

   });
  }, function(error) {
   console.log('Error parsing: ' + error);
  });

});
