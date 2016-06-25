(function () {
  angular.module("art").factory('ArtistService', ArtistService);

  ArtistService.$inject = ['$http'];

  function ArtistService($http) {

    var service = {
      postArtistInformation: postArtistInformation,
      updateArtistInformation: updateArtistInformation,
      getArtist: getArtist,
      createArtist: createArtist,
      logout: logout,
      loggedIn:loggedIn,
      findArtistByUsernameAndPassword: findArtistByUsernameAndPassword,
      login: login,
      findArtistById: findArtistById
      //deleteArtist: deleteArtist
    };


     function createArtist(newArtist){
      return $http.post("/rest/artist", newArtist);
    }

    function findArtistById(id){
      var url = "/rest/artist/" + id;
      return $http.get(url);
    }

    function loggedIn(){
      return $http.get("/rest/loggedin");
    }

    function logout(){
      return $http.post("/rest/logout");
    }


    function login(username, password){
      var url = "/rest/login";
      var artist = {
        username: username,
        password: password
      };

      return $http.post(url, artist)
          .then(successfulProcess)
          .catch(failedProcess);
    }
    function findArtistByUsernameAndPassword(username, password){
      var url = "/rest/artist?username="+username+"&password="+password;
      return $http.get(url);
    }

    function postArtistInformation(formData) {
      return $http.post("/rest/artists", formData, {
        headers: {
          'Content-Type': undefined
        },
        transformRequest: angular.identity
      }).then(successfulProcess).catch(failedProcess);
    }

    function updateArtistInformation(formData) {
      return $http.put("/rest/artists", formData, {
        headers: {
          'Content-Type': undefined
        },
        transformRequest: angular.identity
      }).then(successfulProcess).catch(failedProcess);
    }

    function getArtist(name) {
      return $http.get("/rest/artists/" + name).then(successfulProcess).catch(failedProcess);
    }

    function successfulProcess(response) {
      if (!response.data.hasOwnProperty("length"))
        return response.data;
      else if (response.data.length > 0)
        return response.data[0];
      else
        return response;
    }

    function failedProcess(error) {
      return new Error(error);
    }


    return service;
  }

})();