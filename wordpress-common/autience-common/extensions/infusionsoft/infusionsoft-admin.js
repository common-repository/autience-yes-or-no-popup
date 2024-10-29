angular.module("autienceAdmin")
    .controller("infusionsoftController", ['$scope', '$base64', '$http', '$modal',
        function($scope, $base64, $http, $modal) {
            $scope.infusionsoftFields = [{
                "key": "enable",
                "type": "radio",
                "defaultValue": true,
                "templateOptions": {
                    "label": "Enable Infusionsoft extension",
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
                "key": "infusionsoftcode",
                "type": "input",
                "templateOptions": {
                    "type": "text",
                    "label": "Enter your Infusionsoft code"
                },
                "hideExpression": "(model.enable != 'true')"
            }]

        }
    ])