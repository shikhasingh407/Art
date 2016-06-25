/**
 * Created by Shikha Singh on 6/20/2016.
 */
(function(){
    angular
        .module("art")
        .controller("ProfileController", ProfileController);

    function ProfileController($location, $routeParams, ArtistService, $rootScope) {
        var vm = this;
        var id = $rootScope.currentArtist._id;

        //vm.updateUser = updateUser;
        //vm.deleteUser = deleteUser;
        vm.logout = logout;

        function init(){
            ArtistService
                .findArtistById(id)
                .then(function(response){
                    vm.artist = response.data;
                    console.log(vm.artist);
                });
        }
        init();

        function logout() {
            ArtistService
                .logout()
                .then(
                    function (response){
                        $location.url("/login");
                    },
                    function() {
                        $location.url("/login");
                    }
                )
        }

        //function deleteUser() {
        //    UserService
        //        .deleteUser(id)
        //        .then(
        //            function(){
        //                $location.url("/login");
        //            },
        //            function() {
        //                vm.error = "OOPS!!! Unable to remove the user";
        //            }
        //        );
        //}
        //function updateUser(newUser) {
        //    if(UserService.updateUser(id, newUser)){
        //        vm.success = "Your profile is saved!"
        //    }
        //    else{
        //        vm.error = "OOPS!!! Unable to save the changes";
        //    }
        //}
    }

})();