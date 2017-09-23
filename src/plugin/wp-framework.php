<?php
/**
 * Plugin Name: ##PROJECT_NAME##
 * Author: Taupecat Studios
 * Author URI: https://taupecatstudios.com
 */

/**
 * Disabling Jetpack upsell messages.
 * HT: https://mattreport.com/disable-jetpack-upsell-ads/
 * (Requires PHP 5.5 or higher)
 */

add_filter( 'jetpack_just_in_time_msgs', function() { return false; } );
