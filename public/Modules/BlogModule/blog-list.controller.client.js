(function(){
    angular
        .module("art")
        .controller("BlogListController", BlogListController);

    function BlogListController($sce, $location, $routeParams, BlogService){
        var vm = this;
        vm.artistId = $routeParams.artistId;
        console.log(vm.artistId);

        vm.getSafeHtml = getSafeHtml;

        vm.reorderBlog = reorderBlog;

        function init() {
            BlogService
                .findBlogsForArtistId  (vm.artistId)
                .then(function(response){
                    vm.blogs = response.data;
                    //$(".container")
                    //    .sortable({
                    //        axis: 'y'
                    //    });
                });
        }
        init();

        function reorderBlog(start, end){
            console.log(start+" "+end);
            BlogService
                .reorderBlog(vm.artistId, start, end)
                .then(
                    function(response){
                        init();
                    },
                    function(response){
                        vm.error = "Unable to reorder blogs";
                    });
        }

        function getSafeHtml(blog){
            return $sce.trustAsHtml(blog.text);
        }


    }
})();