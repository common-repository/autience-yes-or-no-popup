angular.module("autienceAdmin")
    .controller("settingsController", ['$scope', '$http', '$base64', '$sce', '$timeout', '$modal', 'uiGridConstants',
        function($scope, $http, $base64, $sce, $timeout, $modal, uiGridConstants) {
            //1. load scope variables from saved option variables

            $scope.widgetActive = true //autience_widget_active
            $scope.forms = {}
            $scope.loaded = false
            $scope.common_path = common_path;
            $scope.theme = {}
            $scope.reset = false
            $scope.autience_label = autience_label
            $scope.autience_listed = autience_listed


            var sections = ['display', 'settings', 'enable']
            $scope.currentSection = {}
            $scope.closeOthers = true

            //2. load specific and general config on to the scope
            $scope.pluginConfig = specific_config_json
            $scope.widgetFields = $scope.pluginConfig.fields
            $scope.widgetDetails = $scope.pluginConfig.widget
            $scope.themes = $scope.pluginConfig.themes

            $scope.loaded = true

            if ($scope.pluginConfig.type == 'widget') {
                $scope.displayIndex = 1
                    //$scope.currentSection.display = true
                    //if the plugin is a widget, get general widget settings
                $scope.general = general_config_json.fields
            } else {
                $scope.displayIndex = 0
                $scope.currentSection.settings = true
            }

            $scope.settingsIndex = $scope.displayIndex + 1
            $scope.enableIndex = $scope.settingsIndex + 1


            //3. Watch for scope variable changes and save them to the options text boxes
            var status_changed = false
            $scope.$watch('settings.active', function() {

                document.getElementById('widget_active_field').checked = $scope.settings.active
            })

            $scope.statusChanged = function() {
                status_changed = true
            }

            //5. define variables and functions that can be used within the templates

            $scope.widget_path = widget_path

            /*
            $scope.layoutTemplateUrl = function(layout) {
                return widget_path + '/layouts/' + layout + '/' + layout + '-template.html'
            }
            */

            $scope.themeTemplateUrl = function(theme) {
                return widget_path + '/themes/' + theme + '/' + theme + '-template.html'
            }

            $scope.themeStyleUrl = function(theme) {
                return widget_path + '/themes/' + theme + '/' + theme + '-style.css'
            }

            $scope.imagePath = function() {
                return widget_path + '/themes/' + $scope.settings.theme + '/images'
            }

            $scope.themeName = function(theme) {
                //iterate throught settings json and get name of current selected theme
                return getTheme(theme).title
            }

            //6. Retrieved saved templates
            $scope.encodedTemplates = getEncodedThemeTemplates($base64)
                //console.log('encodedTemplate- ')
                //console.log($scope.encodedTemplates)


            $scope.themeTemplates = {}
            for (var key in $scope.encodedTemplates) {
                $scope.themeTemplates[key] = $base64.decode($scope.encodedTemplates[key])
            }

            $scope.themeTemplate = function(layout) {
                return $sce.trustAsHtml($base64.decode($scope.encodedTemplates[layout]))
            }

            $scope.themeClass = function(theme) {
                return 'autience-theme-' + theme
            }

            $scope.currentStatus = function() {
                if (!status_changed) {
                    previous_state = $scope.settings.active
                }
                if (previous_state) {
                    return ("(currently enabled)")
                } else {
                    return ("(currently disabled)")
                }

                console.log('status changed- ' + status_changed)
            }

            $scope.core.setupValid = function() {
                //returns true if all the settings are valid
                //if it is a widget, see that the template has been selected
                if ($scope.reset) {
                    return true
                }
                if ($scope.forms && $scope.forms.pageSelection && $scope.forms.pageSelection.$invalid) {
                    return false
                }

                if (!$scope.pluginConfig || !$scope.forms || !$scope.forms.specific) {
                    return false
                }

                if ($scope.forms.specific.$invalid) {
                    return false
                }

                var is_widget = ($scope.pluginConfig.type == 'widget')

                if (is_widget) {
                    if (!$scope.core.licenseFetched) {
                        if (!$scope.forms.general) {
                            return false
                        }
                        if ($scope.forms.general.$invalid || !$scope.encodedTemplates[$scope.settings.theme]) {

                            return false
                        }
                    }


                }

                return true
            }


            $scope.$watch("settings.specific", function(newValue, oldValue) {
                if (newValue && oldValue) {
                    //template changes take some time, to wait for a while
                    $timeout(function() {
                        saveCurrentTheme($scope, $base64)
                    }, 500)

                }
            }, true)

            $scope.invalidTemplate = function() {
                if ($scope.pluginConfig.type == 'widget') {
                    if ($scope.encodedTemplates && $scope.encodedTemplates[$scope.settings.theme]) {
                        return false
                    }
                    return true
                }

                return false
            }

            $scope.useTheme = function(theme) {
                $scope.settings.theme = theme
                $timeout(function() {
                    //save the current theme
                    saveCurrentTheme($scope, $base64)
                }, 1000)

                //assign layout based on the theme
                $scope.settings.layout = getTheme(theme).layout

                console.log('Assigning layout- ' + $scope.settings.layout)
            }

            if ($scope.themes.length == 1) {
                //$scope.settings.theme = $scope.themes[0].tag
                $scope.useTheme($scope.themes[0].tag)
            }

            $scope.resetTheme = function(theme) {
                document.getElementById("widget_template_field").value = ''

                $scope.reset = true
            }

            function getTheme(theme) {
                for (var i in $scope.themes) {
                    if ($scope.themes[i].tag == theme) {
                        return $scope.themes[i]
                    }
                }
            }

        }
    ])