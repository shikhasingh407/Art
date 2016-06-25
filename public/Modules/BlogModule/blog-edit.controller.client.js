(function(){
    angular
        .module("art")
        .controller("BlogEditController", BlogEditController);

    function BlogEditController($sce, $location, $routeParams, BlogService) {
        var vm = this;
        vm.artistId = $routeParams.artistId;
        vm.blogId = $routeParams.blogId;
        vm.blog = BlogService.findBlogByBlogId(vm.blogId);

        vm.updateBlog = updateBlog;
        vm.deleteBlog = deleteBlog;

        function init() {
            BlogService
                .findBlogByBlogId(vm.blogId)
                .then(function(response){
                    vm.blog = response.data;
                });
        }
        init();

        function updateBlog() {
            BlogService
                    .updateBlog(vm.blogId, vm.blog)
                    .then(
                        function (response) {
                        if (response.data)
                            $location.url("/artist/" + vm.artistId + "/blog" );
                        else
                            vm.error = "Unable to update";
                        },
                        function (error){
                            vm.error = "Server was unable to update";
                        });

        }

        function deleteBlog() {
            BlogService
                .deleteBlog(vm.blogId)
                .then(function (response) {
                    if (response.data)
                        $location.url("/artist/" + vm.artistId + "/blog");
                    else
                        vm.error = "Unable to delete the blog";
                });
        }
    }
    })();