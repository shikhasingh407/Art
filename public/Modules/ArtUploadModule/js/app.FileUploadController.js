(function() {
  angular.module("art").controller('FileUploadController', FileUploadController);

  FileUploadController.$inject = ['FileService','$location','$routeParams','ArtistService'];

  function FileUploadController (fileService, $location, $routeParams, ArtistService) {
    var self = this; // this = uploadCtrl = $scope

    self.artType = ['Contemporary', 'Charcoal-sketch', 'Water-Color', 'Oil Painting', 'Mural',
      'Crafts', 'Knife Painting'];

    self.artistId = $routeParams.id;

    self.uploadArt = uploadArt;
    self.cancel = cancel;

    var artObj = fileService.getArt2();
    if(artObj === null){
      self.form = {};
      init();
    }
    else{
        self.form = artObj || {};
    }



    function init() {
      ArtistService
          .findArtistById(self.artistId)
          .then(function(response){
            self.artistName = response.data.name;
            self.form.artistName = response.data.name;
          });
    }

    function uploadArt() {
      self.form.artistName = self.artistName;
      var formData = new FormData( document.getElementById("fileUploadForm"));
      formData.append("artData", JSON.stringify(self.form));
      fileService.uploadArt(formData).then(function(response) {
        if (!response.status) {
          swal("Success", "The art was successfully saved in your database.", "success");
          $location.url("/artist/" + self.artistId + "/art/list");
        } else {
          swal("Error", "The art was failed to save, please try again later", "error");
        }
      });
    }

    function deleteArt() {
      self.form.artistName = self.artistName;
      var formData = new FormData( document.getElementById("fileUploadForm"));
      formData.append("artData", JSON.stringify(self.form));
      fileService.uploadArt(formData).then(function(response) {
        if (!response.status) {
          swal("Success", "The art was successfully saved in your database.", "success");
          $location.url("/artist/" + self.artistId + "/art/list");
        } else {
          swal("Error", "The art was failed to save, please try again later", "error");
        }
      });
    }

    function cancel() {
      self.form = {};
    }

  }

})();