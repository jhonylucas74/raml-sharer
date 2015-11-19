app.factory('Projects', function($q, Bitbucket) {
  var projects = JSON.parse(localStorage.getItem('projects')) || [];

  projects = [{
    origin: "Bitbucket",
    repository: "raml-examples",
    path: "papudinho.raml"
  }]

  // Retorna todos os projetos
  function get() {
    return projects;
  }

  /*
   Parâmetros:
      origin: exemplo: Bitbucket,
      repository: 'Nome do repositório do projeto',
      path: 'Caminho do arquivo'
  */
  function create(obj){
    var q = $q.defer();

    switch (obj.origin) {
     case 'Bitbucket':
       Bitbucket.testRepository(obj).then(function(){
         projects.push(obj);
         q.resolve(obj);
       }, function(err){
         q.reject({ data: err });
       });

       break;
     case 'GitHub':
       q.reject({ data: obj.origin+ " origin not supported yet." });
       break;
     case 'Gitlab':
       q.reject({ data: obj.origin+ " origin not supported yet." });
       break;
     default:
       q.reject({ data: "Origin not found." });
    }

    return q.promise;
  }

  return {
    get: get,
    create: create
  };
});



app.factory('Bitbucket', function($q, $http) {
  var accountname = 'jhonylucas74';

  var key = "9mkSh5NnEcsd6ka2fR";
  var secret = "JnZaSazAuHy5tbufaLVTFhjyXeLvxvkz";


  function getCode(){
    var q = $q.defer();
    // Build the OAuth consent page URL
    var remote = require('remote');
    var BrowserWindow = remote.require('browser-window');

    var authWindow = new BrowserWindow({ width: 800, height: 600, show: false, 'node-integration': false });
    var adress  = 'https://bitbucket.org/site/oauth2/authorize?client_id=9mkSh5NnEcsd6ka2fR&response_type=token';
    authWindow.loadUrl(adress);
    authWindow.show();

    // Handle the response from GitHub
    // Handle the response from GitHub
    authWindow.webContents.on('did-get-redirect-request', function(event, oldUrl, newUrl) {

      var raw_code = /token=([^&]*)/.exec(newUrl) || null,
        code = (raw_code && raw_code.length > 1) ? raw_code[1] : null,
        error = /\?error=(.+)$/.exec(newUrl);

      if (code || error) {
        authWindow.close();
      }

      // If there is a code in the callback, proceed to get token from github
      if (code) {
        q.resolve(code);
      } else if (error) {
        q.reject("Oops! Something went wrong and we couldn't log you in using Bitbucket. Please try again.");
      }

    });

    // Reset the authWindow on close
    authWindow.on('close', function() {
        authWindow = null;
    }, false);

    return q.promise;
  }



  function tryOAuth(){
    function aler(data,status,headers){
      console.log('ssd');
      console.log(status);
      console.log(headers);
      alert( JSON.stringify(data));

    }

    getCode().then(function(data){

     $http({
        method: 'POST',
        url: 'https://bitbucket.org/site/oauth2/access_token',
        headers: {
          'Content-Type':'application/x-www-form-urlencoded',
          'Authorization':'Bearer '+ data
       },
        data: 'grant_type=token&token='+data
      }).then(aler,aler);




    }, aler);
  }

  //* */

  function testRepository(obj) {
    var q = $q.defer();

    $http.get('https://bitbucket.org/api/1.0/repositories/' +
    accountname+'/' + obj.repository+'/src/master/' + obj.path).
    then(function(data, status){
      q.resolve(data);
    }, function(data, status) {
      switch (data.status) {
        case 404:
          q.reject("Repository or file raml not found.");
          break;
        case 401:
            q.reject("You do not have access to this repository");
            break;
        default:
        q.reject("Error status:"+ data.status);
      }
    });

    return q.promise;
  }

  return {
    testRepository: testRepository,
    tryOAuth: tryOAuth
  }
});


app.factory('origin', function(Bitbucket, $q){

  function get(obj){
    var q = $q.defer();

    switch (obj.origin) {
     case 'Bitbucket':
       Bitbucket.testRepository(obj).then(function(res){
         q.resolve(res.data.data);
       }, function(err){
         q.reject(err);
       });

       break;
     case 'GitHub':
       q.reject(obj.origin+ " origin not supported yet.");
       break;
     case 'Gitlab':
       q.reject(obj.origin+ " origin not supported yet.");
       break;
     default:
       q.reject("Origin not found.");
    }

    return q.promise;
  }

  return {
    get: get
  };
});


app.factory('User', function($q, $http){

  function authorize(credentials){
    var q = $q.defer();

    $http.post('http://localhost:3000/authenticate', credentials)
    .then(function(data){
      q.resolve(data);
    }, function(data){
      q.reject(data);
    });

    return q.promise;
  }

  function register(data){
    var q = $q.defer();

    $http.post('http://localhost:3000/register', data)
    .then(function(data){
      q.resolve(data);
    }, function(data){
      q.reject(data);
    });

    return q.promise;
  }

  return {
    authorize: authorize,
    register: register
  };
});


app.factory('Group', function( $q, $http){

  function index(userID){
    var q = $q.defer();

    $http.get("http://localhost:3000/api/groups?id="+userID)
    .then(function(res){
      q.resolve(res.data.results);
    }, function(data){
      q.reject(data);
    });

    return q.promise;
  }

  function members(groupId){
    var q = $q.defer();

    $http.get("http://localhost:3000/api/groups/"+groupId+"/members")
    .then(function(res){
      q.resolve(res.data.results);
    }, function(data){
      q.reject(data);
    });

    return q.promise;
  }

  function history(groupId){
    var q = $q.defer();

    $http.get("http://localhost:3000/api/groups/"+groupId+"/history")
    .then(function(res){
      q.resolve(res.data.results);
    }, function(data){
      q.reject(data);
    });

    return q.promise;
  }

  return {
    index: index,
    members: members,
    history: history
  };

});
