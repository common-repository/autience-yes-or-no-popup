var autience_dont_show_check_html = '<div id="autience-hide-forever"> <label class="autience-checkbox-label"><input type="checkbox" id="autience-hide-forever-check"><span id="autience-hide-forever-text"> </span> </label></div>'


if (Autience) {

    //1. Add code to display the checkbox below the popup
    //Push this to render lifecycle

    Autience.lifecycle.render.push(function() {
        if (Autience.utils.smartSetting('dontShowAgainCheck', 'enable')) {
            var current_inner = document.getElementById('autience-layout-container').innerHTML
            document.getElementById('autience-layout-container').innerHTML = current_inner + autience_dont_show_check_html;
            document.getElementById('autience-hide-forever').style.display = 'block'
            document.getElementById('autience-hide-forever-text').innerHTML = autience_settings.smart.dontShowAgainCheck.text
        }
    })

    //2. After closing the popup, if the checkbox was selected, save a cookie
    Autience.lifecycle.afterClose.push(function() {
        if (Autience.utils.smartSetting('dontShowAgainCheck', 'enable')) {
            //if checkbox selected, create a cookie to remember the visitor request
            var is_checked = document.getElementById('autience-hide-forever-check').checked

            if (is_checked) {
                Autience.utils.createCookie('autience-hide-forever-' + autience_widget, 'checked')
            }
        }
    })

    //3. Add a condition in the validators to see if the cookie exists
    Autience.lifecycle.displayValidation.push(function() {
        if (Autience.utils.smartSetting('dontShowAgainCheck', 'ignore')) {
            if (Autience.utils.readCookie('autience-hide-forever-' + autience_widget)) {
                console.log('This user has selected never show again')
                return false
            }
        }

        return true
    })

}