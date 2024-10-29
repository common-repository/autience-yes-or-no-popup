<?php

class AutiencePlugin{

	private $autience_tag, $autience_label,$autience_folder,  $autience_widget_path,$autience_common_path;
	private $vendor_scripts, $vendor_styles, $admin_scripts, $admin_styles, $client_scripts, $client_styles;
	private $specific_json, $autience_snake, $settings_json, $plugin_path,$autience_vendor_path;

	private $theme_styles,$general_json, $current_theme_style,$general_config_string;
	private $extensions,$common_extension_admin_scripts, $common_extension_client_scripts, $specific_extension_admin_scripts, $scpecific_extension_client_scripts;

	private $specific_admin, $specific_client,$admin_dependencies, $client_dependencies;

	function __construct($autience_tag, $autience_label, $autience_folder,$autience_snake,$include_path) {
		set_include_path($include_path);

		$this->plugin_path = $include_path;
		$this->autience_tag = $autience_tag;
		$this->autience_label = $autience_label;
		$this->autience_folder = $autience_folder;
		$this->autience_snake = $autience_snake;
		$this->specific_admin = array(($this->autience_tag)."-admin");
		$this->specific_client = array(($this->autience_tag)."-client");

		set_include_path(get_include_path() . PATH_SEPARATOR . ($this->plugin_path)."/wordpress-common/autience-common/");
		set_include_path(get_include_path() . PATH_SEPARATOR . ($this->plugin_path)."/".($this->autience_tag)."/");

		$this->read_general_json();
		$this->read_specific_json();		
		$this->read_settings_json();
		$this->read_license_json();
		$this->get_active_licenses();
		
		$this->autience_widget_path = plugins_url(($autience_folder).'/'.($autience_tag));
		$this->autience_common_path = plugins_url(($autience_folder)).'/wordpress-common/autience-common/autience';
		$this->autience_vendor_path = plugins_url(($autience_folder)).'/wordpress-common/autience-common/vendor';
		//register third party and own scripts to be included		
		$this->list_out_code();
		
		$this->register_admin_code();
		$this->register_client_code();
		$this->register_extension_files();

		//hook to insert code on admin page
		add_action( 'admin_menu', array($this, 'setup_admin_page') );
				
		if($this->is_plugin_active()){
			$this->inject_hooks();
		}
	
	}
	
	function get_active_licenses(){
		$this->extensions = array();
		$this->admin_dependencies = array();
		$this->client_dependencies = array();

		$this->get_licences_from_json($this->license_json, $this->extensions,$this->admin_dependencies,$this->client_dependencies);
		$this->get_licences_from_json($this->specific_json['extensions'],$this->extensions);
	}

	function get_licences_from_json($license_json,&$extensions){
		$license_count = count($license_json);

		for($i=0;$i<$license_count;$i++){
			$product_id = $license_json[$i]['productId'];

			if($product_id == $this->autience_tag){
				//change page-selection-offer-popup into page-selection
				$extension = str_replace("-".($product_id),"",$license_json[$i]['featureId']);
				array_push($extensions, $extension);

				if(array_key_exists('adminDependencies', $license_json[$i])){					
					$this->push_unique_array($this->admin_dependencies, $license_json[$i]['adminDependencies']);
				}
				
				if(array_key_exists('clientDependencies', $license_json[$i])){
					$this->push_unique_array($this->client_dependencies, $license_json[$i]['clientDependencies']);
				}
			}
		}
	}

	function read_specific_json(){
		//read the specific.json file into a variable
		$config_file = ($this->plugin_path).'/'.($this->autience_tag).'/specific.json';	
		$this->specific_config_string = file_get_contents($config_file);
		$this->specific_json = json_decode($this->specific_config_string,true);
	}

	function read_general_json(){
		$config_file = ($this->plugin_path).'/wordpress-common/autience-common/autience/general.json';		
		$this->general_config_string = file_get_contents($config_file);
		$this->general_json = json_decode($this->general_config_string,true);	
	}

	function read_license_json(){
		$this->license_json = $this->read_license_file();

		//iterate through specific extensions, push the free extensions into license json
		$specific_extensions = $this->specific_json['extensions'];
		$specific_count = count($specific_extensions);
		
		for($i=0;$i<$specific_count;$i++){
			if($this->is_free_extension($specific_extensions[$i]['id'])){
				array_push($this->license_json, $specific_extensions[$i]);
			}
		}
	}

	function read_license_file(){
		$saved_license = get_option("autience_".($this->autience_snake)."_license");
		if($saved_license && strlen($saved_license)>0){
			return json_decode( base64_decode($saved_license), true );
		}else{
			return array();
		}
	}

	function is_free_extension($extension){
		$free_extensions = $this->specific_json['free_extensions'];
		return in_array($extension, $free_extensions);
	}

	function read_settings_json(){
		$this->settings_json = json_decode(base64_decode($this->get_encoded_settings()), true);
	}

	function setup_admin_page() {
		add_options_page('Autience '.($this->autience_label).' Settings', 'Autience '.($this->autience_label), 'manage_options', 'autience-'.($this->autience_tag),  array($this, 'add_admin_page'));
		add_action( 'admin_init', array($this, 'register_settings') ); //call register settings function
	}

	function add_admin_page(){
		$this->enque_admin_code();

		//include all the adminDependencies in the extensions
		$admin_dependencies_count = count($this->admin_dependencies);
		for($i =0;$i < $admin_dependencies_count;$i++){
			include_once 'admin/'.($this->admin_dependencies[$i]).".php";
		}
		
		include 'admin/admin-screen.php';
		include "specific/".($this->autience_tag)."-admin.php";


	}

	function register_settings() {
		register_setting( 'autience-'.($this->autience_tag).'-options', 'autience_'.($this->autience_snake).'_settings' );
		register_setting( 'autience-'.($this->autience_tag).'-options', 'autience_'.($this->autience_snake).'_template' );
		register_setting( 'autience-'.($this->autience_tag).'-options', 'autience_'.($this->autience_snake).'_active' );
		register_setting( 'autience-'.($this->autience_tag).'-options', 'autience_'.($this->autience_snake).'_license' );
	}
	

	function your_plugin_settings_link($links) { 
	  $settings_link = '<a href="options-general.php?page=autience-'.($this->autience_tag).'">Settings</a>'; 
	  array_unshift($links, $settings_link); 
	  return $links; 
	}

	function list_out_code(){
		$this->vendor_scripts = array("bootstrap.min","angular.min","angular-base64.min","angular-animate.min",
			"api-check.min","formly.min","angular-formly-templates-bootstrap.min",
			"angular-toggle-switch.min", "ui-bootstrap-tpls-0.13.4.min","angucomplete-alt","ui-grid.min","angularjs-color-picker.min","tinycolor-min");
		
		$this->vendor_styles = array("bootstrap.min","angular-toggle-switch","angucomplete-alt","ui-grid.min","angularjs-color-picker.min");

		$this->admin_scripts = array("admin-utils", "admin-core","directives/editable","directives/other","directives/paypal","events","settings-controller","visitors-controller","extensions-controller","smart-controller","license-controller","services/autience-service");
		$this->admin_styles = array("admin","throbber",);
		
		$this->client_scripts = array("base64","client-core");
		
		//iterate through all the themes and create a theme_styles variable
		$this->theme_styles = array();

		foreach($this->get_specific_config('themes') as $theme){
			array_push($this->theme_styles, $theme['tag'].("/").($theme['tag']).("-style"));
		}

		//register current theme style to be rendered on the client page
		$this->current_theme_style = array();
		$current_theme = $this->get_current_theme();

		array_push($this->current_theme_style, $current_theme.("/").($current_theme).("-style"));
		
	}

	function register_client_code(){
		$this->register_files($this->admin_scripts, "/wordpress-common/autience-common/autience/scripts/","script");
		$this->register_files($this->admin_styles, "/wordpress-common/autience-common/autience/styles/","style");
		
		$this->register_files($this->client_scripts,"/wordpress-common/autience-common/autience/scripts/","script");
		$this->register_files($this->theme_styles,"/".($this->autience_tag).("/themes/"),"style");

		$this->register_files($this->current_theme_style,"/".($this->autience_tag).("/themes/"),"style");

		$this->register_files($this->specific_client, "/".($this->autience_tag)."/specific/" ,"script");
	}

	function register_admin_code(){

		$this->register_files($this->vendor_scripts, "/wordpress-common/autience-common/vendor/scripts/","script");
		$this->register_files($this->vendor_styles, "/wordpress-common/autience-common/vendor/styles/","style");

		$this->register_files($this->specific_admin  , "/".($this->autience_tag)."/specific/","script" );
	}

	function register_extension_files(){

		//scripts for common extensions and specific extensions
		$this->common_extension_admin_scripts = array();
		$this->common_extension_client_scripts = array();
		$this->specific_extension_admin_scripts = array();
		$this->specific_extension_client_scripts = array();
		
		$extension_count = count($this->extensions);
		// print_r('Extensions <br>');

		for($i =0;$i<$extension_count;$i++){
			$extension = $this->extensions[$i];
			if($this->is_common_extension($extension)){
				array_push($this->common_extension_admin_scripts, ($extension)."/".($extension)."-admin");
				array_push($this->common_extension_client_scripts, ($extension)."/".($extension)."-client");
			}else{
				array_push($this->specific_extension_admin_scripts, ($extension)."/".($extension)."-admin");
				array_push($this->specific_extension_client_scripts, ($extension)."/".($extension)."-client");
			}
		}
		
		$this->register_files($this->common_extension_admin_scripts,"/wordpress-common/autience-common/extensions/","script");
		$this->register_files($this->common_extension_client_scripts,"/wordpress-common/autience-common/extensions/","script");

		$this->register_files($this->specific_extension_admin_scripts,"/".($this->autience_tag)."extensions/","script");
		$this->register_files($this->specific_extension_client_scripts,"/".($this->autience_tag)."/extensions/","script");

	}

	function is_common_extension($ext){
		$common_extensions = $this->general_json['common'];
		return in_array($ext, $common_extensions);
	}

	function enque_admin_code(){
		//print_r($this->vendor_scripts);
		$this->enque_files($this->vendor_scripts, "script");
		$this->enque_files($this->vendor_styles,"style");
		$this->enque_files($this->admin_scripts, "script");
		$this->enque_files($this->admin_styles, "style");
		$this->enque_files($this->theme_styles,"style");
		$this->enque_files($this->common_extension_admin_scripts,"script");
		$this->enque_files($this->specific_extension_admin_scripts,"script");
		$this->enque_files($this->specific_admin,"script");
	}
	
	function enque_client_code(){
		$this->enque_files($this->client_scripts,"script");
		$this->enque_files($this->current_theme_style,"style");
		$this->enque_files($this->common_extension_client_scripts,"script");
		$this->enque_files($this->specific_extension_client_scripts,"script");

		$this->enque_files($this->specific_client,"script");
	}

	function include_widget_template(){
		//if there is a saved template, include it, 
		//otherwise include the corresponding layout template
		
		$theme = $this->get_current_theme();
		if($theme){
			$saved_template = $this->get_current_template();
			
			if($saved_template){
				echo $saved_template;
			}
		}
	}

	//current layout for rendering on the client
	function get_current_layout(){
		
		return $this->get_plugin_settings('layout');
	}

	function get_current_theme(){
		
		return $this->get_plugin_settings('theme');
	}

	function get_encoded_settings(){
		return get_option("autience_".($this->autience_snake)."_settings");
	}

	function get_encoded_template(){
		return get_option("autience_".($this->autience_snake)."_template");
	}

	function get_encoded_license(){
		return get_option("autience_".($this->autience_snake)."_license");
	}
	function is_plugin_active(){
		//var_dump("Is Active-".(get_option("autience_".($this->autience_snake)."_active")));

		return get_option("autience_".($this->autience_snake)."_active");
	}

	function get_plugin_settings($key){
		if($this->settings_json && array_key_exists($key, $this->settings_json)){
			return $this->settings_json[$key];
		}
		
		return null;		
	}

	function get_settings_json(){
		return json_encode($this->settings_json);
	}

	//get the full json of all the layout templates combined
	function get_plugin_templates(){
		return json_decode(base64_decode($this->get_encoded_template()), true);
	}

	function get_current_template(){
		
		$theme = $this->get_current_theme();

		$decoded_templates = $this->get_plugin_templates();
		$encoded_template = $decoded_templates[$theme];
		
		return base64_decode($encoded_template);
	}

	function get_container_css_path(){
		return (plugins_url($this->autience_folder))."/wordpress-common/autience-common/autience/styles/container-".($this->get_current_layout()).".css";
	}

	function get_layout_css_path(){
		return ($this->autience_widget_path)."/layouts/".($this->get_current_layout())."/".($this->get_current_layout())."-style.css";
	}

	function get_theme_css_path(){
		return ($this->autience_widget_path)."/themes/".($this->get_current_theme())."/".($this->get_current_theme())."-style.css";
	}

	function register_files($file_array, $base_dir,$type){
		$file_count = count($file_array);

		for($i = 0; $i < $file_count; $i++) {
			
			if($type == 'script'){
				$full_path = plugins_url( ($this->autience_folder).($base_dir).($file_array[$i]).'.js' );
				
				wp_register_script( 'autience-'.($file_array[$i]), $full_path);
			}else{
				$full_path = plugins_url( ($this->autience_folder).($base_dir).($file_array[$i]).'.css' );
				wp_register_style( 'autience-'.($file_array[$i]), $full_path);	
			}		    
			
		}		
	}

	function enque_files($file_array,$type){

		$file_count=count($file_array);

		for($i = 0; $i < $file_count; $i++) {
			if($type == 'script'){
				wp_enqueue_script( 'autience-'.($file_array[$i]));
			}else{
				wp_enqueue_style( 'autience-'.($file_array[$i]));	
			}		    
		}
	}


	//Hook Injection
	function inject_hooks(){
		//var_dump("Injecting Hooks");
		if($this->has_hook("wp_footer")){
			add_action( 'wp_footer', array($this, 'wp_footer_hook') );
		}
		if($this->has_hook("the_content")){
			//adding priority so that is filter is runn after wpautop
			add_filter( 'the_content', array($this, 'the_content_hook') ,100);
		}
	}

	function has_hook($hook){
		return in_array($hook, $this->specific_json['inject']);
	}

	function plugin_type(){

		return $this->specific_json['type'];
	}

	function get_specific_config($key){
		return $this->specific_json[$key];
	}

	function get_specific_settings($key){
		$specific=$this->get_plugin_settings('specific');
		return $specific[$key];
	}

	function get_general_settings($key){
		return $this->settings_json['general'][$key];
	}

	function get_smart_settings($key){
		if($this->settings_json['smart']){
			return $this->settings_json['smart'][$key];
		}else{
			return NULL;
		}		
	}

	//Define the various hooks
	function wp_footer_hook(){
		//var_dump("plugin_type- ".($this->plugin_type()));
		if($this->plugin_type() == 'widget' && $this->page_selection_valid()){			
			include 'client/widget.php';
			include "specific/".($this->autience_tag)."-client.php";
			
			//include extension's client php files
			/*
			$extension_count = count($this->extensions);
			for($i=0;$i<$extension_count;$i++){
				$extension = $this->extensions[$i];
				include "extensions/".$extension.'/'.$extension.'-client.php';
			}
			*/
			
			$client_dependencies_count = count($this->client_dependencies);
			for($i =0;$i < $client_dependencies_count;$i++){
				include_once 'client/'.($this->client_dependencies[$i]).".php";
			}
		}
	}
	
	function the_content_hook($content){
		$filter_fn = "autience_".($this->autience_snake)."_filter";	
		//var_dump("is_singular");

		if(!$this->has_hook("is_single") || is_single()){
		
			return $filter_fn($content, $this->specific_json, $this->get_plugin_settings('specific'));
		}else{
			return $content;
		}
	}

	function get_post_list(){
		$all_posts = get_posts(array('numberposts'=> -1));
		$post_count = count($all_posts);
		$pruned = array();
		
		//var_dump($all_posts);
		for($i=0; $i<$post_count;$i++){
			$post = (object) array('ID' => ($all_posts[$i]->ID),'post_title' => ($all_posts[$i]->post_title),'post_name' => ($all_posts[$i]->post_name) );
			array_push($pruned, $post);
		}
		return json_encode($pruned);
	}

	function get_page_list(){
		$all_pages = get_pages(array('numberposts'=> -1));
		$page_count = count($all_pages);
		$pruned = array();
		
		for($i=0; $i<$page_count;$i++){
			$page = (object) array('ID' => ($all_pages[$i]->ID),'post_title' => ($all_pages[$i]->post_title),'post_name' => ($all_pages[$i]->post_name));
			array_push($pruned, $page);
		}
		
		return json_encode($pruned);
	}

	function autience_is_home(){
		//global $wp;
		//$current_url = home_url(add_query_arg(array(),$wp->request));
		//var_dump('Current Url- '.($current_url));

		return is_home() | is_front_page();
	}

	function page_selection_valid(){
	
		$pageSelection = $this->get_smart_settings('pageSelection');
		
		if(!$pageSelection){
			return true;
		}

		wp_reset_query();//this needs to be run for is_home() to work properly

		if($this->autience_is_home()){

			if(array_key_exists('home',$pageSelection)){

				$show_on_home = $pageSelection['home'];
				return $show_on_home;
			}else{
				return true;
			}

		}
		

		$mode = $pageSelection['mode'];

		if(!$mode || $mode == 'all'){
			return true;
		}

		if($mode =='none'){
			return false;
		}

		//if mode is all pages, check that current is a page
		if($mode == 'pages'){			
			if(get_post_type() == 'page'){
				return true;
			}
		}

		//if mode is all posts, check that current is a post
		if($mode == 'posts'){
			if(get_post_type() == 'post'){
				return true;
			}
		}

		//if mode is all products, check that current is a post
		if($mode == 'products'){
			if(get_post_type() == 'product'){
				return true;
			}
		}

		//if mode is specific, check if it is to be shown or hidden
		if($mode == 'specific'){
			//var_dump('SPECIFIC MODE');

			$display = $pageSelection['specific'];
			//var_dump('display- '.($display));
			$posts_array = $pageSelection[$display];

			$ID = get_the_ID();
			//var_dump('ID- '.$ID);
			$exists = $this->id_exists($ID, $posts_array);
			//var_dump('Exists- '.$exists);
			if($exists && ($display == 'show')){
				return true;
			}
			if(!$exists && ($display == 'hide')){
				return true;
			}

		}
		return false;
	}

	function get_categories(){
		$categories = get_the_category();
		$only_tags = "";
		$category_count = count($categories);

		for($i =0; $i < $category_count; $i++){
			$only_tags = $only_tags.($categories[$i]->cat_name);

			if($i < $category_count-1){
				$only_tags = $only_tags.",";
			}
			
		}

		return $only_tags;
	}



	function id_exists($ID, $array){
		$len = count($array);
		//var_dump($array);

		for($i =0;$i<$len;$i++){
			//var_dump("inside id_exists ".($array[$i]['ID'])." - ".($ID));

			if($array[$i]['ID'] == $ID){
				return true;
			}
		}

		return false;
	}

	function is_wordpress_listed(){
		if(function_exists("autience_".($this->autience_snake)."_listed")){
			return 'true';
		}else{
			return 'false';
		}
	}

	function valid_json(){
		switch (json_last_error()) {
	        case JSON_ERROR_NONE:
	            return ' - No errors';
	        break;
	        case JSON_ERROR_DEPTH:
	            return ' - Maximum stack depth exceeded';
	        break;
	        case JSON_ERROR_STATE_MISMATCH:
	            return ' - Underflow or the modes mismatch';
	        break;
	        case JSON_ERROR_CTRL_CHAR:
	            return ' - Unexpected control character found';
	        break;
	        case JSON_ERROR_SYNTAX:
	            return ' - Syntax error, malformed JSON';
	        break;
	        case JSON_ERROR_UTF8:
	            return ' - Malformed UTF-8 characters, possibly incorrectly encoded';
	        break;
	        default:
	            return ' - Unknown error';
	        break;
	    }
	}

	function push_unique_array(&$arr, $els){
		$el_count = count($els);

		for($i = 0;$i< $el_count;$i++){
			$this->push_unique($arr, $els[$i]);
		}
	}
	function push_unique(&$arr,$el){
		
		if(!in_array($el,$arr)){
			array_push($arr, $el);
		}
	}

}

?>