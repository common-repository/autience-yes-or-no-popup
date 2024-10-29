angular.module("autienceAdmin")
    .controller("hideAfterPurchaseController", ['$scope', '$base64', '$http', '$modal',
        function($scope, $base64, $http, $modal) {

            $scope.hideAfterPurchaseFields = [{
                "key": "enable",
                "type": "input",
                "defaultValue": false,
                "templateOptions": {
                    "type": "checkbox",
                    "label": "Enable this Extension",
                    "description": "Enabling this will hide the popup for visitors who have made a purchase. You will need to specify a post-payment page where a visitor is redirected after payment"
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

            $scope.core.publishedPages = get_published([], 'page')

            $scope.core.thankyouSelected = function(selected_page){
                console.log('selected page')
                console.log(selected_page)
                $scope.smart.hideAfterPurchase.thankyouPage = selected_page
            }
        }
    ])