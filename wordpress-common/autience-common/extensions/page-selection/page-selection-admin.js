angular.module("autienceAdmin")
    .controller("pageSelectionController", ['$scope', '$base64', '$http','$modal',
        function($scope, $base64, $http,$modal) {

            if(!$scope.smart.pageSelection){
                $scope.smart.pageSelection = {
                    show:[],
                    hide:[]
                }
            }
            
            $scope.shown_hidden_pages = {
                show: get_published($scope.smart.pageSelection.show),
                hide: get_published($scope.smart.pageSelection.hide)
            }

            //watch postToShow and postToHide and add it to the required row
            $scope.selectionChanged = function(selectedPost) {
                console.log(selectedPost)

                if (!$scope.smart.pageSelection[$scope.smart.pageSelection.specific]) {
                    $scope.smart.pageSelection[$scope.smart.pageSelection.specific] = []
                }

                selectedPost.originalObject.post_title = encodeURIComponent(selectedPost.originalObject.post_title)

                insertIntoArray($scope.smart.pageSelection[$scope.smart.pageSelection.specific], selectedPost.originalObject)

                removeItemFromArray($scope.shown_hidden_pages[$scope.smart.pageSelection.specific], selectedPost.originalObject)
                $scope.selectedPost = selectedPost.originalObject
            }

            $scope.selectionEntering = function(text) {
                console.log('object is made null ' + text)
                $scope.selectedPost = null
            }

            $scope.decode = decodeURIComponent

            $scope.editList = function(current) {
                $modal.open({
                    animation: true,
                    templateUrl: 'selectionList.html',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {
                        $scope.ok = function() {
                            $modalInstance.close()
                        }
                    },
                    size: 'md',
                    resolve: {
                        inner: function() {
                            return $scope.inner;
                        }
                    }
                });
            }

            $scope.removeFromList = function(list, item) {
                removeItemFromArray($scope.smart.pageSelection[list], item)
                insertIntoArray($scope.shown_hidden_pages[$scope.smart.pageSelection.specific], item)
            }

            function removeItemFromArray(array, item) {
                var index = array.indexOf(item);
                if (index >= 0) {
                    array.splice(index, 1)
                }
            }

            function insertIntoArray(array, item) {
                array.push(item)
            }

            $scope.targetFields = [{
                "key": "home",
                "type": "input",
                "defaultValue": true,
                "templateOptions": {
                    "type": "checkbox",
                    "label": "Show on the Home Page"
                }
            }, {
                "key": "mode",
                "type": "radio",
                "templateOptions": {
                    "label": "Where should the widget show up?",
                    "options": [{
                        "name": "Don't show on any other pages",
                        "value": "none"
                    },{
                        "name": "Show on all other pages",
                        "value": "all"
                    }, {
                        "name": "Show on all Posts",
                        "value": "posts"
                    }, {
                        "name": "Show on all Pages",
                        "value": "pages"
                    }, {
                        "name": "Show on all product pages (for ecommerce themes)",
                        "value": "products"
                    }, {
                        "name": "Specific Pages or Posts",
                        "value": "specific"
                    }],
                    "required": true
                }
            }, {
                "key": "specific",
                "type": "radio",
                "templateOptions": {
                    "label": "Show or Hide?",
                    "options": [{
                        "name": "Show only on selected posts and pages",
                        "value": "show"
                    }, {
                        "name": "Hide on selected posts and pages (show on others)",
                        "value": "hide"
                    }],
                    "required": true
                },
                "hideExpression": "(model.mode != 'specific')"
            }]
        }
    ])