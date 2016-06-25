(function () {
  angular.module("art").factory('FileService', FileService);

  FileService.$inject = ['$http'];

  function FileService($http) {

    var baseUrl = "/rest";
    var artObj = null;

    return {
      uploadArt: uploadArt,
      getAllArt: getAllArt,
      deleteArt: deleteArt,
      setArt2 : setArt2,
      getArt2 : getArt2
      //editArt: editArt
    };

    function uploadArt(formData) {
      return $http.post(baseUrl + "/upload", formData, {
        headers: {
          'Content-Type': undefined
        },
        transformRequest: angular.identity
      }).then(successfulProcess).catch(failedProcess);
    }

    function getAllArt(artistName) {
      return $http.get(baseUrl + "/allArts/" + artistName).then(successfulProcess).catch(failedProcess);
    }

    function getArt(artName) {
      return $http.get(baseUrl + "/art/", artName).then(successfulProcess).catch(failedProcess);
    }

    function successfulProcess(response) {
      return response.data;
    }

    function failedProcess(error) {
      return error;
    }

    function deleteArt(artId){
    return $http.delete(baseUrl +"/art/"+artId).then(successfulProcess).catch(failedProcess);
    }

    function getArt2(){
      return artObj;
    }

    function setArt2(art){
      artObj = art || null;
    }

  }
})();