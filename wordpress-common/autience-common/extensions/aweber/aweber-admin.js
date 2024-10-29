angular.module("autienceAdmin")
    .controller("aweberController", ['$scope', '$base64', '$http', '$modal',
        function($scope, $base64, $http, $modal) {
            $scope.aweberFields = [{
                "key": "enable",
                "type": "radio",
                "defaultValue": true,
                "templateOptions": {
                    "label": "Enable aweber extension",
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
                "key": "awebercode",
                "type": "input",
                "templateOptions": {
                    "type": "text",
                    "label": "Enter your aweber code"
                },
                "hideExpression": "(model.enable != 'true')"
            }]

        }
    ])