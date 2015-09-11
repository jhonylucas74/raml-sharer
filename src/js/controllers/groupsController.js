app.controller("groupsController", function($scope, $rootScope, $timeout, Group, $window){
  $rootScope.headerTemplate = "views/templates/headers/groups.html";

  // fetch groups
  Group.index().then(function(result){
    console.log(result);
    $scope.groups = result;
    $scope.groupsList = true;
  });

  // show details about group
  $scope.showDetails = function(){
    $scope.groupsList = null;
    $scope.groups = null;
    $timeout(function(){
      $window.location = '#/group';
    },500);
  };

});
