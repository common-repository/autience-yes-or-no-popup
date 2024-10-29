angular.module("autienceAdmin")
    .controller("disableCloseButtonController", ['$scope', '$base64', '$http',
        function($scope, $base64, $http) {

            $scope.disableCloseButtonFields = [{
                "key": "disable",
                "type": "input",
                "defaultValue": false,
                "templateOptions": {
                    "type": "checkbox",
                    "label": "Disable the close button",
                    "description": "Selecting this will hide the close button on the top of the popup"
                }
            }]
        }
    ])