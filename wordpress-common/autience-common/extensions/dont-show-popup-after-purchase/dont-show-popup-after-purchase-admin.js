angular.module("autienceAdmin")
    .controller("dontShowPopupAfterPurchaseController", ['$scope', '$base64', '$http', '$modal',
        function($scope, $base64, $http, $modal) {
            $scope.dontShowPopupAfterPurchaseFields = [{
                "key": "enable",
                "type": "radio",
                "defaultValue": true,
                "templateOptions": {
                    "label": "Enable don't show popup after purchase extension",
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
                "type": "input",
                "templateOptions": {
                    "type": "url",
                    "label": "Enter Post Payment Page url"
                },
                "hideExpression": "(model.enable != 'true')"
            }]

        }
    ])