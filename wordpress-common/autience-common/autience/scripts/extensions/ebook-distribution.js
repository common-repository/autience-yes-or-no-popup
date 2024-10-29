angular.module("autienceAdmin")
    .controller("ebookDistributionController", ['$scope', '$base64', '$http', '$modal',
        function($scope, $base64, $http, $modal) {
            $scope.ebookDistributionFields = [{
                "key": "enable",
                "type": "radio",
                "defaultValue": true,
                "templateOptions": {
                    "label": "Enable ebook Distribution extension",
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
                "key": "ebookurl",
                "type": "input",
                "templateOptions": {
                    "type": "url",
                    "label": "Enter your ebook url"
                },
                "hideExpression": "(model.enable != 'true')"
            }, {
                "key": "ebooksub",
                "type": "input",
                "templateOptions": {
                    "type": "text",
                    "label": "Enter the subject line for email"
                },
                "hideExpression": "(model.enable != 'true')"
            }, {
                "key": "ebookemail",
                "type": "textarea",
                "templateOptions": {
                    "rows": "10",
                    "label": "Enter the email content"
                },
                "hideExpression": "(model.enable != 'true')"
            }]

        }
    ])