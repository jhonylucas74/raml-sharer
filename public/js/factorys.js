app.factory('Projects', function($q, Bitbucket) {
  var projects = JSON.parse(localStorage.getItem('projects')) || [];

  projects = [{
    origin: "Bitbucket",
    repository: "teste",
    path: "cat.txt"
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
         q.resolve();
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
    testRepository: testRepository
  }
});
