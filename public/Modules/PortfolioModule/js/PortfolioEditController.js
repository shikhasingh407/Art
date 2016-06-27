/**
 * Created by Shikha Singh on 6/25/2016.
 */


(function () {
    angular.module("art").controller('PortfolioEditController', PortfolioEditController);

    PortfolioEditController.$inject = ['FileService','$location', '$routeParams', 'PortfolioService'];

    function PortfolioEditController(FileService, $location, $routeParams,  PortfolioService) {

        var vm = this;

        vm.portfolioId = $routeParams.portfolioId;
        vm.deletePortfolio = deletePortfolio;
        vm.deleteArtFromPortfolio = deleteArtFromPortfolio;
        //vm.getAllArt = getAllArt;
        vm.artistId = $routeParams.id;
        vm.updatePortfolio = updatePortfolio;
        vm.portfolio = [];

        //vm.deleteArt = deleteArt;

        function deleteArtFromPortfolio(art, portfolio){
            var index = portfolio.arts.indexOf(art);
            if(index > -1){
                portfolio.arts.splice(index,1);
            }
         FileService.deleteArtFromPortfolio(art._id, portfolio).then(function(response){

             if(response === "OK"){

                 init();
             }
            }, function(errr){

         });
        }

        function init() {
            PortfolioService
                .findPortfolioByPortfolioId(vm.portfolioId)
                .then(function (response) {
                    vm.portfolio = response.data;
                });
        }

        init();


        function updatePortfolio() {
            PortfolioService
                .updatePortfolio(vm.portfolioId, vm.portfolio)
                .then(
                    function (response) {
                        if (response.data)
                            $location.url("/artist/" + vm.artistId + "/portfolio" );
                        else
                            vm.error = "Unable to update";
                    },
                    function (error){
                        vm.error = "Server was unable to update";
                    });

        }

        function deletePortfolio() {
            //console.log("ontroller")
            PortfolioService
                .deletePortfolio(vm.portfolioId)
                .then(
                    function (response) {
                        var result = response.data;
                        if (result) {
                            $location.url("/artist/" + vm.artistId + "/portfolio");
                        } else {
                            vm.error = "Unable to delete the portfolio";
                        }
                    }
                );
        }


        //
        //    var result = PortfolioService.deletePortfolio(vm.portfolioId);
        //    if (result) {
        //        $location.url("/artist/" + vm.artistId + "/portfolio");
        //    } else {
        //        vm.error = "Unable to delete the portfolio";
        //    }
        //}
    }
})();
