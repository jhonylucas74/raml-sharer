app.controller('documentController', function($scope, $rootScope, origin, ngDialog){
  $rootScope.headerTemplate = "views/templates/headers/document.html";

  var repo = JSON.parse(localStorage.getItem("repo"));
  console.log(repo);

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

  function error(res){
    $scope.context = res.context;
    $scope.message = res.message;
    $scope.line = res.problem_mark.line;
    $scope.column = res.problem_mark.column;

    ngDialog.open({
      template: 'views/templates/dialogs/raml-parse-error.html',
      scope: $scope
    });
  }

  origin.get(repo).then(function(raml){

        RAML.Parser.load(raml).then( function(data) {
          console.log('ss');
          console.log(data);
         $scope.$apply(function(){
           $scope.resources = applyRelativeUri(data.resources, '');
           $scope.resources = joinMethods($scope.resources);

           $rootScope.accountname  = "jhonylucas74";//localStorage.getItem('accountname');
           $rootScope.apiTitle     = data.title;
           $rootScope.baseUri      = data.baseUri;
         });
        }, error);

    });
});
