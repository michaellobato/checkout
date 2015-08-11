angular.module('my-checkout').directive('checkoutCart', ["$location", "StuffToBuyFactory",
    function($location, StuffToBuyFactory){
        return {
            scope: {},
            restrict: 'E',
            templateUrl: "checkoutCart/checkoutCart.html",
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