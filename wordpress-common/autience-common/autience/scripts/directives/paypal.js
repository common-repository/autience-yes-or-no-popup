angular.module("autienceAdmin")
    .directive("paypal", function() {

        return {
            restrict: 'E',
            templateUrl: common_path + '/partials/paypal.html',
            scope: {
                buttonId: '@',
                price: '=',
                productId: '=',
                featureId: '='
            },
            controller: function($scope, $element, $modal, $base64) {

                $scope.encodedInfo = function(email, domain) {
                    //console.log('computing for email - ' + email)

                    //remove http and www. from domain
                    if (domain) {
                        domain = domain.replace('http://', '')
                        domain = domain.replace('www.', '')
                    }

                    var encoded =  $base64.encode(angular.toJson({
                        email: email,
                        domain: domain,
                        productId: $scope.productId,
                        featureId:$scope.featureId
                    }))

                    //console.log('encoded')
                   // console.log(encoded)
                    
                    return encoded
                }

                $scope.validInputs = function(email, domain) {
                    //check number of 

                    if (email && domain) {
                        //check that domain has one or more .
                        if (domain.split('.').length > 1) {
                            return true
                        }
                    }

                    return false
                }

                $scope.inputError = function(email, domain) {
                    if (!email && !domain) {
                        return null
                    }

                    if (!validateEmail(email)) {
                        return 'Enter a valid email address'
                    }
                    if (!domain || domain.split('.').length < 2) {
                        return 'Enter a valid domain name (without www prefix)'
                    }
                }

                function validateEmail(email) {
                    if (!email || email.length < 2) {
                        return false
                    }
                    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                    return re.test(email);
                }

            }
        }
    })