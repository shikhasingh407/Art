(function () {
  angular
      .module("art", ['ngRoute','ui.bootstrap', 'textAngular' ])
      .config(['$routeProvider',
        function ($routeProvider) {
          $routeProvider
              .when("/", {
                  templateUrl: "Modules/ArtistModule/Login.html",
                  controller: "LoginController",
                  controllerAs: "model"
              })
              .when("/login", {
                templateUrl: "Modules/ArtistModule/Login.html",
                controller: "LoginController",
                controllerAs: "model"
              })
              .when("/NewArtist", {
                templateUrl: "Modules/ArtistModule/NewArtist.html",
                controller: "ArtistController",
                controllerAs: "artistCtrl"
              })
              .when("/artist/:artistId/contact", {
                  templateUrl: "Modules/ArtistModule/contact.html",
                  controller: "ContactController",
                  controllerAs: "model"
              })
              .when("/profile", {
                  templateUrl: "Modules/home.html",
                  controller: "ProfileController",
                  controllerAs: "model",
                  resolve: {
                      loggedIn: checkLoggedIn
                  }
              })
              .when("/artist/:artistId", {
                templateUrl: "Modules/home.html",
                controller: "ProfileController",
                  controllerAs: "model",
                  resolve: {
                      loggedIn: checkLoggedIn
                  }
              })

              .when("/artist/:id/portfolio", {
                  templateUrl: "Modules/PortfolioModule/Portfolio.html",
                  controller: "PortfolioController",
                  controllerAs: "model"
              })

              .when("/artist/:id/portfolio/new", {
                  templateUrl: "Modules/PortfolioModule/PortfolioNew.html",
                  controller: "PortfolioNewController",
                  controllerAs: "model"
              })

              .when("/artist/:id/portfolio/:portfolioId", {
                  templateUrl: "Modules/PortfolioModule/PortfolioEdit.html",
                  controller: "PortfolioEditController",
                  controllerAs: "model"
              })

              .
          when('/artist/:id/art', {
            templateUrl: 'Modules/ArtUploadModule/UploadForm.html',
            controller: 'FileUploadController',
            controllerAs: 'uploadCtrl'
          }).
          when('/artist/:id/art/list', {
            templateUrl: 'Modules/ArtListModule/listArt.html',
            controller: 'ListArtController',
            controllerAs: 'listCtrl'
          }).when('/artist', {
            templateUrl: 'Modules/ArtistModule/NewArtist.html',
            controller: 'ArtistController',
            controllerAs: 'artistCtrl'
          })
              .when("/artist/:artistId/blog", {
                  templateUrl: "Modules/BlogModule/blog-list.view.client.html",
                  controller: "BlogListController",
                  controllerAs: "model"
              })
              .when("/artist/:artistId/blog/new", {
                  templateUrl: "Modules/BlogModule/blog-new.view.client.html",
                  controller: "BlogNewController",
                  controllerAs: "model"
              })
              .when("/artist/:artistId/blog/:blogId", {
                  templateUrl: "Modules/BlogModule/blog-edit.view.client.html",
                  controller: "BlogEditController",
                  controllerAs: "model"
              })
              .otherwise({
            redirectTo: 'public/index.html'
          });

            function checkLoggedIn(ArtistService,$location,$q,$rootScope){
                var deferred = $q.defer();
                ArtistService
                    .loggedIn()
                    .then(
                        function(response){
                            var artist=response.data;
                            console.log(artist);
                            if(artist == '0'){
                                $rootScope.currentArtist=null;
                                deferred.reject();
                                $location.url("/login");
                            }
                            else {
                                $rootScope.currentArtist=artist;
                                deferred.resolve();
                            }
                        },
                        function(res){
                            $location.url("/login");
                        }
                    );

                return deferred.promise;
            }
        }]);





})();