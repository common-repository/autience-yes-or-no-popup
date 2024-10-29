if(Autience){
	Autience.lifecycle.displayValidation.unshift(function(){
		if(Autience.utils.smartSetting('hideAfterPurchase', 'enable')){
			var thankyouPage = Autience.utils.smartSetting('hideAfterPurchase','thankyouPage')
			var cookie_key = "autience_" + autience_widget+"_purchased"

			if(thankyouPage.ID == autience_post_id || thankyouPage.originalObject.ID == autience_post_id){
				Autience.utils.createCookie(cookie_key, "purchased")
				return false
			}else{				
				if(Autience.utils.readCookie(cookie_key)){
					return false	
				}else{
					return true
				}				
			}

		}

		return true
	})
}