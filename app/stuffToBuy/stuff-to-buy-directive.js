angular.module("my-checkout").directive('stuffToBuy', ["$location", "StuffToBuyFactory",
    function($location, StuffToBuyFactory){
        return {
            scope: {},
            restrict: 'E',
            templateUrl: "stuffToBuy/stuffToBuy.html",
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