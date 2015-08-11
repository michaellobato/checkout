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