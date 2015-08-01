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
        }).when("/stuffToBuy/checkout/thankYou", {
            //TODO: prevent naving to this url if appropriate.
            //TODO: this should be in a template file
            template: "<div>Thank you for your purchase!</div>"
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
            "<div class='stuffToBuyContainer'>"+
                "<div class='page-header'>"+
                    "<h2>Buy my stuff please</h2>"+
                "</div>"+
                "<section>Select the things you wish to purchase</section>"+
                "<div class='col-md-3'>"+
                    "<table class='table'>"+
                        "<thead>"+
                            "<tr>"+
                                "<th></th>"+
                                "<th>Thing</th>"+
                                "<th>Price</th>"+
                            "</tr>"+
                        "</thead>"+
                        "<tbody>"+
                        "<tr ng-repeat='thing in stuffToBuy.stuff' class='thing trst-group-item'>"+
                            "<td class='include'><input ng-model='thing.inCart' type='checkbox'></input></td>"+
                            "<td class='title'>{{thing.title}}</td>"+
                            "<td class='price'>{{thing.price | currency}}</td>"+
                        "</tr>"+
                        "</tbody>"+
                    "</table>"+
                "</div>"+
                "<p class=''><button type='button' class='btn btn-primary' ng-click='checkout()'>Checkout</button></p>"+
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
                price: Math.random() * (1.99 - 3.99) + 3.99
            }, {
                id: "2",
                title: "Great Thing",
                price: Math.random() * (3.99 - 6.99) + 6.99
            }, {
                id: "3",
                title: "Best Thing",
                price: Math.random() * (7.99 - 9.99) + 9.99
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

        instance.clearCart = function() {
            _.each(stuffToBuy.stuff, function(thing) {
                thing.inCart = false;
            });
        }

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
                "<div class='page-header'>"+
                    "<h2>Pay me for the stuff Please!</h2>"+
                "</div>"+
                //TODO: this should be in a reusable template
                "<div class='col-md-3'>"+
                    "<table class='table'>"+
                        "<thead>"+
                            "<tr>"+
                                "<th>Thing</th>"+
                                "<th>Price</th>"+
                                "<th></th>"+
                            "</tr>"+
                        "</thead>"+
                        "<tbody>"+
                        "<tr ng-repeat='thing in stuffToBuy.stuff | filter:{inCart: true}' class='thing trst-group-item'>"+
                            "<td class='title'>{{thing.title}}</td>"+
                            "<td class='price'>{{thing.price | currency}}</td>"+
                            "<td class='remove'><button type='button' class='btn btn-xs btn-warning'>Remove</button></td>"+
                        "</tr>"+
                        "</tbody>"+
                    "</table>"+
                "</div>"+
                "<div>"+
                    "<credit-card-info subTotal='{{subTotal}}' ng-if='!isCartEmtpy()'></credit-card-info>"+
                    "<span class='subTotal'>Total: {{subTotal | currency}}</span>"+
                "</div>"+
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
            }
        };
    }
]);

angular.module('my-checkout').directive('creditCardInfo', ['$location', 'StuffToBuyFactory',
    function($location, StuffToBuyFactory){
    // Runs during compile
    return {
        scope: {
            subTotal: "="
        },
        restrict: 'E',
        template:
        "<form class='ccForm' name='ccForm' ng-submit='proceed()'>"+
            "<input name='ccNumber' type='number' placeholder='Credit Card Number' class='ccNumber' ng-model='creditCardNumber' required></input>"+
            "<p><button class='btn btn-primary proceed' type='submit'>Proceed</button></p>"+
        "</form>",
        link: function($scope, iElm, iAttrs, controller) {
            $scope.proceed = function() {
                //TODO: write proper validation for the ccnumber?
                //TODO: implement a payment service to send all this info to server.
                //paymentService.processTransaction().then() {
                var subTotal = StuffToBuyFactory.calcSubTotal();
                StuffToBuyFactory.clearCart();
                $scope.creditCardNumber = null;
                $location.path("/stuffToBuy/checkout/thankYou");
                //});
            }
        }
    };
}]);