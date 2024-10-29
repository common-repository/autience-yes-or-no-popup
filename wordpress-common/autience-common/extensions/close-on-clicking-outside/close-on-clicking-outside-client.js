if (Autience) {
    Autience.lifecycle.postRender.push(function() {

        if (Autience.utils.smartSetting('closeOnClickingOutside','enable')) {
            var container_id = 'autience-' + autience_widget + '-container'
            var content_id = 'autience-' + autience_widget + '-block'

            Autience.utils.executeOnId(container_id, function(el) {
                Autience.utils.listen(el, 'click', function() {
                    Autience.utils.closeWidget()
                })
            })

            Autience.utils.executeOnId(content_id, function(el) {
                Autience.utils.listen(el, 'click', function(ev) {
                    ev.stopPropagation()
                })
            })
        }

    })
}