(function () {
  angular.module("art").controller('ArtistController', ArtistController);

  ArtistController.$inject = ['ArtistService', '$scope'];

  function ArtistController(artistService, $scope) {
    var self = this;

    self.artist = {};

    self.postOrUpdateArtist = postOrUpdateArtist;
    self.getArtist = getArtist;
    self.disableArtist = disableArtist;
    $scope.showDisplayPic = showDisplayPic;

    function postOrUpdateArtist() {
      var fd = new FormData(document.getElementById("artistForm"));
      if (self.artist.hasOwnProperty('length') && self.artist.length > 0) {
        fd.append('artistData', JSON.stringify(self.artist[0]));
      } else {
        fd.append('artistData', JSON.stringify(self.artist));
      }
      if (!self.artist['_id']) {
        artistService.postArtistInformation(fd).then(responseHandler);
      } else {
        artistService.updateArtistInformation(fd).then(responseHandler);
      }

      function responseHandler(response) {
        if (!response.status) {
          self.artist = response;
          if (self.artist['dob']) {
            self.artist['dob'] = new Date(self.artist['dob']);
          }
          swal("Success", "Your data was saved successfully", "success");
        } else {
          swal("Error", "Couldn't save the data : " + response.data, "error");
        }
      }
    }

    function getArtist(email) {
      self.artist = {};
      return artistService.getArtist(email).then(function (response) {
        if (!response.status) {
          self.artist = response;
          if (self.artist['dob']) {
            self.artist['dob'] = new Date(self.artist['dob']);
          }
          return self.artist;
        } else {
          swal("Error", "Artist not found", "error");
        }
      });
    }

    function disableArtist() {
      getArtist(self.artist.email).then(function (response) {
        if (!response.status) {
          response.isActive = false;
          postOrUpdateArtist();
        }
      });
    }

    function showDisplayPic() {
      var element = document.getElementById('triggerDisplayPic');
      self.currentFile = element.files[0];
      var reader = new FileReader();

      reader.onload = function (event) {
        self.displayPic = event.target.result;
        $scope.$apply();
      };

      // when the file is read it triggers the onload event above.
      reader.readAsDataURL(element.files[0]);

    }


  }

})();