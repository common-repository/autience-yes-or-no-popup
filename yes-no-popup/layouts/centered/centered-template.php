<div class="autience-content-bound" id="autience-yes-no-popup-content">
	<div class="autience-yn-wrapper">
		<div id="autience-close-button" class="autience-close-button">
			<img src="{{common_path}}/images/close.png">
		</div>

		<div class="yeloni-yn-content-topdata">

			<div class="yline1"><span editable>Please Confirm Your Age</span></div>
			<br/>
			<div class="yline2" editable>Are you</div>
			<!--<div class="yline3" editable>50000 subscribers</div>-->
			<div class="yline4" editable>18 or Above?</div>							

			<hr/>
			<div class="yeloni-light-text" editable>The content of this site is not suitable for people under the age of 18. Please proceed with caution.
			</div>
			
			<div class="yeloni-yn-content-buttons">
				<table width="100%" border="0">
					<tr>
						<td valign="top" width="50%">
							<a ng-attr-href="{{ ifelse((settings.specific.yesaction == 'redirect'), settings.specific.yesurl)}}" 
								ng-attr-target="{{(settings.specific.tab == 'newtab')?'_blank':''}}"
								onclick="autience_action_performed()">
								<div class="yeloni-yn-yesbutton" 
									ng-class="{'autience-close-button':(settings.specific.yesaction == 'close')}">
									<span class="yeloni-superlarge" editable>Yes</span><br/>
									<span editable>Let me In</span>
								</div>
							</a>
						</td>
						<td valign="top" width="50%" ng-show="settings.specific.showno">
							<a ng-attr-href="{{ ifelse((settings.specific.noaction == 'redirect'), settings.specific.nourl)}}" 
								ng-attr-target="{{(settings.specific.tab == 'newtab')?'_blank':''}}">

								<div class="yeloni-yn-nobutton"
									ng-class="{'autience-close-button':(settings.specific.noaction == 'close')}">
									<span class="yeloni-superlarge" editable>No</span><br/>
									<span editable>I don't belong here</span>
								</div>
							</a>
						</td>
					</tr>
				</table>
				
			</div>

		</div>	
	</div>
	<div style="clear:both"></div>
</div>