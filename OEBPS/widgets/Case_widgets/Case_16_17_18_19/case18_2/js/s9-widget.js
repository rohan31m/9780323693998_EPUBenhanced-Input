/**
 * s9-widget is a lightweight library provided to widgets to communicate with the system. All
 * communication with the system is through the HTML5 window.postMessage API.
 *
 * This library may be modified as needed.
 *
 * Current version: 0.1
 *
 * Version history:
 *   0.1: Initial release.
 */
s9 = (function(){
    var onSyncCallback, onRotateCallback;

    // Parse initial params from query string.
    var initialParams = {};
    window.location.search.replace(/([^?=&]+)(=([^&]*))?/g, function($0, $1, $2, $3){
        initialParams[$1] = decodeURIComponent($3);
    });

    // Normalize matchesSelector API.
    Element.prototype.matchesSelector = Element.prototype.matchesSelector || Element.prototype.matches ||
        Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector;

    // Sends a message to the system.
    function sendMessage(type, method, data){
        window.parent.postMessage({
            type: type,
            method: method,
            data: data
        }, '*');
    }

    // Receives a message from the system.
    window.addEventListener('message', function(evt){
        var payload = evt.data;
        // Handle types.
        if (payload.type === 'data'){
            if (onSyncCallback) onSyncCallback(payload.data);
        } else if (payload.type == 'orientationchange'){
            if (onRotateCallback) onRotateCallback(payload.data);
        }
    }, false);

    // Tells the system to open a link.
    function openLink(href){
        sendMessage('link', 'open', href);
    }

    // Helper for simple event delegation.
    function clickHandlers(events){
        // iOS requires that we add cursor:pointer to clickable elements in order for
        // the event to bubble. See http://www.quirksmode.org/blog/archives/2010/10/click_event_del_1.html.
        if (navigator.userAgent.match(/(iPad|iPhone|iPod)/i)){
            for (var key in events){
                var clickables = document.querySelectorAll(key);
                [].forEach.call(clickables, function(clickable){
                    clickable.style.cursor = 'pointer';
                });
            }
        }

        // Walk up the event parentNode chain and try to match to the selectors.
        document.addEventListener('click', function(evt){
            var target = evt.target;
            while (target && target !== document){    
                for (var key in events){
                    // Return after the first match.
                    if (target.matchesSelector(key)){
                        // Prevent the browser from taking the event.
                        evt.preventDefault();
                        evt.stopPropagation();
                        // Override currentTarget as if the event handler was attached directly to the node.
                        evt.currentTarget = target;
                        events[key](evt, target);
                        return true;
                    }
                }
                target = target.parentNode;
            }
        });
    }

    // Intercept clicks on hrefs to open them externally.
    clickHandlers({
        '[href]': function(evt, target){
            var href = target.getAttribute('href');
            openLink(href);
        }
    });

    // See documentation above.
    return {
        initialParams: initialParams,
        events: clickHandlers,
        links: {
            open: openLink
        },
        data: {
            save: function(content){
                sendMessage('data', 'save', content);
            },
            onrestore: function(callback){
                onSyncCallback = callback;
            }
        },
        view: {
            size: function(sizes){
                sendMessage('size', 'set', sizes);
            },
            onrotate: function(callback){
                onRotateCallback = callback;
            }
        }
    };
})();