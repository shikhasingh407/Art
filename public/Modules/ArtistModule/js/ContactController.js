(function () {
    angular.module("art").controller('ContactController', ContactController);

    ContactController.$inject = ['ArtistService', '$scope', '$routeParams'];

    function ContactController(artistService, $scope, $routeParams) {
        var self = this;
        var id = $routeParams.artistId;

        self.artist = {};

        function findArtistById() {
            self.artist = {};
            return artistService.findArtistById(id).then(function (response) {
                if (response) {
                    self.artist = response.data;

                } else {
                    swal("Error", "Artist not found", "error");
                }
            });
        }
        findArtistById();

    }

})();