<div>
  <form method="post" action="options.php">
  <?php
    settings_fields( 'autience-'.($this->autience_tag).'-options' );
    do_settings_sections( 'autience-'.($this->autience_tag).'-options' );
  ?><table class="form-table" style="display:none">
      <tr valign="top">   
     	<td>
        <input id="widget_active_field" type="checkbox" name="autience_<?php echo ($this->autience_snake)?>_active" ?>
      </td>
      <td>
        <input id="widget_settings_field" type="text" name="autience_<?php echo ($this->autience_snake)?>_settings" value="<?php echo $this->get_encoded_settings(); ?>"/>
      </td>
      <td>
        <input id="widget_template_field" type="text" name="autience_<?php echo ($this->autience_snake)?>_template" value="<?php echo $this->get_encoded_template(); ?>"/>
      </td>
      <td>
        <input id="widget_license_field" type="text" name="autience_<?php echo ($this->autience_snake)?>_license" value="<?php echo $this->get_encoded_license(); ?>"/>
      </td>
      </tr>
    </table>
  <?php submit_button();?>
  </form>
</div>
<script type="text/javascript">
  var autience_widget_settings = document.getElementById("widget_settings_field").value
  var autience_widget_active = "<?php echo $this->is_plugin_active(); ?>";
  var autience_license_encoded = document.getElementById("widget_license_field").value
</script>
<script>
  console.log('options-form.php included')
</script>