(function () {
  angular.module("art").controller('ListArtController', ListArtController);

  ListArtController.$inject = ['$location','FileService','$routeParams','ArtistService'];

  function ListArtController($location, fileService, $routeParams, ArtistService) {

    var self = this;


    self.arts = [];
      self.editArt = editArt;
self.deleteArt= deleteArt;
    self.getAllArt = getAllArt;
      self.artistId = $routeParams.id;

      function init(){
          var artistName = 'ShikhaSingh';
        ArtistService
            .findArtistById(self.artistId)
            .then(function(response){
                artistName = response.data.username;
                getAllArt(artistName);
            });
      }

      init();

      function editArt(art) {
          console.log('edit art called');
          fileService.setArt2(art);
          $location.path("/artist/" +self.artistId+ "/art");
      }


    function getAllArt(artistName) {
      fileService.getAllArt(artistName).then(
          function (response) {
            if (response instanceof Array) {
              self.arts = response;
            } else {
              self.arts.push(response);
            }
          },
          function (error) {
            swal("Error", "Fetching your art info failed, Please try again later : " + error, "error");
          });
    }

      //
      function deleteArt(art) {
          fileService
                  .deleteArt(art._id)
                  .then(function (response) {

                      if (response == "OK"){
                         var index = self.arts.indexOf(art);
                          if(index > -1){
                              self.arts.splice(index,1);
                          }
                      }


                      else
                          self.error = "Unable to delete the blog";
                  });
          }

  }

})();