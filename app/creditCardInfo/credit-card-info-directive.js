angular.module('my-checkout').directive('creditCardInfo', ['$location', 'StuffToBuyFactory',
    function($location, StuffToBuyFactory){
    return {
        scope: {
            subTotal: "="
        },
        restrict: 'E',
        templateUrl: "creditCardInfo/creditCardInfo.html",
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