angular.module("autienceAdmin")
    .controller("advancedTriggersController", ['$scope', '$base64', '$http', '$modal',
        function($scope, $base64, $http, $modal) {
            $scope.advancedTriggersFields = [{
                "key": "enable",
                "type": "radio",
                "defaultValue": true,
                "templateOptions": {
                    "label": "Enable Advanced Triggers extension",
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
                "key": "option",
                "type": "radio",
                "templateOptions": {
                    "label": "The user should be shown a popup after",
                    "options": [{
                        "name": "Reading a percent of the post",
                        "value": "choosepercent"
                    },{
                        "name": "On clicking a link",
                        "value": "chooselink"
                    }]
                },
                "hideExpression": "(model.enable != 'true')"
            }, {
                "key": "percent",
                "type": "input",
                "templateOptions": {
                    "type": "number",
                    "label": "Enter the percent of post, after which the user is to be shown a popup"
                    },
                    "hideExpression": "(model.option != 'choosepercent')"
            }, {
                "key": "showonlink",
                "type": "radio",
                "templateOptions": {
                    "label": "Show a popup when the user",
                    "options": [{
                        "name": "Clicks on a link",
                        "value": "alink"                        
                    }, {
                        "name": "Cliks on any link",
                        "value": "anylink"
                    }, {
                        "name": "Clicks on an external link",
                        "value": "externallink"
                    }
                    ]
                },
                    "hideExpression": "(model.option != 'chooselink')"
            }, {
                "key": "message",
                "type": "input",
                "templateOptions": {
                    "type": "text",
                    "label": "Enter the message for redirect link on popup",
                    "defaultValue": "No, Thanks. I’ll be on my way"
                },
                "hideExpression": "(model.enable != 'true')"
            }]

        }
    ])