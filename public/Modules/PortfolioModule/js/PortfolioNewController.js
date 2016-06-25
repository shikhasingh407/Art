(function(){
    angular
        .module("art")
        .controller("PortfolioNewController", PortfolioNewController);

    function PortfolioNewController($location, $routeParams, PortfolioService) {
        var vm = this;
        vm.artistId = $routeParams.id;

        vm.createPortfolio = createPortfolio;

        function createPortfolio(name, description, location) {
            var newPortfolio = {
                _artist: vm.artistId,
                // _id: (new Date().getTime() + ""),
                name: name,
                description: description
            };
            PortfolioService
                .createPortfolio(newPortfolio)
                .then(function (response) {
                    var portfolio = response.data;
                    if (portfolio) {
                        if (location === 'portfolioList'){
                            $location.url("/artist/" + vm.artistId + "/portfolio");
                        } else {
                            $location.url("/artist/" + vm.artistId + "/art/list");
                        }
                    } else {
                        vm.error = "Unable to create the blog";
                    }
                });
        }
    }
})();