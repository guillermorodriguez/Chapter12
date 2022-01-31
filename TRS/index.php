<?php

/*
Plugin Name:  Table Reservation System
Plugin URI:   https://www.tablereservationsystem.test
Description:  A plugin to facilitate table reservations in WordPress
Version:      1.0
Author:       Guillermo Rodriguez
Author URI:   https://www.GitHub.com/guillermorodriguez
License:      GPL2
License URI:  https://www.gnu.org/licenses/gpl-2.0.html
Text Domain:  restaurant
Domain Path:  /languages
*/



add_action('wp_enqueue_scripts','table_reservation_application_init');

function table_reservation_application_init() {
    wp_enqueue_script( 'table-reservations-js', plugins_url( 'js/table_reservations.js', __FILE__ ));
}
