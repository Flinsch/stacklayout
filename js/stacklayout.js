
(function(factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        window.Stacklayout = factory(jQuery);
    }
})(function($) {
    var Stacklayout = function($stacklayout, element) {
        this.$stacklayout = $stacklayout;

        this.init(element);
    };

    var _props = function($stacklayout) {
        if ($stacklayout.is('.stacklayout-horizontal')) {
            return {
                scrollfn: 'scrollLeft',
                step: $stacklayout.width()
            };
        } else {
            return {
                scrollfn: 'scrollTop',
                step: $stacklayout.height()
            };
        }
    };

    var _index = function(element) {
        if (element instanceof jQuery) {
            var $panel = element.closest('.stacklayout-panel');
            return $panel.index();
        } else if ($.isNumeric(element)) {
            return 1*element;
        } else {
            return 0;
        }
    };

    Stacklayout.prototype.init = function(element) {
        var $stacklayout = this.$stacklayout;
        var index = _index(element);
        $stacklayout.data('stacklayout-index', index);
        var props = _props($stacklayout);
        $stacklayout[props.scrollfn](index * props.step);
        return this;
    };

    Stacklayout.prototype.current = function() {
        var $stacklayout = this.$stacklayout;
        var index = $stacklayout.data('stacklayout-index');
        return $stacklayout.find('> .stacklayout-panel:nth-child('+(index+1)+')');
    };

    Stacklayout.prototype.switch = function(element, callback) {
        var $stacklayout = this.$stacklayout;
        var index = _index(element);
        var count = $stacklayout.find('> .stacklayout-panel').length;
        if (count > 0) {
            if (index < 0) {
                index = (count-1) + ((index+1) % count);
            } else {
                index = index % count;
            }
        } else {
            index = 0;
        }
        $stacklayout.data('stacklayout-index', index);
        var props = _props($stacklayout);
        var properties = {};
        properties[props.scrollfn] = index * props.step;
        $stacklayout.animate(properties, callback);
        return this.current();
    };

    Stacklayout.prototype.next = function(callback) {
        var $stacklayout = this.$stacklayout;
        var index = $stacklayout.data('stacklayout-index');
        return this.switch(index + 1, callback);
    };

    Stacklayout.prototype.prev = function(callback) {
        var $stacklayout = this.$stacklayout;
        var index = $stacklayout.data('stacklayout-index');
        return this.switch(index - 1, callback);
    };

    Stacklayout.prototype.push = function($content) {
        var $stacklayout = this.$stacklayout;
        var count = $stacklayout.find('> .stacklayout-panel').length;
        return this.insert($content, count);
    };

    Stacklayout.prototype.pop = function() {
        var $stacklayout = this.$stacklayout;
        var count = $stacklayout.find('> .stacklayout-panel').length;
        return this.remove(count - 1);
    };

    Stacklayout.prototype.insert = function($content, element) {
        var $stacklayout = this.$stacklayout;
        var index = _index(element);
        var count = $stacklayout.find('> .stacklayout-panel').length;
        if (index < 0) {
            index = 0;
        }
        if (index > count) {
            index = count;
        }
        var $panel = $('<div/>', { 'class': 'stacklayout-panel' });
        $panel.append($content);
        if (index === 0) {
            $stacklayout.prepend($panel);
        } else {
            $stacklayout.find('> .stacklayout-panel:nth-child('+index+')').after($panel);
        }
        if (index <= $stacklayout.data('stacklayout-index')) {
            var props = _props($stacklayout);
            $stacklayout.data('stacklayout-index', $stacklayout.data('stacklayout-index') + 1);
            $stacklayout[props.scrollfn]($stacklayout.data('stacklayout-index') * props.step);
        }
        return this.switch(index);
    };

    Stacklayout.prototype.remove = function(element) {
        var $stacklayout = this.$stacklayout;
        var index = _index(element);
        var count = $stacklayout.find('> .stacklayout-panel').length;
        if (index < 0 || index >= count) {
            return this;
        }
        var do_remove = function() {
            var $panel = $stacklayout.find('> .stacklayout-panel:nth-child('+(index+1)+')');
            $panel.remove();
            var props = _props($stacklayout);
            if (index < $stacklayout.data('stacklayout-index')) {
                $stacklayout.data('stacklayout-index', $stacklayout.data('stacklayout-index') - 1);
            }
            $stacklayout[props.scrollfn]($stacklayout.data('stacklayout-index') * props.step);
        };
        if (index === $stacklayout.data('stacklayout-index')) {
            if (index + 1 < count) {
                this.switch(index + 1, do_remove);
            } else if (index > 0) {
                this.switch(index - 1, do_remove);
            } else {
                do_remove();
            }
        } else {
            do_remove();
        }
        return this;
    };

    return Stacklayout;
});
