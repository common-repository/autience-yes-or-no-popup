angular.module("autienceAdmin", ["ui.bootstrap", "ngAnimate", "base64", "formly", "formlyBootstrap", "toggle-switch", "angucomplete-alt", "ui.grid", "ui.grid.pagination", "color.picker"]) //"formly", "formlyBootstrap",

//Define editable directive
angular.module("autienceAdmin")
    .directive("editable", function() {

        return {
            restrict: 'A',
            scope: {},
            link: function(scope, el, attr) {
                //Get original values from template and put them on scope for editing
                scope.html = el.html().trim()
                scope.attr = attr

                var fontSize = null,
                    fontColor = null,
                    backgroundColor = null,
                    image = null, backgroundImage = null

                if (el[0]) {
                    console.log('element')
                    console.log(el[0].style)
                    fontSize = el[0].style.fontSize
                    fontColor = el[0].style.color
                    backgroundColor = el[0].style.backgroundColor
                    backgroundImage = el[0].style.backgroundImage
                    
                    image = el[0].src
                }

                //convert fontSize to integer
                if (fontSize && fontSize.length > 0) {
                    fontSize = fontSize.replace('px', '')
                    scope.fontSize = parseFloat(fontSize)
                } else {
                    if (attr.defaultSize) {
                        scope.fontSize = parseFloat(attr.defaultSize)
                    } else {
                        scope.fontSize = null
                    }
                }

                if (fontColor && fontColor.length > 0) {
                    scope.fontColor = fontColor
                } else {
                    scope.fontColor = null
                }

                if (backgroundColor && backgroundColor.length > 0) {
                    scope.backgroundColor = backgroundColor
                } else {
                    scope.backgroundColor = null
                }

                if (image && image.length > 0) {
                    scope.image = image
                } else {
                    scope.image = null
                }

                if(backgroundImage && backgroundImage.length > 0){
                    backgroundImage = backgroundImage.replace('url(','')
                    backgroundImage = backgroundImage.replace(')','')
                    scope.backgroundImage = backgroundImage
                }else{
                    scope.backgroundImage = null
                }

            },
            controller: function($scope, $element, $modal, $base64) {
                var editable_scope = $scope

                $element.on('mouseover', function() {
                    $element.addClass('autience-highlight')
                })
                $element.on('mouseout', function() {
                    $element.removeClass('autience-highlight')
                })
                $element.click(function(e) {
                    e.stopPropagation()

                    autience_track_event("editable-clicked", {
                        current: editable_scope.html
                    })

                    e.preventDefault() //prevent redirection in case of anchor tags

                    //on clicking the element, show a modal with text input

                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: $scope.$parent.core.partial('text-editing'),
                        controller: function($scope, $modalInstance) {
                            //initialize html, fontSize and fontColor models
                            $scope.html = editable_scope.html
                            $scope.fontSize = editable_scope.fontSize
                            $scope.fontColor = editable_scope.fontColor
                            $scope.backgroundColor = editable_scope.backgroundColor
                            $scope.backgroundImage = editable_scope.backgroundImage

                            if($element[0] && $element[0].src){
                                //image binding is delayed because it uses widget path as scope variable
                                $scope.image = $element[0].src
                            }else{
                                $scope.image = editable_scope.image
                            }
                            
                            $scope.attr = editable_scope.attr

                            $scope.ok = function() {
                                autience_track_event("editable-ok", {
                                    previous_val: editable_scope.html,
                                    new_val: $scope.html
                                })
                                $modalInstance.close($scope)
                            }

                            $scope.cancel = function() {
                                autience_track_event("editable-cancel", {
                                    previous_val: editable_scope.html
                                })

                                $modalInstance.dismiss('cancel')
                            }
                        },
                        size: 'md'
                    });

                    modalInstance.result.then(function(resolved) {

                        if (resolved.html && editable_scope.attr.html) {
                            $element.html(resolved.html)
                        }

                        if (resolved.fontSize && editable_scope.attr.fontSize) {
                            $element.css('font-size', resolved.fontSize + 'px')
                        }

                        if (resolved.fontColor && editable_scope.attr.fontColor) {
                            $element.css('color', resolved.fontColor)
                        }

                        if (resolved.backgroundColor && editable_scope.attr.backgroundColor) {
                            $element.css('background-color', resolved.backgroundColor)
                        }

                        if (resolved.image && editable_scope.attr.image) {
                            $element.attr('src', resolved.image)
                        }

                        if(resolved.backgroundImage && editable_scope.attr.backgroundImage){
                            $element.css('background','url('+resolved.backgroundImage+') no-repeat top left')
                            $element.css('background-size','cover')
                        }

                        saveCurrentTheme($scope.$parent, $base64)

                    })
                })
            }
        }
    })

function saveCurrentTheme(scope, base64Service) {
    //Encode the updated template and put it in the widget_template_field text box
    var current_theme = scope.settings.theme
        //console.log('container_id- '+container_id)
    if (document.getElementById(container_id)) {
        var updated_template = document.getElementById(container_id).outerHTML
            //console.log(updated_template)
        saveThemeTemplate(scope.settings.theme, updated_template, scope, base64Service)
    }

}

function saveThemeTemplate(theme, template, scope, base64Service) {
    console.log('saving template with length ' + template.length)

    scope.encodedTemplates[theme] = base64Service.encode(template)
    scope.themeTemplates[theme] = base64Service.decode(scope.encodedTemplates[theme])
    document.getElementById("widget_template_field").value = base64Service.encode(angular.toJson(scope.encodedTemplates))

    console.log('saved theme template')
}

function getEncodedThemeTemplates(base64Service) {
    var saved_encoded_templates = document.getElementById("widget_template_field").value
    var template_json = {}

    if (saved_encoded_templates) {
        template_json = angular.fromJson(base64Service.decode(saved_encoded_templates))
    }
    return template_json
}




angular.module("autienceAdmin")
    .directive('bindHtmlCompile', ['$compile', function($compile) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                scope.$watch(function() {
                    return scope.$eval(attrs.bindHtmlCompile);
                }, function(value) {
                    // Incase value is a TrustedValueHolderType, sometimes it
                    // needs to be explicitly called into a string in order to
                    // get the HTML string.
                    element.html(value && value.toString());
                    // If scope is provided use it, otherwise use parent scope
                    var compileScope = scope;
                    if (attrs.bindHtmlScope) {
                        compileScope = scope.$eval(attrs.bindHtmlScope);
                    }
                    $compile(element.contents())(compileScope);
                });
            }
        };
    }]);

angular.module("autienceAdmin")
    .directive('autoFocus', function($timeout) {
        return {
            restrict: 'AC',
            link: function(_scope, _element) {
                $timeout(function() {
                    _element[0].focus();
                }, 500);
            }
        };
    });

function autience_action_performed() {
    //dummy function

}

function get_show_list() {
    //merge post_list and page list
    //remove items that are already shown

    var show_list = []
    for (var i in post_list) {
        show_list.push(post_list[i])
    }

    for (var i in page_list) {
        show_list.push(page_list[i])
    }

    return show_list
}

function get_hide_list() {
    //merge post_list and page_list
    //remove items that are already hidden
    var hide_list = []

    for (var i in post_list) {
        hide_list.push(post_list[i])
    }

    for (var i in page_list) {
        hide_list.push(page_list[i])
    }

    return hide_list
}

var autience_tabs = {
    "list": [{
        "tag": "settings",
        "title": "Basic Settings",
        "icon": "cog"
    }, {
        "tag": "visitors",
        "title": "Visitors",
        "icon": "user"
    }, {
        "tag": "smart",
        "title": "Smart Settings",
        "icon": "record"
    }, {
        "tag": "extensions",
        "title": "Smart Extensions",
        "icon": "plus"
    }, {
        "tag": "license",
        "title": "License",
        "icon": "flash"
    }],
    "current": "settings"
}