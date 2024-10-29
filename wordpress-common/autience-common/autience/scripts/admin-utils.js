angular.module("autienceAdmin", ["ui.bootstrap", "ngAnimate", "base64", "formly", "formlyBootstrap", "toggle-switch", "angucomplete-alt", "ui.grid", "ui.grid.pagination", "color.picker"]) //"formly", "formlyBootstrap",

function saveCurrentTheme(scope, base64Service) {
    //Encode the updated template and put it in the widget_template_field text box
    var current_theme = scope.settings.theme
        
    if (document.getElementById(container_id)) {
        var updated_template = document.getElementById(container_id).outerHTML
        
        saveThemeTemplate(scope.settings.theme, updated_template, scope, base64Service)
    }

}

function saveThemeTemplate(theme, template, scope, base64Service) {

    if(template){
        scope.encodedTemplates[theme] = base64Service.encode(template)

        scope.themeTemplates[theme] = base64Service.decode(scope.encodedTemplates[theme])
    }else{
        delete scope.encodedTemplates[theme]
        delete scope.themeTemplates[theme]
    }
    

    document.getElementById("widget_template_field").value = base64Service.encode(angular.toJson(scope.encodedTemplates))

    console.log('saved theme template')
}

function getEncodedThemeTemplates(base64Service) {
    var saved_encoded_templates = document.getElementById("widget_template_field").value
    var template_json = {}

    if (saved_encoded_templates) {
        template_json = angular.fromJson(base64Service.decode(saved_encoded_templates))
    }
    return template_json
}


function autience_action_performed() {
    //dummy function
    
}

function get_published(exclude, type) {
    //merge post_list and page list
    //remove items that are already shown
    var show_list = []
    
    if(!type || type == 'post'){
        include_and_exclude(show_list, post_list)
    }
    
    if(!type || type == 'page'){
        include_and_exclude(show_list, page_list)
    }
    

    return show_list

    function include_and_exclude(arr, include){
        if(include){
            include.forEach(function(item){
                if(to_include(item)){
                    arr.push(item)
                }
            })
        }
    }

    function to_include(item){
        for(var i in exclude){
            if(item.ID == exclude[i].ID){
                return false
            }
        }
        return true
    }
}

var autience_tabs = {
    "list": [{
        "tag": "settings",
        "title": "Basic Settings",
        "icon": "cog"
    }, {
        "tag": "visitors",
        "title": "Visitors",
        "icon": "user"
    }, {
        "tag": "smart",
        "title": "Smart Settings",
        "icon": "record"
    }, {
        "tag": "extensions",
        "title": "Smart Extensions",
        "icon": "plus"
    }, {
        "tag": "license",
        "title": "License",
        "icon": "flash"
    }],
    "current": "settings"
}