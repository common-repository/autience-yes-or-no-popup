angular.module("autienceAdmin")
    .controller("autienceAdminController", ['$scope', '$injector', '$base64', '$http',
        function($scope, $injector, $base64, $http) {
            $scope.show_visitors = specific_config_json.visitors
            $scope.tabs = autience_tabs //specific_config_json.tabs
            $scope.autience_label = autience_label

            $scope.track = function(event_name) {
                autience_track_event(event_name, {
                    settings: $scope.settings
                })
            }

            $scope.controllerFn = function(tag) {
                return $injector.get(tag + "Controller");

            }

            $scope.core = {}

            $scope.core.partial = function(name) {
                return common_path + '/partials/' + name + '.html'
            }

            $scope.ifelse = function(a, b, c) {
                if (a) {
                    return b
                } else {
                    return c
                }
            }

            $scope.ifThenElse = function(a, b, c, d) {
                if (a == b) {
                    return c
                } else {
                    return d
                }
            }

            $scope.showWhen = function(a) {
                if (a) {
                    return {}
                } else {
                    return {
                        display: 'none'
                    }
                }
            }

            if (autience_widget_settings && autience_widget_settings.length > 0) {
                $scope.settings = angular.fromJson($base64.decode(autience_widget_settings))
                $scope.current_state = $scope.settings.active
            } else {
                $scope.settings = {}
            }
            if (!$scope.settings.smart) {
                $scope.settings.smart = {}
            }


            if (!autience_listed) {
                $scope.settings.powered = true
            }

            $scope.$watch('settings', function() {
                document.getElementById('widget_settings_field').value = $base64.encode(angular.toJson($scope.settings))

            }, true)

            //Load licensed features TODO: this should come from a stored variable
            //var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjdXN0b21lcl9pZCI6IjU2M2RjMjc0ZjQ3YjI1MWMyYzdlMGQ0ZSIsImRvbWFpbiI6ImxldHNjcmVhdGVjcmFmdHMuY29tIiwiaWF0IjoxNDQ2ODg4MDUyfQ.Xit4bkWcdEH4QC4_me4daTAYDTYBR_RaCEBZvXlgpvc"
            $scope.core.licenses = []
            if (autience_license_encoded && autience_license_encoded.length > 1) {
                $scope.core.licenses = angular.fromJson($base64.decode(autience_license_encoded))
            }


            //get autience_premium from server
            $http.get('http://api.autience.com/api/Features?filter[where][productId]=' + plugin_name)
                .then(function(res) {
                    $scope.core.autience_premium = res.data

                    //if there are additional extensions defined in specific.json
                    //append to this array

                    if (specific_config_json && specific_config_json.extensions) {
                        specific_config_json.extensions.forEach(function(ext) {
                            $scope.core.autience_premium.push(ext)
                        })
                    }

                })


            $scope.core.extensionName = function(feature_id) {
                if ($scope.core && $scope.core.autience_premium) {
                    for (var i = 0; i < $scope.core.autience_premium.length; i++) {
                        if ($scope.core.autience_premium[i].id == feature_id) {
                            return $scope.core.autience_premium[i].title
                        }
                    }
                }
            }

            $scope.core.hasLicense = function(feature_id) {
                for (var i in $scope.core.licenses) {
                    if ($scope.core.licenses[i].featureId == feature_id) {

                        return true
                    }
                }

                //if this feature is defined in the local specific.json, consider it active
                /*
                if(specific_config_json && specific_config_json.extensions){
                    for(var i=0;i< specific_config_json.extensions.length;i++){
                        if(specific_config_json.extensions[i].id == feature_id){
                            return true
                        }
                    }
                }
                */
                if (specific_config_json.free_extensions.indexOf(feature_id) >= 0) {
                    return true
                }

                return false
            }

        }
    ])