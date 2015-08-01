//put everything in this one file for simplicity
angular.module("my-checkout", ["ngRoute"]);

angular.module("my-checkout").config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when("/stuffToBuy", {
            //TODO: this should be in a template file
            template: "<stuff-to-buy></stuff-to-buy>"
        }).when("/stuffToBuy/checkout", {
            //TODO: prevent naving to this url if appropriate.
            //TODO: this should be in a template file
            template: "<checkout></checkout>"
        }).when("/stuffToBuy/checkout/payment", {
            //TODO: prevent naving to this url if appropriate.
            //TODO: this should be in a template file
            template: "<credit-card-info></credit-card-info>"
        }).
        otherwise({
            redirectTo: '/stuffToBuy'
        });
    }
]);

angular.module("my-checkout").directive('stuffToBuy', ["$location", "StuffToBuyFactory",
    function($location, StuffToBuyFactory){
        return {
            scope: {},
            restrict: 'E',
            //TODO: this should be in a template file
            template:
            "<div class='stuffToBuy'>"+
                "<h2>Buy my stuff please</h2>"+
                "<section>Select the things you wish to purchase</section>"+
                "<ul>"+
                    "<li ng-repeat='thing in stuffToBuy.stuff' class='thing'>"+
                        "<span class='title'>{{thing.title}}</span>"+
                        "<span class='price'>{{thing.price | currency}}</span>"+
                        "<input ng-model='thing.inCart' type='checkbox' class='title'></input>"+
                    "</li>"+
                "</ul>"+
                "<button type='button' ng-click='checkout()'>Checkout</button>"+
            "</div>",
            replace: true,
            link: function($scope, iElm, iAttrs, controller) {
                //TODO: obviously there are lots of things to consider here like loading spinners and searching functionality.
                StuffToBuyFactory.getStuffToBuy().then(function (stuffToBuy) {
                    $scope.stuffToBuy = stuffToBuy;
                });
                $scope.checkout = function() {
                    var stuff = $scope.stuffToBuy && $scope.stuffToBuy.stuff;
                    //easy enough for now because we have few things to purchase
                    var purchasingAnything = _.find(stuff, function(thing){
                        return thing.inCart;
                    });
                    if(purchasingAnything) {
                        $location.path("/stuffToBuy/checkout");
                    } else {
                        alert("Please buy something.");
                    }
                }
            }
        };
    }
]);

angular.module("my-checkout").factory('StuffToBuyFactory', ['$q',
    function($q){
        var instance = {};
        var getStuffPromise;
        var stuffToBuy = {
            stuff: []
        };

        instance.getStuffToBuy = function() {
            if(getStuffPromise) return getStuffPromise;
            var def = $q.defer();

            //TODO: get stuff from server
            var fakeStuff = [{
                id: "1",
                title: "Good Thing",
                price: Math.random() * (1.99 - 9.99) + 9.99
            }, {
                id: "2",
                title: "Great Thing",
                price: Math.random() * (1.99 - 9.99) + 9.99
            }, {
                id: "3",
                title: "Best Thing",
                price: Math.random() * (1.99 - 9.99) + 9.99
            }];

            def.resolve(fakeStuff);
            getStuffPromise = def.promise.then(function(stuff) {
                stuffToBuy.stuff = stuff;
                return stuffToBuy;
            }, function(reason) {
                //TODO: handle errors
            });

            return getStuffPromise;
        };

        //clearly I didn't spend much time thinking about how the app will work. This seems weird to be here?
        instance.calcSubTotal = function() {
            return _.reduce(stuffToBuy.stuff, function (memo, thing) {
                if(thing.inCart) memo += thing.price;
                return memo;
            }, 0);
        };

        return instance;
    }
]);

angular.module('my-checkout').directive('checkout', ["$location", "StuffToBuyFactory",
    function($location, StuffToBuyFactory){
        return {
            scope: {},
            restrict: 'E',
            template:
            "<div class='cart'>"+
                "<h2>Pay me for the stuff Please!</h2>"+
                "<ul>"+
                    "<li ng-repeat='thing in stuffToBuy.stuff | filter:{inCart: true}' class='thing'>"+
                        "<span class='title'>{{thing.title}}</span>"+
                        "<span class='price'>{{thing.price | currency}}</span>"+
                        "<span class='remove' ng-click='removeFromCart(thing)'>Remove</span>"+
                    "</li>"+
                "</ul>"+
                "<span class='subTotal'>{{subTotal | currency}}</span>"+
                "<button type='button' ng-disabled='isCartEmtpy()' ng-click='proceed()'>Proceed</button>"+
            "</div>",
            replace: true,
            link: function($scope, iElm, iAttrs) {
                StuffToBuyFactory.getStuffToBuy().then(function(stuffToBuy) {
                    $scope.stuffToBuy = stuffToBuy;
                    $scope.subTotal = StuffToBuyFactory.calcSubTotal();
                });

                $scope.isCartEmtpy = function() {
                    var stuff = $scope.stuffToBuy && $scope.stuffToBuy.stuff;
                    return !_.find(stuff, function(thing){
                        return thing.inCart;
                    });
                };

                $scope.removeFromCart = function(thing) {
                    thing.inCart = false;
                    $scope.subTotal = StuffToBuyFactory.calcSubTotal();
                };

                $scope.proceed = function() {
                    $location.path("/stuffToBuy/checkout/payment");
                }
            }
        };
    }
]);

angular.module('my-checkout').directive('creditCardInfo', ['$q', 'StuffToBuyFactory',
    function($q, StuffToBuyFactory){
    // Runs during compile
    return {
        scope: {},
        restrict: 'E',
        template:
        "<div>CREDIT CARD INFO</div>",
        // templateUrl: '',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, iElm, iAttrs, controller) {
            $scope.subTotal = StuffToBuyFactory.calcSubTotal();
            $scope.proceed = function() {
                //TODO: navigate to done page
                //TODO: invalidate cart page?
                //TODO: remove items from cart
            }
        }
    };
}]);