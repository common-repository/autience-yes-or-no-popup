
<script type="text/javascript">
	
		
	var autience_widget = "<?php echo $this->autience_tag;?>";	
	var autience_categories = "<?php echo $this->get_categories();?>"
	var autience_link  = "<?php echo $this->get_specific_config('powered');?>" 
	var autience_path = "<?php echo $this->autience_widget_path;?>"
	
	function autience_action_performed(){
		Autience.utils.createCookie("autience_action_"+autience_widget,"performed")
	}
	var autience_settings = <?php echo $this->get_settings_json(); ?>

</script>

<link rel="stylesheet" type="text/css" href="<?php echo $this->get_container_css_path()?>">

<div class="autience-blog-page-container autience-container-<?php echo $this->get_current_layout()?>" 
	id="<?php echo 'autience-'.($this->autience_tag).'-container';?>">

	<div class="autience-layout-<?php echo $this->get_current_layout()?>" id="autience-layout-container">


		<div class="autience-theme-<?php echo $this->get_current_theme()?>">
			<?php 
				$this->enque_client_code();
				$this->include_widget_template();
			?>
		</div>

		
	</div>

	<div id="powered-by-autience">
		<a id="powered-by-autience-link" href="http://autience.com" target="_blank">
			Powered by Autience
		</a>
	</div>
</div>