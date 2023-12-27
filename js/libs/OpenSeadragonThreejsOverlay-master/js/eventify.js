/**
 * Mixin to let object fire events and let consumers
 * listen to those events.
 * 
 * @param object {Object} - producer of events.
 * @param contract {Array of strings} - optional events contract.
 *
 * Examples:
 *   var obj = eventify({});
 *   // now you can listen to object's events:
 *   obj.on('Changed', function () { console.log('changed!'); });
 *   obj.fire('Changed'); // triggers "changed" event.
 *
 *   // you can pass arbitrary arguments to fire() method:
 *   obj.on('NameChanged', function (name) { console.log(name); });
 *   obj.fire('NameChanged', "John Smith"); // prints "John Smith"
 *
 *   // you can also define events contract:
 *   var netEvents = evenitify({}, ['Connected', 'Disconnected']);
 *   // mixin now gets an 'onXXX' and 'fireXXX' events declared:
 *   netEvents.onConnected(function () { console.log('Connected!'); });
 *   netEents.fireConnected();
 **/
function eventify(object, contract) {
    contract = contract || [];
    var listeners = {};
    object.on = function (eventName, listener, ctx) {
        if (!listeners.hasOwnProperty(eventName)) {
            listeners[eventName] = [];
        }
        listeners[eventName].push({
            callback: listener,
            ctx: ctx
        });
        return object;
    };

    object.fire = function (eventName) {
        var callbacksData = listeners[eventName];
        if (callbacksData) {
            for (var i = 0; i < callbacksData.length; ++i) {
                var cd = callbacksData[i];
                cd.callback.apply(cd.ctx, Array.prototype.slice.call(arguments, 1));
            }
        }
        return object;
    };
    var createFireHandler = function (contractName) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(contractName);
            return object.fire.apply(null, args);
        };
    };
    var createOnHandler = function (contractName) {
        return function (listener, ctx) {
            return object.on(contractName, listener, ctx);
        };
    };

    for (var i = 0; i < contract.length; ++i) {
        var contractName = contract[i];
        object['on' + contractName] = createOnHandler(contractName);
        object['fire' + contractName] = createFireHandler(contractName);
    }
    return object;
};