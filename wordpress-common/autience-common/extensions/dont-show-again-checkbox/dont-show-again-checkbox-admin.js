angular.module("autienceAdmin")
    .controller("dontShowAgainCheckController", ['$scope', '$base64', '$http', '$modal',
        function($scope, $base64, $http, $modal) {
            $scope.dontShowAgainCheckFields = [{
                "key": "enable",
                "type": "input",
                "defaultValue": false,
                "templateOptions": {
                    "type": "checkbox",
                    "label": "Enable this Extension",
                    "description": "Enabling this adds a checkbox below the popup"
                }
            }, {
                "key": "ignore",
                "type": "input",
                "defaultValue": false,
                "templateOptions": {
                    "type": "checkbox",
                    "label": "Don't show popup to visitors who have selected the checkbox",
                    "description": "With this option selected, visitors who have selected the checkbox will not see the popup again."
                }
            }, {
                "key": "text",
                "type": "input",
                "defaultValue": "Don't show this again",
                "templateOptions": {
                    "label": "Message beside the checkbox"
                }
            }]

        }
    ])