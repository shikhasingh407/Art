(function(){
    angular
        .module("art")
        .controller("BlogNewController", BlogNewController);

    function BlogNewController($location, $routeParams, BlogService) {
        var vm = this;
        vm.artistId = $routeParams.artistId;

        vm.createBlog = createBlog;

        function createBlog(name, description) {
            var newBlog = {
                // _id: (new Date().getTime() + ""),
                _artist: vm.artistId,
                name: name,
                description: description
            };
            //console.log(newBlog);
            BlogService
                .createBlog(newBlog)
                .then(function (response) {
                    var blog = response.data;
                    if (blog) {
                        $location.url("/artist/" + vm.artistId + "/blog/");
                    } else {
                        vm.error = "Unable to create the blog";
                    }
                });
        }
    }
})();