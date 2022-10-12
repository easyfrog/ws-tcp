/**
 * smokesignals
 */

module.exports = Evento = {
    convert: function(obj, handlers) {
        // we store the list of handlers as a local variable inside the scope
        // so that we don't have to add random properties to the object we are
        // converting. (prefixing variables in the object with an underscore or
        // two is an ugly solution)
        //      we declare the variable in the function definition to use two less
        //      characters (as opposed to using 'var ').  I consider this an inelegant
        //      solution since smokesignals.convert.length now returns 2 when it is
        //      really 1, but doing this doesn't otherwise change the functionallity of
        //      this module, so we'll go with it for now
        handlers = {};

        //
        // add state by ztc 2018.4.10
        // 可以将某个eventName的state设置为fasle,
        // 这样将不会出发此事件
        //
        var state = {};

        obj.setEventState = function (eventName, boo) {
            state[eventName] = boo;
        }

        obj.getEventState = function (eventName) {
            return state[eventName] === false ? false : true;
        }


        //
        // add tmpEventMode
        // 用于, 在编辑器中的 playState 时,加入的 事件,
        // 在离开时, 对事件进行解绑
        //
        obj._tmpEventMode = false;

        Object.defineProperties(obj, {
            tmpEventMode: {
                get: function () {
                    return obj._tmpEventMode;            
                },
                set: function (boo) {
                    obj._tmpEventMode = boo;

                    if (!boo) {
                        if (obj.tmpEvents) {
                            obj.tmpEvents.forEach(off => off());
                            obj.tmpEvents.length = 0;
                            delete obj.tmpEvents;
                        }
                    }      
                }
            }
        })

        // add a listener
        // return: off function
        // off = obj.on(eventName, handler);
        obj.on = function(eventName, handler) {
            // either use the existing array or create a new one for this event
            //      this isn't the most efficient way to do this, but is the shorter
            //      than other more efficient ways, so we'll go with it for now.
            // (handlers[eventName] = handlers[eventName] || [])
            //     // add the handler to the array
            //     .push(handler);

            // ztc 20210407 add eventName array support
            var ens = [].concat(eventName);

            ens.forEach(en => {
                (handlers[en] = handlers[en] || [])
                    // add the handler to the array
                    .push(handler);
            })

            // return obj;

            // return the off function
            // function off() {
            //     obj.off(eventName, handler);
            // }

            function off() {
                ens.forEach(en => {
                    obj.off(en, handler);
                })
                // obj.off(eventName, handler);
            }

            if (obj.tmpEventMode) {
                if (!obj.tmpEvents) {
                    obj.tmpEvents = [];
                }

                obj.tmpEvents.push(off);
            }

            return off;
        };

        // get handlers by eventName
        // #if IS_EDITOR
        obj.getHandlers = function(eventName) {
            return eventName ? handlers[eventName] : handlers;
        };
        // #endif

        // clear specified event's handler or ALL handlers
        obj.clearHandlers = function (eventName) {
            if (eventName) {
                handlers[eventName] = {};
                delete state[eventName];
            } else {
                handlers = {};
                state = {};
            }
        };

        // add a listener that will only be called once
        obj.once = function(eventName, handler) {
            // create a wrapper listener, that will remove itself after it is called
            function wrappedHandler() {
                // remove ourself, and then call the real handler with the args
                // passed to this wrapper
                handler.apply(obj.off(eventName, wrappedHandler), arguments);
            }
            // in order to allow that these wrapped handlers can be removed by
            // removing the original function, we save a reference to the original
            // function
            wrappedHandler.h = handler;

            // call the regular add listener function with our new wrapper
            return obj.on(eventName, wrappedHandler);
        }

        // remove a listener
        obj.off = function(eventName, handler) {
            // loop through all handlers for this eventName, assuming a handler
            // was passed in, to see if the handler passed in was any of them so
            // we can remove it
            //      it would be more efficient to stash the length and compare i
            //      to that, but that is longer so we'll go with this.
            for (var list = handlers[eventName], i = 0; handler && list && list[i]; i++) {
                // either this item is the handler passed in, or this item is a
                // wrapper for the handler passed in.  See the 'once' function
                list[i] != handler && list[i].h != handler ||
                    // remove it!
                    list.splice(i--,1);
            }
            // if i is 0 (i.e. falsy), then there are no items in the array for this
            // event name (or the array doesn't exist)
            // if (!i) {
            if (!handler) {
                // remove the array for this eventname (if it doesn't exist then
                // this isn't really hurting anything)
                delete handlers[eventName];
                delete state[eventName];
            }
            return obj;
        }

        obj.emit = function(eventName) {

            //
            // 先判断这个eventName的state，如果为false则不触发此数据
            //
            if (state[eventName] === false) { return obj; }

            // add to object's '__events' to hold the event's name
            // 2021.6.10 Beijing home
            if (!obj.__events) {
                obj.__events = {};
            }

            obj.__events[eventName] = eventName;

            // loop through all handlers for this event name and call them all
            //      it would be more efficient to stash the length and compare i
            //      to that, but that is longer so we'll go with this.
            for(var list = handlers[eventName], i = 0; list && list[i];) {
                list[i++].apply(obj, list.slice.call(arguments, 1));
            }
            return obj;
        }

        return obj;
    }
};
