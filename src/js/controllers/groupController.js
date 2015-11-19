app.controller("groupController", function($scope, $rootScope, $timeout, Group, $routeParams){
  $rootScope.headerTemplate = "views/templates/headers/group.html";
  $scope.showAddMember = true;
  $scope.showCloseForm = false;

  $scope.addMember = function(){
    $scope.showAddMember = false;
    $scope.showCloseForm = true;
    var addBtn = document.getElementById('add-member');
    addBtn.style.display = 'none';

    var addBtn = document.getElementById('close-member-form');
    addBtn.style.display = 'inline-block';
  };

  $scope.closeAddMember = function(){
    $scope.showCloseForm = false;
    var addBtn = document.getElementById('add-member');
    addBtn.style.display = 'inline-block';

    var addBtn = document.getElementById('close-member-form');
    addBtn.style.display = 'none';

    $timeout(function(){
      $scope.showAddMember = true;
    },300);
  };

  Group.members($routeParams.id).then(function(result){
    console.log(result);
    $scope.members = result;
  });

  Group.history($routeParams.id).then(function(result){
    console.log(result);
    $scope.histories = result;
  });

});
