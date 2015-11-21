

function tmLoginCtrl (tmAuth, tmIdentity, tmNotifier, $state, $timeout) {
    var vm = this;
    vm.name = 'banquetninja';
    vm.loggedIn = false;
    vm.identity = tmIdentity;
    
    if(tmAuth.getUserInfo()){
        vm.loggedIn = true;
    }
    vm.signin = function (username, password){
        console.log('in login');
        tmAuth.login(username, password).then(
            function(){
                vm.loggedIn = true;
                
                tmNotifier.notify("You have successfully signed in!");
                }
        );
        $timeout(function(){
            console.log(tmAuth.getTokenClaims());
        }, 2000)
        
    };
    vm.signout = function () {
        tmAuth.logout().then(function(result){
            console.log(result);
            if (result.data.success)
            {
                tmNotifier.notify("You have successfully signed out!");
                console.log('logged out!!!');
            }
            
        });
    };
    vm.goLogin = function () {
        $state.go('root.login');
    };
}


tmLoginCtrl.$inject = ['tmAuth', 'tmIdentity', 'tmNotifier', '$state', '$timeout'];
export default tmLoginCtrl;


