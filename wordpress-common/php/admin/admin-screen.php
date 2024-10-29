
<?php /*include "events.php" */?>

<script type="text/javascript">
	var widget_path = "<?php echo $this->autience_widget_path;?>"
	var common_path = "<?php echo $this->autience_common_path;?>"
	var plugin_name = "<?php echo $this->autience_tag; ?>"
	var container_id = "autience-"+plugin_name+"-content"
	var autience_label = "<?php echo $this->autience_label; ?>"
	var autience_listed = <?php echo $this->is_wordpress_listed();?>	
</script>

<script type="text/javascript">
	var general_config_json = <?php echo $this->general_config_string; ?>

</script>

<script type="text/javascript">	
	var specific_config_json = <?php echo $this->specific_config_string; ?>
	
</script>


<div ng-app="autienceAdmin" class="container-fluid autience-app" ng-controller="autienceAdminController" 
	ng-cloak ng-class="{'autience-app-invalid':(!core.setupValid() && !core.licenseFetched)}">
	<hr>
	<h3>Autience {{autience_label}}</h3>
	<hr>

	<ul class="nav nav-tabs">

	  <li role="presentation" 
	  	ng-class="{'active':(tabs.current == tab.tag)}"
	  	ng-click="tabs.current = tab.tag"
	  	ng-repeat="tab in tabs.list"
	  	ng-if="(tab.tag != 'visitors') || show_visitors">
	  	
	  	<a><span class="glyphicon glyphicon-{{tab.icon}}" aria-hidden="true"></span> {{tab.title}}</a>
	  </li>
	</ul>

	
	<div class="tab-content" ng-if="tabs.current == 'settings'">
		<div ng-include="core.partial('settings')" 
			ng-controller="settingsController"
		 	onload="core = core"></div>	
	</div>

	<div class="tab-content" ng-if="tabs.current == 'visitors'">		
		<div ng-include="core.partial('visitors')" 
			ng-controller="visitorsController"></div>	
	</div>

	<div class="tab-content" ng-if="tabs.current == 'smart'">		
		<div ng-include="core.partial('smart')" 
			ng-controller="smartController" onload="smart = settings.smart;core = core"></div>	
	</div>

	<div class="tab-content" ng-if="tabs.current == 'extensions'">		
		<div ng-include="core.partial('extensions')" 
			ng-controller="extensionsController"
			onload="core = core"></div>	
	</div>

	<div class="tab-content" ng-if="tabs.current == 'license'">		
		<div ng-include="core.partial('license')" 
			ng-controller="licenseController"
			onload="core = core"></div>	
	</div>
	
	<!-- {{encodedTemplates}} -->
	<script type="text/ng-template" id="selectionList.html">
		<div class="modal-header">
	        <h3 class="modal-title">Widget is to be {{(smart.pageSelection.specific == 'hide')?'hidden':'shown'}} on these posts/pages</h3>
	    </div>
	    <div class="modal-body">
	        <ul class="list-group">
			  <li class="list-group-item" ng-repeat="item in smart.pageSelection[smart.pageSelection.specific]">
			    <span class="badge" ng-click="removeFromList(smart.pageSelection.specific, item)">x</span>
			    <a ng-href="/{{item.post_name}}" target="_blank">
    				{{item.post_title}}
    			</a>
			 
			  </li>
			  <li ng-show="smart.pageSelection[smart.pageSelection.specific].length ==0">
			  	No post or page selected
			  </li>
			</ul>
	    </div>
	    <div class="modal-footer">
	        <button class="btn btn-primary" type="button" ng-click="ok()">OK</button>
	    </div>
	    
	</script>

</div>

<div class="autience-options">
	<?php include "options-form.php" ?>
</div>
<div>
	Thank you for choosing <a href="http://www.autience.com" target="_blank">Autience</a> :)
</div>

<div>
	You can report any issues, suggestions, ideas and feature requests on the <a href="http://autience.helprace.com" target="_blank">Autience Support Forum</a> or mail us on support@autience.com .
	We will be happy to assist you.
</div>
<div style="clear:both"></div>