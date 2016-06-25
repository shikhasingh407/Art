(function () {
    angular.module("art").factory('BlogService', BlogService);

    BlogService.$inject = ['$http'];

    function BlogService($http) {

        var service = {
            updateBlog: updateBlog,
            deleteBlog: deleteBlog,
            createBlog: createBlog,
            findBlogByBlogId: findBlogByBlogId,
            findBlogsForArtistId: findBlogsForArtistId,
            reorderBlog: reorderBlog

        };


        function updateBlog(id, newBlog) {
            var url = "/rest/blog/" + id;
            return $http.put(url, newBlog);
        }

        function deleteBlog(id) {
            var url = "/rest/blog/" + id;
            return $http.delete(url);
        }

        function createBlog(newBlog) {
            return $http.post("/rest/artist/"+ newBlog._artist +"/blog", newBlog);
        }

        function findBlogByBlogId(id) {
            var url = "/rest/blog/" + id;
            return $http.get(url);
        }

        function findBlogsForArtistId(artistId) {
            var url = "/rest/artist/" + artistId + "/blog";
            return $http.get(url);
        }

        function reorderBlog(artistId, start, end) {
            console.log(artistId);
            console.log(start);
            console.log(end);
            return $http.put("/artist/" + artistId + "/blog?start=" + start + "&end=" + end);
        }
        return service;
    }

})();