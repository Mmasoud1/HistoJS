/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var CounterDefaultConfig = {
        startOnViewport: true,
        counterDeferred: 0,
        duration: 2000,
        value: 0,
        from: 0,
        timeout: 0,
        delimiter: ",",
        prefix: "",
        suffix: "",
        onStart: Metro.noop,
        onStop: Metro.noop,
        onTick: Metro.noop,
        onCounterCreate: Metro.noop
    };

    Metro.counterSetup = function (options) {
        CounterDefaultConfig = $.extend({}, CounterDefaultConfig, options);
    };

    if (typeof window["metroCounterSetup"] !== undefined) {
        Metro.counterSetup(window["metroCounterSetup"]);
    }

    Metro.Component('counter', {
        init: function( options, elem ) {
            this._super(elem, options, CounterDefaultConfig, {
                numbers: [],
                html: $(elem).html(),
                started: false,
                id: Utils.elementId("counter")
            });

            return this;
        },

        _create: function(){
            this._createEvents();
            this._fireEvent("counter-create");
            this._run();
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;

            $.window().on("scroll", function(){
                if (o.startOnViewport === true && Utils.inViewport(element[0]) && !that.started) {
                    that.start();
                }
            }, {ns: this.id})
        },

        _run: function(){
            var element = this.element, o = this.options;

            this.started = false;

            if (o.startOnViewport !== true) {
                this.start();
            } else {
                if (Utils.inViewport(element[0])) {
                    this.start();
                }
            }
        },

        startInViewport: function(val, from){
            var o = this.options;

            if (Utils.isValue(from)) {
                o.from = +from;
            }

            if (Utils.isValue(val)) {
                o.value = +val;
            }
            this._run();
        },

        start: function(val, from){
            var that = this, element = this.element, o = this.options;

            if (Utils.isValue(from)) {
                o.from = +from;
            }

            if (Utils.isValue(val)) {
                o.value = +val;
            }

            this.started = true;

            this._fireEvent("start");

            element.animate({
                draw: {
                    innerHTML: [o.from, o.value]
                },
                defer: o.timeout,
                dur: o.duration,
                onFrame: function () {
                    that._fireEvent("tick", {
                        value: +this.innerHTML
                    });
                    this.innerHTML = o.prefix + Number(this.innerHTML).format(0, 0, o.delimiter) + o.suffix
                },
                onDone: function(){
                    that._fireEvent("stop");
                }
            })
        },

        reset: function(){
            this.started = false;
            this.element.html(this.html);
        },

        changeAttribute: function(attr, val){
            var o = this.options;

            if (attr === "data-value") {
                o.value = +val;
            }
            if (attr === "data-from") {
                o.from = +val;
            }
        },

        destroy: function(){
            $.window().off("scroll", {ns: this.id});
            return this.element;
        }
    });
}(Metro, m4q));