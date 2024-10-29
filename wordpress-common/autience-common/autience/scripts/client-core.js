var Autience = null

defineAutience()

function defineAutience() {

    if (Autience != null) {
        return
    }
    Autience = {
        lifecycle: {
            onPageLoad: [],
            render: [
                //put functions which recreate the DOM (new insertions etc)
            ],
            postRender: [function() {
                    //adding of listener should be done after render

                    //render powered by message if required
                    if (autience_settings && autience_settings.powered) {
                        if (document.getElementById("powered-by-autience")) {
                            document.getElementById("powered-by-autience").style.display = 'block'

                            document.getElementById("powered-by-autience-link").href = autience_link + "?utm_source=" + window.location.host +
                                "&utm_medium=popup&utm_content=" + autience_settings.theme +
                                "&utm_campaign=" + autience_widget
                        }
                    }
                },
                /*function() {                               
                               if (autience_settings && autience_settings.general && (autience_settings.general.close == false)) {
                                   document.getElementById("autience-close-button").style.display = 'none'
                               }
                           },*/
                function() {
                    Autience.utils.classListen('autience-close-button', 'click', Autience.utils.closeWidget)
                }
            ],
            displayValidation: [function() {
                if (autience_settings && autience_settings.general && autience_settings.general.repeat == 'never') {
                    if (Autience.utils.readCookie("autience_" + autience_widget)) {
                        console.log('widget has already been shown')
                        return false
                    }
                }
                return true
            }, function() {
                if (autience_settings && autience_settings.general && autience_settings.general.repeat == 'action') {
                    if (Autience.utils.readCookie("autience_action_" + autience_widget)) {
                        console.log('expected action is already performed')
                        return false
                    }
                }
                return true
            }],
            display: [function() {
                Autience.utils.executeOnClass("autience-blog-page-container", function(el) {
                    el.style.display = "block"
                })
            }, function() {
                Autience.utils.createCookie("autience_" + autience_widget, "displayed")
            }],
            beforeClose: [],
            close: [function() {
                Autience.utils.executeOnClass("autience-blog-page-container", function(el) {
                    el.style.display = "none"
                })
            }],
            afterClose: []
        },
        utils: {},
        listeners: [],
        emitted: {},
        executors: {}
    }

    //simple functions with no dependencies
    Autience.executors.defineUtils = function() {

        //1. Ajax object
        Autience.utils.ajax = {
            xhr: null,
            request: function(url, method, data, success, failure) {
                if (!this.xhr) {
                    this.xhr = window.ActiveX ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
                }
                var self = this.xhr

                self.onreadystatechange = function() {
                    if (self.readyState === 4 && self.status === 200) {
                        // the request is complete, parse data and call callback

                        success(self.responseText)
                    } else if (self.readyState === 4) {
                        // something went wrong but complete
                        failure()
                    }
                }

                this.xhr.open(method, url, true)
                this.xhr.setRequestHeader("Content-Type", "text/json")

                if (data) {
                    this.xhr.send(JSON.stringify(data))
                } else {
                    this.xhr.send()
                }

            }
        }

        //2. emitOnce
        Autience.utils.emitOnce = function(eventName) {
            //only emit if this event was not already emitted
            if (!Autience.emitted[eventName]) {
                var event; // The custom event that will be created
                if (document.createEvent) {
                    event = document.createEvent("HTMLEvents");
                    event.initEvent(eventName, true, true);
                } else {
                    event = document.createEventObject();
                    event.eventType = eventName;
                }

                event.eventName = eventName;

                if (document.createEvent) {
                    document.dispatchEvent(event);
                } else {
                    document.fireEvent("on" + event.eventType, event);
                }
                Autience.emitted[eventName] = true
            }
        }

        //3. cross browser listener
        Autience.utils.listen = function(obj, evt, fn) {
            //some browsers support addEventListener, and some use attachEvent
            if (obj) {
                if (obj.addEventListener) {
                    obj.addEventListener(evt, function(e) {
                        fn(e, evt)
                    }, false);
                } else if (obj.attachEvent) {
                    obj.attachEvent("on" + evt, function(e) {
                        //pass event as an additional parameter to the input function
                        fn(e, evt)
                    })
                }
            }
        }

        //4. getting document height
        Autience.utils.getDocHeight = function() {
            var D = document
            return Math.max(
                D.body.scrollHeight, D.documentElement.scrollHeight,
                D.body.offsetHeight, D.documentElement.offsetHeight,
                D.body.clientHeight, D.documentElement.clientHeight
            )
        }

        //5. createCookies
        Autience.utils.createCookie = function(name, value) {
            document.cookie = name + "=" + value + ";path=/"
        }

        Autience.utils.readCookie = function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }


        //6. bind function on all elements with the clas
        Autience.utils.executeOnClass = function(class_name, fn) {
            var els = document.getElementsByClassName(class_name)
            if (els) {
                for (var i = 0; i < els.length; i++) {
                    fn(els[i])
                }
            }
        }

        Autience.utils.executeOnId = function(id, fn) {
            var el = document.getElementById(id)
            if (el) {
                fn(el)
            }
        }


        //7. Listen on elements by class name
        Autience.utils.classListen = function(class_name, evt, fn) {
            Autience.utils.executeOnClass(class_name, function(el) {
                Autience.utils.listen(el, 'click', fn)
            })
        }

        //8. Execute array of functions without input
        Autience.utils.executeSequence = function(fn_array) {
            if (fn_array) {
                for (var i = 0; i < fn_array.length; i++) {
                    fn_array[i]()
                }
            }
        }

        //9. Execute validators in sequence and return true if all are valid
        Autience.utils.validateSequence = function(fn_array, inp) {
            if (fn_array) {
                for (var i = 0; i < fn_array.length; i++) {
                    if (!fn_array[i](inp)) {
                        console.log('in validateSequence ' + i + ' th function is returning false')
                        return false
                    }
                }
            }
            return true
        }

        //10. get a smart setting value
        Autience.utils.smartSetting = function(extension, key) {
            if (autience_settings && autience_settings.smart && autience_settings.smart[extension]) {
                return autience_settings.smart[extension][key]
            }
        }

        //11. close widget
        Autience.utils.closeWidget = function() {
            Autience.utils.executeSequence(Autience.lifecycle.close)
            Autience.utils.executeSequence(Autience.lifecycle.afterClose)
        }
    }

    Autience.executors.defineListeners = function() {

        Autience.listeners = {
            page_load: {
                target: window,
                trigger: ['onload', 'load'],
                reaction: function() {
                    Autience.utils.emitOnce('autience_page_loaded')
                },
                once: true
            },
            autience_page_load: {
                target: document,
                trigger: 'autience_page_loaded',
                reaction: function() {

                    //once the page is loaded, emit events for delayed triggers
                    var delay_times = [5, 10, 30, 60]

                    delay_times.forEach(function(d) {
                        setTimeout(function() {
                            Autience.utils.emitOnce('autience_elapsed_' + d)
                        }, d * 1000)
                    })

                    //emit scrolled to bottom
                    Autience.utils.listen(window, 'scroll', function() {
                        if ((window.innerHeight + window.scrollY) >= Autience.utils.getDocHeight() - 100) {
                            // you're at the bottom of the page
                            Autience.utils.emitOnce('autience_scroll_bottom')
                        }
                    })
                },
                once: true
            },
            exit_intent: {
                target: document,
                trigger: 'mouseout',
                reaction: function(e) {
                    e = e ? e : window.event;
                    var from = e.relatedTarget || e.toElement;
                    if ((!from || from.nodeName == "HTML") && (!e.clientY || (e.clientY <= 0))) {

                        Autience.utils.emitOnce('autience_page_exit')
                    }
                }
            },
            show_popup: {
                target: document,
                trigger: ['autience_page_exit', 'autience_page_loaded', 'autience_elapsed_5', 'autience_elapsed_10', 'autience_elapsed_30', 'autience_elapsed_60', 'autience_scroll_bottom'],
                reaction: function(e, current_trigger) {
                    var autience_trigger = null

                    if (autience_settings && autience_settings.general) {
                        autience_trigger = "autience_" + autience_settings.general.trigger
                        if (autience_trigger == 'autience_elapsed') {
                            autience_trigger = autience_trigger + '_' + autience_settings.general.elapsed
                        }

                        if (autience_trigger == current_trigger) {
                            //trigger is matching, check if the popup is to be shown, and then show it
                            if (Autience.executors.isWidgetToBeDisplayed()) {

                                /*
                                    1. Make any additional rendering required
                                    2. Do any post rendering to bind events after rendering
                                    3. Display the widget
                                */
                                Autience.utils.executeSequence(Autience.lifecycle.render)
                                Autience.utils.executeSequence(Autience.lifecycle.postRender)
                                Autience.utils.executeSequence(Autience.lifecycle.display)

                            }
                        }
                    }
                }
            }
        }
    }

    Autience.executors.bindListeners = function() {
        //iterate through all the listeners and bind them
        var listener = null,
            triggers = null
        for (var key in Autience.listeners) {
            listener = Autience.listeners[key]
                //if trigger is a string, put the single string in an array
            if (typeof listener.trigger === 'string') {
                triggers = [listener.trigger]
            } else {
                triggers = listener.trigger
            }
            triggers.forEach(function(trigger) {
                Autience.utils.listen(listener.target, trigger, listener.reaction)
            })
        }
    }

    Autience.executors.isWidgetToBeDisplayed = function() {
        //TODO- check the list of validators based on cookies, user preferences etc
        var to_display = Autience.utils.validateSequence(Autience.lifecycle.displayValidation)

        return to_display
    }

    Autience.executors.displayWidget = function() {
        Autience.utils.executeSequence(Autience.lifecycle.display)
    }

    //execute defineUtils and defineListeners
    //Everything else happens when some event occurs

    Autience.executors.defineUtils()
    Autience.executors.defineListeners()
    Autience.executors.bindListeners()

}