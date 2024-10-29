angular.module("autienceAdmin")
    .controller("extensionsController", ['$scope', '$base64','$http',
        function($scope, $base64,$http) {

            $scope.closeOthers = false
            $scope.extensionIsOpen = true

            $scope.extensionTitle = function(index, feature){
                if($scope.core.hasLicense(feature.id)){
                    return (index+1)+'.'+ feature.title
                }else{
                    return (index+1)+'.'+ feature.title + '  [ ' +feature.price +'$ ]'
                }
            }

            
        }
    ])