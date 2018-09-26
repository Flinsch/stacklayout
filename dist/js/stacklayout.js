
(function(factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        window.stacklayout = factory(jQuery);
    }
})(function($) {
    var stacklayout = {};

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

    stacklayout.init = function($stacklayout, element) {
        $stacklayout = $($stacklayout);
        var index = _index(element);
        $stacklayout.data('stacklayout-index', index);
        var props = _props($stacklayout);
        $stacklayout[props.scrollfn](index * props.step);
    };

    stacklayout.switch = function($stacklayout, element, callback) {
        $stacklayout = $($stacklayout);
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
    };

    stacklayout.next = function($stacklayout, callback) {
        $stacklayout = $($stacklayout);
        var index = $stacklayout.data('stacklayout-index');
        stacklayout.switch($stacklayout, index + 1, callback);
    };

    stacklayout.prev = function($stacklayout, callback) {
        $stacklayout = $($stacklayout);
        var index = $stacklayout.data('stacklayout-index');
        stacklayout.switch($stacklayout, index - 1, callback);
    };

    stacklayout.push = function($stacklayout, $content) {
        $stacklayout = $($stacklayout);
        var count = $stacklayout.find('> .stacklayout-panel').length;
        stacklayout.insert($stacklayout, $content, count);
    };

    stacklayout.pop = function($stacklayout) {
        $stacklayout = $($stacklayout);
        var count = $stacklayout.find('> .stacklayout-panel').length;
        stacklayout.remove($stacklayout, count - 1);
    };

    stacklayout.insert = function($stacklayout, $content, element) {
        $stacklayout = $($stacklayout);
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
        stacklayout.switch($stacklayout, index);
    };

    stacklayout.remove = function($stacklayout, element) {
        $stacklayout = $($stacklayout);
        var index = _index(element);
        var count = $stacklayout.find('> .stacklayout-panel').length;
        if (index < 0 || index >= count) {
            return;
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
                stacklayout.switch($stacklayout, index + 1, do_remove);
            } else if (index > 0) {
                stacklayout.switch($stacklayout, index - 1, do_remove);
            } else {
                do_remove();
            }
        } else {
            do_remove();
        }
    };

    return stacklayout;
});
