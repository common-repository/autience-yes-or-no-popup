angular.module("autienceAdmin")
    .controller("closeOnClickingOutsideController", ['$scope', '$base64', '$http',
        function($scope, $base64, $http) {

            $scope.closeOnClickingOutsideFields = [{
                "key": "enable",
                "type": "input",
                "defaultValue": false,
                "templateOptions": {
                    "type": "checkbox",
                    "label": "Enable this extension",
                    "description": "On enabling this extension, the popup will close when a visitor clicks anywhere outside the popup"
                }
            }]
        }
    ])