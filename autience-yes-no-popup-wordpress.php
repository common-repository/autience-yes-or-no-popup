<?php
/*
Plugin Name: Yes or No Popup by Autience
Description: Ask your Visitors a Question. Customize Page Behaviour based on their response
Author: Kranthi Kiran
Version: 2.3.7
*/

include "listed.php";

if(!class_exists("AutiencePlugin")){
	include 'wordpress-common/php/autience-plugin-class.php';
}

$autience_yes_no_popup_plugin = new AutiencePlugin("yes-no-popup","Yes or No Popup","autience-yes-or-no-popup","yes_no_popup",dirname(__FILE__));

?>