//Send an alias event based on the domain name

var host_name = window.location.host

if (is_mixpanel_defined()) {
    setTimeout(function() {

        if (typeof mixpanel != 'undefined') {
            if (host_name.indexOf('localhost') < 0 && host_name.indexOf('.') > 0) {

                //mixpanel.identify(host_name)
                host_name = host_name.replace('www.', '');

                mixpanel.alias(host_name)
                mixpanel.people.set({
                    $first_name: host_name
                })
            }
        }
    }, 3000)
}


function autience_track_event(event_name, data) {
    var event_id = event_name + '-' + plugin_name

    if (is_mixpanel_defined()) {
        mixpanel.track(event_id, data)
    }
}

function is_mixpanel_defined() {
    return (typeof mixpanel !== 'undefined')
}