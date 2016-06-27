(function () {
    angular.module("art").factory('PortfolioService', PortfolioService);

    PortfolioService.$inject = ['$http'];

    function PortfolioService($http) {

        return service = {
            updatePortfolio: updatePortfolio,
            deletePortfolio: deletePortfolio,
            createPortfolio: createPortfolio,
            findPortfolioByPortfolioId: findPortfolioByPortfolioId,
            findPortfoliosForArtistId: findPortfoliosForArtistId

            //reorderPortfolio: reorderPortfolio

        };


        function updatePortfolio(id, newPortfolio) {
            var url = "/rest/portfolio/" + id;
            return $http.put(url, newPortfolio);
        }

        function deletePortfolio(id) {
            var url = "/rest/portfolio/" + id;
            return $http.delete(url);
        }

        function createPortfolio(newPortfolio) {
            return $http.post("/rest/artist/" + newPortfolio._artist + "/portfolio", newPortfolio);
        }

        function findPortfolioByPortfolioId(id) {
            var url = "/rest/portfolio/" + id;
            return $http.get(url);
        }

        function findPortfoliosForArtistId(artistId) {
            var url = "/rest/artist/" + artistId + "/portfolio";
            return $http.get(url);
        }

    }
})();