function removeElements(array, values) {
    function removeElement(value) {
      var index = array.indexOf(value);
      if (index > -1) {
          array.splice(index, 1);
      }
    }

    for (var i = 0; i < values.length; i++) {
      removeElement(values[i]);
    }

    return array;
}


String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
};

String.prototype.setCharAt = function(index,chr) {
	if(index > this.length-1) return str;
	return this.substr(0,index) + chr + this.substr(index+1);
}



app.filter('capitalize', function() {
  return function(input) {
    var string = input.replace('/','');
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
});

app.filter('separate', function() {
  return function(input) {
    return  input.split('/').join(' / ');
  };
});

app.filter('normalizeCamelCase', function() {
  return function(input) {

    for (var i = input.length -1 ; i >= 0 ; i--) {
      if( input.charAt(i) == input.charAt(i).toUpperCase() ){
        input = input.setCharAt(i,input.charAt(i).toLowerCase());
        input = input.insert(i, " ");
      }
    }

    return input.charAt(0).toUpperCase() + input.slice(1);
  };
});

app.directive('ramlCodeApi', function () {
    return {
        restrict: 'A',
        scope: { resources: '=ngModel' },
        templateUrl: 'views/templates/document/api-dynamic.html',
    }
});


// Method to get all keys and data in node
function getKeys(scope, element, attrs) {

  var allObjects = [];
  var array = Object.keys(scope.obj);
  array = removeElements(array, ['protocols']);

  for (var i = 0; i < array.length; i++) {
     if(typeof scope.obj[array[i]] == 'object')
       allObjects.push(array[i]);
  }

  scope.keys = [];

  for (var i = 0; i < allObjects.length; i++) {
    scope.keys.push({ name: allObjects[i], data: scope.obj[allObjects[i]] });
  }

}

app.directive('ramlMethods', function () {
    return {
        restrict: 'A',
        scope: { obj: '=ngModel', relativeUri: '=relativeUri' },
        templateUrl: 'views/templates/document/method.html',
        link: getKeys
    }
});


app.directive('ramlKey', function () {
    return {
        restrict: 'A',
        scope: { obj: '=ngModel', key: '=key' },
        templateUrl: 'views/templates/document/key.html',
        link: getKeys
    }
});

app.directive('ramlBody', function () {
    return {
        restrict: 'A',
        scope: { obj: '=ngModel', header: '=header' },
        templateUrl: 'views/templates/document/body.html',
        link: function(scope, element, attrs) {
           scope.parameters = [];

           if(scope.obj && scope.obj.formParameters){
             var array = Object.keys(scope.obj.formParameters);

             for (var i = 0; i < array.length; i++) {
               scope.parameters.push({
                  name: scope.obj.formParameters[array[i]].displayName,
                  description: scope.obj.formParameters[array[i]].description,
                  type: scope.obj.formParameters[array[i]].type
                });
             }
           }

        }
    }
});

app.directive('ramlQuery', function () {
    return {
        restrict: 'A',
        scope: { obj: '=ngModel' },
        templateUrl: 'views/templates/document/query.html',
        link: function(scope, element, attrs) {
           scope.parameters = [];

           if(scope.obj != null){
             var array = Object.keys(scope.obj);

             for (var i = 0; i < array.length; i++) {
               scope.parameters.push({
                  name: scope.obj[array[i]].displayName,
                  description: scope.obj[array[i]].description,
                  type: scope.obj[array[i]].type
                });
             }
           }

        }
    }
});

app.directive('ramlResources', function ($compile) {
    return {
        restrict: 'A',
        scope: { resources: '=ngModel' },
        templateUrl: 'views/templates/document/resources.html',
        link: function(scope, element, attrs) {
          if(scope.resources == undefined) {
            element.replaceWith($compile('<p>no possible render</p>')(scope));
          } else {
            console.log(scope.resources);
            console.log(scope);
          }
        }
    }
});
