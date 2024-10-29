angular.module("autienceAdmin")
    .controller("basicAnalyticsController", ['$scope', '$base64', '$http', '$modal',
        function($scope, $base64, $http, $modal) {
            $scope.basicAnalyticsFields = [{
                "key": "enable",
                "type": "radio",
                "defaultValue": true,
                "templateOptions": {
                    "label": "Enable Basic Analytics extension",
                    "options": [{
                        "name": "Yes",
                        "value": "true"
                    }, {
                        "name": "No",
                        "value": "false"
                    }],
                    "required": true
                }
            }, {
                "key": "googleUAcode",
                "type": "input",
                "templateOptions": {
                    "type": "text",
                    "label": "Enter your Google Analytics UA code"
                },
                "hideExpression": "(model.enable != 'true')"
            }]

        }
    ])