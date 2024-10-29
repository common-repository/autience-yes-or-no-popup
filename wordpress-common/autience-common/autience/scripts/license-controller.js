angular.module("autienceAdmin")
    .controller("licenseController", ['$scope', '$http', '$base64',
        function($scope, $http, $base64) {
            var license_base = "http://api.autience.com/api/Licenses/domain_licenses?token="

            $scope.activateLicense = function(token) {
                console.log('check for token ' + token)
                token = token.trim()

                var license_url = license_base + token


                $http.get(license_url)
                    .then(function(res) {
                        if (res.data.licenses) {
                            $scope.core.licenses = res.data.licenses.filter(function(l) {
                                return (l.productId == plugin_name)
                            })

                            attachDependencies($scope.core.licenses, $scope.core.autience_premium)

                            $scope.core.licenseFetched = true

                            //save the encoded licenses on the options field
                            var encoded_license = $base64.encode(angular.toJson($scope.core.licenses))

                            document.getElementById("widget_license_field").value = encoded_license
                        }

                    })
            }

            function attachDependencies(licenses, extensions) {
                console.log(licenses)
                console.log(extensions)
                for (var l in licenses) {
                    for (var e in extensions) {
                        if (licenses[l].featureId == extensions[e].id) {
                            licenses[l].adminDependencies = extensions[e].adminDependencies
                            licenses[l].clientDependencies = extensions[e].clientDependencies
                        }
                    }
                }
            }


        }
    ])