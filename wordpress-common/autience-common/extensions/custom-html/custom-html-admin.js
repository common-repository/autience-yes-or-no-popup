angular.module("autienceAdmin")
    .controller("customHtmlController", ['$scope', '$base64', '$http', '$modal',
        function($scope, $base64, $http, $modal) {
            $scope.customHtmlFields = [{
                "key": "enable",
                "type": "radio",
                "defaultValue": true,
                "templateOptions": {
                    "label": "Enable custom html extension",
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
                "key": "text",
                "type": "textarea",
                "templateOptions": {
                    "rows": "10",
                    "label": "Enter the custom html content to display on popup"
                },
                "hideExpression": "(model.enable != 'true')"
            }]

        }
    ])