/* global Metro */
(function(Metro, $) {
    'use strict';
    //var Utils = Metro.utils;
    var KeypadDefaultConfig = {
        keypadDeferred: 0,
        label: "",
        keySize: 48,
        keys: "1, 2, 3, 4, 5, 6, 7, 8, 9, 0",
        exceptKeys: "",
        keySeparator: "",
        trimSeparator: false,
        keyDelimiter: ",",
        copyInlineStyles: false,
        target: null,
        keyLength: 0,
        shuffle: false,
        shuffleCount: 3,
        position: Metro.position.BOTTOM_LEFT, //top-left, top, top-right, right, bottom-right, bottom, bottom-left, left
        dynamicPosition: false,
        serviceButtons: true,
        showValue: true,
        open: false,
        sizeAsKeys: false,

        clsKeypad: "",
        clsInput: "",
        clsKeys: "",
        clsKey: "",
        clsServiceKey: "",
        clsBackspace: "",
        clsClear: "",
        clsLabel: "",

        onChange: Metro.noop,
        onClear: Metro.noop,
        onBackspace: Metro.noop,
        onShuffle: Metro.noop,
        onKey: Metro.noop,
        onKeypadCreate: Metro.noop
    };

    Metro.keypadSetup = function (options) {
        KeypadDefaultConfig = $.extend({}, KeypadDefaultConfig, options);
    };

    if (typeof window["metroKeypadSetup"] !== undefined) {
        Metro.keypadSetup(window["metroKeypadSetup"]);
    }

    Metro.Component('keypad', {
        init: function( options, elem ) {
            this._super(elem, options, KeypadDefaultConfig, {
                value: elem.tagName === 'INPUT' ? elem.value : elem.innerText,
                positions: ["top-left", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left"],
                keypad: null,
                keys: [],
                keys_to_work: [],
                exceptKeys: []
            });

            return this;
        },

        _create: function(){
            var element = this.element, o = this.options;

            this.keys = o.keys.toArray(o.keyDelimiter);
            this.keys_to_work = this.keys;
            this.exceptKeys = o.exceptKeys.toArray(o.keyDelimiter);

            this._createKeypad();
            if (o.shuffle === true) {
                this.shuffle();
            }
            this._createKeys();
            this._createEvents();

            this._fireEvent("keypad-create", {
                element: element
            });
        },

        _createKeypad: function(){
            var element = this.element, o = this.options;
            var parent = element.parent();
            var keypad, keys;

            if (parent.hasClass("input")) {
                keypad = parent;
            } else {
                keypad = $("<div>").addClass("input").addClass(element[0].className);
            }

            keypad.addClass("keypad");
            if (keypad.css("position") === "static" || keypad.css("position") === "") {
                keypad.css({
                    position: "relative"
                });
            }

            if (element.attr("type") === undefined) {
                element.attr("type", "text");
            }

            keypad.insertBefore(element);

            element.attr("readonly", true);
            element.appendTo(keypad);

            keys = $("<div>").addClass("keys").addClass(o.clsKeys);
            keys.appendTo(keypad);
            this._setKeysPosition();

            if (o.open === true) {
                keys.addClass("open keep-open");
            }


            element[0].className = '';
            if (o.copyInlineStyles === true) {
                for (var i = 0, l = element[0].style.length; i < l; i++) {
                    keypad.css(element[0].style[i], element.css(element[0].style[i]));
                }
            }

            element.addClass(o.clsInput);
            keypad.addClass(o.clsKeypad);

            element.on(Metro.events.blur, function(){keypad.removeClass("focused");});
            element.on(Metro.events.focus, function(){keypad.addClass("focused");});

            if (o.label) {
                var label = $("<label>").addClass("label-for-input").addClass(o.clsLabel).html(o.label).insertBefore(keypad);
                if (element.attr("id")) {
                    label.attr("for", element.attr("id"));
                }
                if (element.attr("dir") === "rtl") {
                    label.addClass("rtl");
                }
            }

            if (o.disabled === true || element.is(":disabled")) {
                this.disable();
            } else {
                this.enable();
            }

            this.keypad = keypad;
        },

        _setKeysPosition: function(){
            var element = this.element, o = this.options;
            var keypad = element.parent();
            var keys = keypad.find(".keys");
            keys.removeClass(this.positions.join(" ")).addClass(o.position)
        },

        _createKeys: function(){
            var element = this.element, o = this.options;
            var keypad = element.parent();
            var key, keys = keypad.find(".keys");
            var factor = Math.round(Math.sqrt(this.keys.length + 2));
            var key_size = o.keySize;
            var width;

            keys.html("");

            $.each(this.keys_to_work, function(){
                key = $("<span>").addClass("key").addClass(o.clsKey).html(this);
                key.data("key", this);
                key.css({
                    width: o.keySize,
                    height: o.keySize,
                    lineHeight: o.keySize - 4
                }).appendTo(keys);
            });

            if (o.serviceButtons === true) {

                var service_keys = ['&larr;', '&times;'];

                $.each(service_keys, function () {
                    key = $("<span>").addClass("key service-key").addClass(o.clsKey).addClass(o.clsServiceKey).html(this);
                    if (this === '&larr;') {
                        key.addClass(o.clsBackspace);
                    }
                    if (this === '&times;') {
                        key.addClass(o.clsClear);
                    }
                    key.data("key", this);
                    key.css({
                        width: o.keySize,
                        height: o.keySize,
                        lineHeight: o.keySize - 4
                    }).appendTo(keys);
                });
            }

            width = factor * (key_size + 2) - 6;
            keys.outerWidth(width);

            if (o.sizeAsKeys === true && ['top-left', 'top', 'top-right', 'bottom-left', 'bottom', 'bottom-right'].indexOf(o.position) !== -1) {
                keypad.outerWidth(keys.outerWidth());
            }
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;
            var keypad = element.parent();
            var keys = keypad.find(".keys");

            keys.on(Metro.events.click, ".key", function(e){
                var key = $(this);
                var keyValue = key.data("key");
                var crop;

                if (key.data('key') !== '&larr;' && key.data('key') !== '&times;') {

                    if (o.keyLength > 0 && (""+that.value).length === o.keyLength) {
                        return false;
                    }

                    if (that.exceptKeys.indexOf(keyValue) === -1)
                        that.value = that.value + (that.value !== "" ? o.keySeparator : "") + keyValue;

                    if (o.shuffle === true) {
                        that.shuffle();
                        that._createKeys();
                    }

                    if (o.dynamicPosition === true) {
                        o.position = that.positions[$.random(0, that.positions.length - 1)];
                        that._setKeysPosition();
                    }

                    that._fireEvent("key", {
                        key: key.data("key"),
                        val: that.value
                    });

                } else {
                    if (key.data('key') === '&times;') {
                        that.value = "";
                        that._fireEvent("clear");
                    }
                    if (key.data('key') === '&larr;') {
                        crop = o.keySeparator && that.value[that.value.length - 1] !== o.keySeparator ? 2 : 1;
                        that.value = (that.value.substring(0, that.value.length - crop));
                        that._fireEvent("backspace", {
                            val: that.value
                        });
                    }
                }

                if (o.showValue === true) {
                    if (element[0].tagName === "INPUT") {
                        element.val(that.value);
                    } else {
                        element.text(that.value);
                    }
                }

                that._fireEvent('change', {
                    val: that.val
                })
                // element.trigger('change');
                // Utils.exec(o.onChange, [that.value], element[0]);

                e.preventDefault();
                e.stopPropagation();
            });

            keypad.on(Metro.events.click, function(e){
                if (o.open === true) {
                    return ;
                }

                if (keys.hasClass("open") === true) {
                    keys.removeClass("open");
                } else {
                    keys.addClass("open");
                }

                e.preventDefault();
                e.stopPropagation();
            });

            if (o.target !== null) {
                element.on(Metro.events.change, function(){
                    var t = $(o.target);
                    if (t.length === 0) {
                        return ;
                    }
                    if (t[0].tagName === "INPUT") {
                        t.val(that.value);
                    } else {
                        t.text(that.value);
                    }
                });
            }
        },

        shuffle: function(){
            var o = this.options;
            for (var i = 0; i < o.shuffleCount; i++) {
                this.keys_to_work = this.keys_to_work.shuffle();
            }

            this._fireEvent("shuffle", {
                keysToWork: this.keys_to_work,
                keys: this.keys
            });
        },

        shuffleKeys: function(count){
            if (count === undefined) {
                count = this.options.shuffleCount;
            }
            for (var i = 0; i < count; i++) {
                this.keys_to_work = this.keys_to_work.shuffle();
            }
            this._createKeys();
        },

        val: function(v){
            var element = this.element, o = this.options;

            if (typeof v === "undefined") {
                return o.trimSeparator ? this.value.replace(new RegExp(o.keySeparator, "g")) : this.value;
            }

            this.value = ""+v;

            if (element[0].tagName === "INPUT") {
                element.val(v);
                // set cursor to end position
            } else {
                element.text(v)
            }

            return this;
        },

        open: function(){
            var element = this.element;
            var keypad = element.parent();
            var keys = keypad.find(".keys");

            keys.addClass("open");
        },

        close: function(){
            var element = this.element;
            var keypad = element.parent();
            var keys = keypad.find(".keys");

            keys.removeClass("open");
        },

        disable: function(){
            this.element.data("disabled", true);
            this.element.parent().addClass("disabled");
        },

        enable: function(){
            this.element.data("disabled", false);
            this.element.parent().removeClass("disabled");
        },

        toggleState: function(){
            if (this.elem.disabled) {
                this.disable();
            } else {
                this.enable();
            }
        },

        setPosition: function(pos){
            var new_position = pos !== undefined ? pos : this.element.attr("data-position");
            if (this.positions.indexOf(new_position) === -1) {
                return ;
            }
            this.options.position = new_position;
            this._setKeysPosition();
        },

        changeAttribute: function(attributeName){
            switch (attributeName) {
                case 'disabled': this.toggleState(); break;
                case 'data-position': this.setPosition(); break;
            }
        },

        destroy: function(){
            var element = this.element, keypad = this.keypad, keys = keypad.find(".keys");

            keypad.off(Metro.events.click);
            keys.off(Metro.events.click, ".key");
            element.off(Metro.events.change);

            return element;
        }
    });

    $(document).on(Metro.events.click, function(){
        var keypads = $(".keypad .keys");
        $.each(keypads, function(){
            if (!$(this).hasClass("keep-open")) {
                $(this).removeClass("open");
            }
        });
    });
}(Metro, m4q));