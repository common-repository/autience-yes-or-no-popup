angular.module("autienceAdmin")
    .controller("advancedTriggersForMobileController", ['$scope', '$base64', '$http', '$modal',
        function($scope, $base64, $http, $modal) {
            $scope.advancedTriggersForMobileFields = [{
                "key": "enable",
                "type": "radio",
                "defaultValue": true,
                "templateOptions": {
                    "label": "Enable Advanced Triggers for Mobile extension",
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
                "key": "tablet",
                "type": "radio",
                "templateOptions": {
                    "label": "Triggers for tablet screen",
                    "options": [{
                        "name": "Show popup on page load",
                        "value": "choosetabletpageload"
                    }, {
                        "name": "Show popup after delay",
                        "value": "choosetabletdelay"
                    }]
                },
                "hideExpression": "(model.enable != 'true')"
            }, {
                "key": "tabletdelay",
                "type": "input",
                "templateOptions": {
                    "type": "number",
                    "label": "Amount of delay, after which the user is to be shown a popup"
                },
                "hideExpression": "(model.tablet != 'choosetabletdelay')"
            }, {
                "key": "mobile",
                "type": "radio",
                "templateOptions": {
                    "label": "Triggers for mobile screen",
                    "options": [{
                        "name": "Show popup on page load",
                        "value": "choosemobilepageload"
                    }, {
                        "name": "Show popup after delay",
                        "value": "choosemobiledelay"
                    }]
                },
                "hideExpression": "(model.enable != 'true')"
            }, {
                "key": "mobiledelay",
                "type": "input",
                "templateOptions": {
                    "type": "number",
                    "label": "Amount of delay, after which the user is to be shown a popup"
                },
                "hideExpression": "(model.mobile != 'choosemobiledelay')"
            }]

        }
    ])