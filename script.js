
    // create the module and name it lunchboxapp
        // also include ngRoute for all our routing needs
var lunchboxapp = angular.module('lunchboxapp', ['ngRoute', 'firebase']);

lunchboxapp.factory("Auth", ["$firebaseAuth", function ($firebaseAuth) {
    var ref = new Firebase("https://connectivityme.firebaseio.com");
    return $firebaseAuth(ref);
  }
]);


// a factory to create a re-usable Profile object
// we pass in a username and get back their synchronized data as an object
lunchboxapp.factory("Profile", ["$firebaseObject",
  function($firebaseObject) {
    return function(username) {
      // create a reference to the database where we will store our data
      var ref = new Firebase("https://connectivityme.firebaseio.com/users/"+username);
      return $firebaseObject(ref);
    }
  }
]);



lunchboxapp.run(["$rootScope", "$location", function($rootScope, $location) {
$rootScope.$on("$routeChangeError", function(event, next, previous, error) {
  // We can catch the error thrown when the $requireAuth promise is rejected
  // and redirect the user back to the home page
  if (error === "AUTH_REQUIRED") {
    $location.path("/login");
  }
});
}]);


    // configure our routes
    lunchboxapp.config(function($routeProvider) {
        $routeProvider
            // route for the home page
            .when('/', {
                templateUrl : 'pages/home.html',
                controller  : 'mainController'
            }).when('/addbrain', {
                templateUrl : 'pages/addbrain.html',
                controller  : 'addBrainController',
                resolve: {
                    "currentAuth": ["Auth", function(Auth) {
                      return Auth.$requireAuth();
                    }]
              }
            })
         .when('/login', {
                templateUrl : 'pages/login.html',
                controller  : 'loginController'
            })
            .when('/profile', {
                templateUrl : 'pages/profile.html',
                controller  : 'profileeditController',
              resolve: {
                    // controller will not be loaded until $waitForAuth resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    "currentAuth": ["Auth", function(Auth) {
                      // $waitForAuth returns a promise so the resolve waits for it to complete
                      return Auth.$requireAuth();
                    }]
              }
            })
            .when('/about', {
                templateUrl : 'pages/about.html',
                controller  : 'aboutController'
              
              
            })
        ;
    });
    lunchboxapp.controller('profileeditController', ["$scope","$firebaseArray","Auth","Profile",function($scope,$firebaseArray,Auth,Profile) {
        $scope.auth=Auth;
        // any time auth status updates, add the user data to scope
        $scope.auth.$onAuth(function(authData) {
          $scope.authData = authData;
            console.log(authData);
            console.log("^^ayut data profile edit controller");
            Profile(authData.uid).$bindTo($scope, "profile");
        });
    }]);
    
    lunchboxapp.controller('mainController',function($scope) {
        
    });


    // create the controller and inject Angular's $scope
    lunchboxapp.controller('loginController', ["$scope","$firebaseArray","Auth",function($scope,$firebaseArray,Auth) {
        $scope.auth = Auth;
        var ref = new Firebase("https://connectivityme.firebaseio.com/accounts");
        $scope.accounts = $firebaseArray(ref);
        $scope.auth.$onAuth(function(authData) {
            $scope.authData = authData;
        });
    }]);

    lunchboxapp.controller('aboutController',function($scope) {
        console.log("Visiting the about page");
    });

 

  lunchboxapp.controller('addBrainController', ["$scope","$firebaseArray","Auth","Profile",function($scope,$firebaseArray,Auth,Profile) {
    $scope.auth=Auth;        
    $scope.auth.$onAuth(function(authData) {
        $scope.authData = authData;
        var brainsref = new Firebase("https://connectivityme.firebaseio.com/users/"+authData.uid+"/brains");
        $scope.brains = $firebaseArray(brainsref);
        console.log($scope.brains)
        $scope.addBrain = function() {
            // $add on a synchronized array is like Array.push() except it saves to the database!
            $scope.brains.$add({
                from: $scope.authData.uid,
                name: $scope.newbrainname,
                description:$scope.newbraindescription,
                dataurl:'edgesCoordinates.csv',
                timestamp: Firebase.ServerValue.TIMESTAMP
            }).then(function(reffer){
                console.log("Just added a brain");
                }, function(error) {
                  console.log("Error: " + error);
            });
            console.log($scope.brains)
        };
    });
    }]);

    






