// The first controller that is loaded
app.controller("initialController", function($scope, Projects, $window, $timeout, User, ngDialog, $http, $rootScope){
  // Show sign in and sign up forms
  $scope.visible = true;
  // when null hide form sing in
  $scope.signIn = null;
  // when null hide form sing up
  $scope.signUp = null;

  /* Try sign in directly:
    Remember user credentials and try sing in.
  -----------------------*/
  function signInDirectly() {
    var credentials = localStorage.getItem('credentials');
    if(credentials){
      credentials = JSON.parse(credentials);
    }else {
      return;
    }

    checkCredentials(credentials);
  }

  signInDirectly();

  // Params for sign in
  $scope.login = {
    email: '',
    password: ''
  };

  // Params for sign up
  $scope.register = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  // Wait for animate form
  $timeout(function(){
    $scope.signIn = true;
  },500);

  // Show form and hide the other
  $scope.signInForm = function(){
    $scope.signUp = null;
    $timeout(function(){
      $scope.signIn = true;
    },500);
  };

  // Show form and hide the other
  $scope.signUpForm = function(){
    $scope.signIn = null;
    $timeout(function(){
      $scope.signUp = true;
    },500);
  };

  // Authorizing and getting the token
  function checkCredentials(credentials){
    User.authorize(credentials).then(function(res){
      // sucess
      $http.defaults.headers.common.Authorization = 'Bearer ' + res.data.token;
      // set global username
      $rootScope.username = res.data.results[0].name;
      // save user in local storage for future use
      localStorage.setItem('user',JSON.stringify(res.data.results[0]));
      localStorage.setItem('user_id',res.data.results[0].id);
      // Save credentials for next time
      localStorage.setItem('credentials',JSON.stringify(credentials));

      $scope.visible = null;
    }, function(res){
      // error
      $scope.message = res.data.msg;
      ngDialog.open({
        template: 'views/templates/dialogs/wow.html',
        scope: $scope
      });

    });
  }

  // Show error message
  function showError(msg){
    $scope.message = msg;

    ngDialog.open({
      template: 'views/templates/dialogs/wow.html',
      scope: $scope
    });
  }

  // For sing in: Validating and authorizing
  $scope.auth = function(){
    // check email
    if($scope.login.email == '' ){
      showError("E-mail can't be blank!");
      return;
    }

    // check password
    if($scope.login.password == '' ){
      showError("Password can't be blank!");
      return;
    }

    var credentials = {
      email: $scope.login.email,
      password: $scope.login.password
    }

    checkCredentials(credentials);
  };

  // For sing up: Registering a user
  $scope.registerUser = function(){
    // check name
    if($scope.register.name == '' ){
      showError("Name can't be blank!");
      return;
    }

    // check email
    if($scope.register.email == '' ){
      showError("E-mail can't be blank!");
      return;
    }

    // check password
    if($scope.register.password == '' ){
      showError("Password can't be blank!");
      return;
    }

    // check password
    if($scope.register.password != $scope.register.confirmPassword ){
      showError("The password is not equal to confirm password!");
      return;
    }

    var user = {
       name: $scope.register.name,
       email: $scope.register.email,
       password: $scope.register.password,
       avatar: 'none'
     };

    User.register(user).then(function(){
     checkCredentials({
       email: $scope.register.email,
       password: $scope.register.password
     });
    }, function(){
      showError("Something wrong.. try again! Check the fields.");
    });
  };


});

app.controller('configurationController', function($scope, Bitbucket){
    Bitbucket.tryOAuth();
});

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

app.controller("groupsController", function($scope, $rootScope, $timeout, Group, $window){
  $rootScope.headerTemplate = "views/templates/headers/groups.html";

  // fetch groups
  var userId = localStorage.getItem('user_id');
  Group.index(userId).then(function(result){
    console.log(result);
    $scope.groups = result;
    $scope.groupsList = true;
  });


  // show details about group
  $scope.showDetails = function(groupId){
    $scope.groupsList = null;
    $scope.groups = null;
    $timeout(function(){
      $window.location = '#/group?id='+groupId;
    },500);
  };

});

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

app.controller("welcomeController", function($rootScope){
  $rootScope.headerTemplate = null;
});
