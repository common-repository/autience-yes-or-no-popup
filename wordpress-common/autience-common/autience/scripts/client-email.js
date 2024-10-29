function autience_bind_email_subscription() {
    console.log('inside autience_bind_email_subscription')
    if (document.getElementById('autience-email-button')) {

        autience_listen(document.getElementById('autience-email-button'), 'click', function() {
            validateNameAndEmail(autience_save_subscriber);
        })

    }
}

function validateNameAndEmail(cb) {
    //return error message if any
    var name = document.getElementById('autience-name-input').value
    var email = document.getElementById('autience-email-input').value

    name = name.trim()
    email = email.trim()

    if (validateName(name)) {
        console.log('name valid')
        if (validateEmail(email)) {

            cb(name, email)

        } else {
            document.getElementById('autience-email-error').innerHTML = "Please check the entered email address"
        }
    } else {
        document.getElementById('autience-email-error').innerHTML = "Please check the entered name"
    }
}

function autience_show_thankyou() {
    var autience_thankyou_message = null
    if (autience_settings && autience_settings.specific) {
        autience_thankyou_message = autience_settings.specific.thankyou
    }

    document.getElementById('autience-email-wrapper').style.display = 'none'
    document.getElementById('autience-thankyou-wrapper').style.display = 'block'

    document.getElementById('autience-thankyou-wrapper').innerHTML = autience_thankyou_message
}

function autience_show_duplication_error() {
    document.getElementById('autience-email-error').style.display = 'block'
    document.getElementById('autience-email-error').innerHTML = "Hey.. looks like you are already subscribed with us"
}

function autience_error() {

}


function validateName(name) {
    if (!name || name.length < 2) {
        return false
    }
    console.log('testing if ' + name + ' is a valid name')
    var r_name = new RegExp(/^[a-zA-Z. ]+$/);
    return r_name.test(name)
}

function validateEmail(email) {
    if (!email || email.length < 2) {
        return false
    }
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
    return re.test(email);
}

function autience_save_subscriber(name, email) {
    var path = window.location.pathname + window.location.search
    var encoded = Base64.encode(JSON.stringify({
        name: name,
        email: email,
        path: path,
        categories: autience_categories
    }))

    Autience.utils.ajax.request(autience_path + '/php/subscribe.php?code=' + encoded, 'GET', null, function(res) {
        console.log('response - ' + res)
        if (res == 1) {
            //successful registration
            autience_action_performed()
            autience_show_thankyou()
        }
        if (res == 2) {
            //duplicate email
            console.log('duplicate')
            autience_show_duplication_error()
        }
    }, function() {
        autience_hide_popup()
    })
}