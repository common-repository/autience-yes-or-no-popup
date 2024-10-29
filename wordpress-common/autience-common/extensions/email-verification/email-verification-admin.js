angular.module("autienceAdmin")
    .controller("emailVerificationController", ['$scope', '$base64', '$http', '$modal',
        function($scope, $base64, $http, $modal) {
            $scope.emailVerificationFields = [{
                "key": "enable",
                "type": "radio",
                "defaultValue": true,
                "templateOptions": {
                    "label": "Enable Email Verification extension",
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
                "key": "senderemail",
                "type": "input",
                "templateOptions": {
                    "type": "email",
                    "label": "Enter Sender's email (this will appear in subscriber's inbox)"
                },
                "hideExpression": "(model.enable != 'true')"
            }]

        }
    ])