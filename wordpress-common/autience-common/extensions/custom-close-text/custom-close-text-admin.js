angular.module("autienceAdmin")
    .controller("customCloseTextController", ['$scope', '$base64', '$http', '$modal',
        function($scope, $base64, $http, $modal) {
            $scope.customCloseTextFields = [{
                "key": "close",
                "type": "radio",
                "defaultValue": false,
                "templateOptions": {
                   "label": "Enable close text extension",
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
                "defaultValue": "Click here to close",
                "templateOptions": {
                    "type": "text",
                    "label": "Text which closes"
                },
                "hideExpression": "(model.close != 'true')"
            }, {
                "key": "onClickAction",
                "type": "radio",
                "templateOptions": {
                    "label": "What should the close text do when clicked?",
                    "options": [{
                        "name": "Redirect to another page",
                        "value": "redirect"
                    }, {
                        "name": "Close the popup",
                        "value": "close"
                    }],
                    "required": true
                },
                "hideExpression": "(model.close != 'true')"

            }, {
                "hideExpression": "(model.close != 'true')",
                "key": "redirect",
                "type": "input",
                "templateOptions": {
                    "type": "url",
                    "label": "Redirect the user to the link after closing the text"
                },
                "hideExpression": "(model.onClickAction != 'redirect')",
                


            },
            {
                "key": "color",
                "type": "input",
                "defaultValue": "gray",
                "templateOptions": {
                    "type": "text",
                    "label": "Color of the text"
                },
                "hideExpression": "(model.close != 'true')"
            }, {
                "key": "underline",
                "type": "checkbox",
                "defaultValue": "true",
                "templateOptions": {
                    "type": "checkbox",
                    "label": "Underline"
                },
                "hideExpression": "(model.close != 'true')"
            }, {
                "key": "size",
                "type": "input",
                "defaultValue": "12",
                "templateOptions": {
                    "type": "number",
                    "label": "Size of the text"
                },
                "hideExpression": "(model.close != 'true')"





            }]

        }
    ])