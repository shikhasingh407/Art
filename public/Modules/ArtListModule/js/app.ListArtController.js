(function () {
    angular.module("art").controller('ListArtController', ListArtController);

    ListArtController.$inject = ['$location', 'FileService', '$routeParams', 'ArtistService', 'PortfolioService'];

    function ListArtController($location, fileService, $routeParams, ArtistService, PortfolioService) {

        var self = this;
        self.arts = [];
        self.editArt = editArt;
        self.deleteArt = deleteArt;
        self.getAllArt = getAllArt;
        self.artistId = $routeParams.id;
        self.addToPortfolio = addToPortfolio;
        self.portfolios = [];

        function getPortfolios(){
            PortfolioService
                .findPortfoliosForArtistId(self.artistId)
                .then(function(response){
                    self.portfolios = response.data;
                });
        }

        function init() {
            ArtistService
                .findArtistById(self.artistId)
                .then(function (response) {
                    artistName = response.data.name;
                    getAllArt(artistName);
                    getPortfolios();
                });
        }

        init();

        function editArt(art) {
            fileService.setArt2(art);
            $location.path("/artist/" + self.artistId + "/art");
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


        function deleteArt(art) {
            fileService
                .deleteArt(art._id)
                .then(function (response) {

                    if (response == "OK") {
                        var index = self.arts.indexOf(art);
                        if (index > -1) {
                            self.arts.splice(index, 1);
                        }
                    }


                    else
                        self.error = "Unable to delete the blog";
                });
        }

        function addToPortfolio(portfolio, art) {
            portfolio.arts = portfolio.arts || [];
            portfolio.arts.push(art);
            PortfolioService
                .updatePortfolio(portfolio._id, portfolio)
                .then(function (response) {

                    if (response == "OK") {

                    }
                    else
                        self.error = "Unable to add to the blog";
                });
        }

    }



})();