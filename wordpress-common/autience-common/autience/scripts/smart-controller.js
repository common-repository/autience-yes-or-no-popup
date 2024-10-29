angular.module("autienceAdmin")
    .controller("smartController", ['$scope', '$modal',
        function($scope, $modal) {


            $scope.closeOthers = true

            $scope.openExtension = {}
                /*Functions for Targeting*/

            
            $scope.extensionPartial = function(feature_id, is_specific) {
                //remove product id from feature id
                if (!is_specific) {
                    is_specific = false
                }

                var feature_partial = feature_id.replace('-' + plugin_name, '')

                if (is_specific) {
                    return widget_path + '/extensions/' + feature_partial + '/' + feature_partial + '-partial.html'
                } else {
                    return common_path + '/../extensions/' + feature_partial + '/' + feature_partial + '-partial.html'
                }

            }

            function toTitleCase(str) {
                return str.replace(/\w\S*/g, function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
            }

            $scope.validFeature = function() {
                //check that this exists in the list of features received from server

            }

            $scope.$watch('openExtension', function(newValue, oldValue) {
                if (newValue && !isEmpty(newValue)) {
                    $scope.openedSomething = true
                }
            }, true)

            function isEmpty(obj) {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop))
                        return false;
                }

                return true;
            }

            $scope.validExtension = function(feature_id) {

                if ($scope.core && $scope.core.autience_premium) {
                    for (var i in $scope.core.autience_premium) {
                        if ($scope.core.autience_premium[i].id == feature_id) {
                            return true
                        }
                    }
                }
                return false
            }
        }
    ])