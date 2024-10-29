angular.module("autienceAdmin")
    .controller("mailchimpController", ['$scope', '$base64', '$http', '$modal',
        function($scope, $base64, $http, $modal) {
            $scope.mailchimpFields = [{
                "key": "enable",
                "type": "radio",
                "defaultValue": true,
                "templateOptions": {
                    "label": "Enable Mailchimp extension",
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
                "key": "mailchimpformcode",
                "type": "input",
                "templateOptions": {
                    "type": "text",
                    "label": "Enter your Mailchimp form code"
                },
                "hideExpression": "(model.enable != 'true')"
            }]

        }
    ])