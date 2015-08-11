//put everything in this one file for simplicity
angular.module("my-checkout", ["ngRoute"]);

angular.module("my-checkout").config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when("/stuffToBuy", {
            //TODO: this should be in a template file
            template: "<stuff-to-buy></stuff-to-buy>"
        }).when("/stuffToBuy/checkout", {
            //TODO: this should be in a template file
            template: "<checkout-cart></checkout-cart>"
        }).when("/stuffToBuy/checkout/thankYou", {
            //TODO: this should be in a template file
            template: "<div>Thank you for your purchase!</div>"
        }).
        otherwise({
            redirectTo: '/stuffToBuy'
        });
    }
]);