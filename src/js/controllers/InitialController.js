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
      localStorage.setItem('user',JSON.stringify(res.data.user));
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
