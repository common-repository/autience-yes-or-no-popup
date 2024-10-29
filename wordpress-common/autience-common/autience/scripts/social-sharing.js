var autience_social_links = {
    facebook: {
        link: 'https://www.facebook.com/sharer/sharer.php',
        param: 'u'
    },
    twitter: {
        link: 'https://twitter.com/intent/tweet',
        param: 'url'
    },
    google: {
        link: 'https://plus.google.com/share',
        param: 'url'
    },
    pinterest: {
        link: 'http://pinterest.com/pin/create/link',
        param: 'url'
    }
}

function autienceSocialInit() {
    for (var network in autience_social_links) {
        bindAutienceShare(network, 'autience-share-on-' + network, autience_social_links[network].link, autience_social_links[network].param)
    }
}

function bindAutienceShare(network, button_id, share_link, share_param) {

    var Config = {
        Link: "a.share",
        Width: 500,
        Height: 500
    }
    var encoded_url = encodeURIComponent(window.location)

    autience_listen(document.getElementById(button_id), 'click', PopupHandler)

    function PopupHandler(e) {
        console.log('clicked on '+network)
        e = (e ? e : window.event);
        var t = (e.target ? e.target : e.srcElement);

        // popup position
        var
            px = Math.floor(((screen.availWidth || 1024) - Config.Width) / 2),
            py = Math.floor(((screen.availHeight || 700) - Config.Height) / 2);

        // open popup
        var popup = window.open(share_link+'?'+share_param+'='+encoded_url, "social",
            "width=" + Config.Width + ",height=" + Config.Height +
            ",left=" + px + ",top=" + py +
            ",location=0,menubar=0,toolbar=0,status=0,scrollbars=1,resizable=1");
        if (popup) {
            popup.focus();
            if (e.preventDefault) e.preventDefault();
            e.returnValue = false;
        }

        return !!popup;
    }
}