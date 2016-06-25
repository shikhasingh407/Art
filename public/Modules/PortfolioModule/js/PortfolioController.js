(function(){
    angular
        .module("art")
        .controller("PortfolioController", PortfolioController);

    function PortfolioController($routeParams, PortfolioService){
        var vm = this;
        vm.artistId = $routeParams.id;
        //vm.userId = $routeParams.userId;
        //vm.websiteId = $routeParams.websiteId;
        //vm.pageId = $routeParams.pageId;

        function init(){
            PortfolioService
                .findPortfoliosForArtistId(vm.artistId)
                .then(function(response){
                    vm.portfolios = response.data;
                    console.log(vm.portfolios);
                });
        }
        init();
    }
})();