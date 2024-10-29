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
                    image = null,
                    backgroundImage = null

                if (el[0]) {
                    //console.log('element')
                    //console.log(el[0].style)
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

                if (backgroundImage && backgroundImage.length > 0) {
                    backgroundImage = backgroundImage.replace('url(', '')
                    backgroundImage = backgroundImage.replace(')', '')
                    scope.backgroundImage = backgroundImage
                } else {
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

                            if ($element[0] && $element[0].src) {
                                //image binding is delayed because it uses widget path as scope variable
                                $scope.image = $element[0].src
                            } else {
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

                        if (resolved.backgroundImage && editable_scope.attr.backgroundImage) {
                            $element.css('background', 'url(' + resolved.backgroundImage + ') no-repeat top left')
                            $element.css('background-size', 'cover')
                        }

                        saveCurrentTheme($scope.$parent, $base64)

                    })
                })
            }
        }
    })