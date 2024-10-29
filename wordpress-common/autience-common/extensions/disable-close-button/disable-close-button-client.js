if(Autience){
	Autience.lifecycle.postRender.push(function(){

		if(Autience.utils.smartSetting('disableCloseButton','disable')){
			document.getElementById('autience-close-button').style.display='none'
		}	
	})
}