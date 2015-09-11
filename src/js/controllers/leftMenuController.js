app.controller("leftMenuController", function($scope, Projects, $window){
  $scope.projects = Projects.get();

  $scope.$watch(Projects.get,function(data){
      $scope.projects = data;
  });

  $scope.getApi = function(index){
    localStorage.setItem("repo", JSON.stringify($scope.projects[index]));
    $window.location = "#/api/show/"+index;
  }

});
