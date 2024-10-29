angular.module("autienceAdmin")
    .controller("visitorsController", ['$scope', '$http','uiGridConstants',
        function($scope, $http, uiGridConstants) {
            
            console.log('inside visitors-controller.js');
            
            var paginationOptions = {
                pageNumber: 1,
                pageSize: 10,
                sort: null
            };

            $scope.gridOptions = {
                paginationPageSizes: [10, 25, 50],
                paginationPageSize: 10,
                useExternalPagination: true,
                useExternalSorting: true,
                columnDefs: [{
                    name:'time',
                    enableSorting: false
                },{
                    name: 'name',
                    enableSorting: false
                }, {
                    name: 'email',
                    enableSorting: false
                }, {
                    name: 'url',
                    enableSorting: false
                },{
                    name:'id',
                    enableSorting:false
                }],
                onRegisterApi: function(gridApi) {

                    console.log(gridApi)

                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                        if (sortColumns.length == 0) {
                            paginationOptions.sort = null;
                        } else {
                            paginationOptions.sort = sortColumns[0].sort.direction;
                        }
                        getPage();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                        paginationOptions.pageNumber = newPage;
                        paginationOptions.pageSize = pageSize;
                        getPage();
                    });
                }
            };

            var getPage = function() {
                var url;
                console.log(paginationOptions)

                switch (paginationOptions.sort) {
                    case uiGridConstants.ASC:
                        url = widget_path+'/php/subscribe.php?limit='+paginationOptions.pageSize+'&offset='+(paginationOptions.pageNumber-1)*paginationOptions.pageSize;
                        break;
                    case uiGridConstants.DESC:
                        url = widget_path+'/php/subscribe.php?limit='+paginationOptions.pageSize+'&offset='+(paginationOptions.pageNumber-1)*paginationOptions.pageSize;
                        break;
                    default:
                        url = widget_path+'/php/subscribe.php?limit='+paginationOptions.pageSize+'&offset='+(paginationOptions.pageNumber-1)*paginationOptions.pageSize;
                        break;
                }

                $http.get(url)
                    .success(function(data) {
                        $scope.gridOptions.totalItems = 100;
                        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
                        $scope.gridOptions.data = data.slice(firstRow, firstRow + paginationOptions.pageSize);
                    });
            };

            getPage();
        }
    ])
