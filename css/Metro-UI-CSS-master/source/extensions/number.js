(function() {
    'use strict';

    /**
     * Number.prototype.format(n, x, s, c)
     *
     * @param  n: length of decimal
     * @param  x: length of whole part
     * @param  s: sections delimiter
     * @param  c: decimal delimiter
     */
    Number.prototype.format = function(n, x, s, c) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
            num = this.toFixed(Math.max(0, ~~n));

        return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
    };
}());