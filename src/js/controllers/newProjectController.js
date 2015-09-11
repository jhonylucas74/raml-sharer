app.controller('newProjectController', function($scope,Projects, ngDialog, $rootScope, $window){
  $rootScope.headerTemplate = "views/templates/headers/new-project.html";
  $scope.project = {};

  function error(res){
    $scope.message = res.data;

    ngDialog.open({
      template: 'views/templates/dialogs/new-project-error.html',
      scope: $scope
    });
  }

  function sucess(data){
    localStorage.setItem("repo", JSON.stringify(data));
    $window.location = "#/api/show/-1";
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
