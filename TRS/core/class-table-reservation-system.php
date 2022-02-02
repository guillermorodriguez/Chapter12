<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * HELPER COMMENT START
 *
 * This is the main class that is responsible for registering
 * the core functions, including the files and setting up all features.
 *
 * To add a new class, here's what you need to do:
 * 1. Add your new class within the following folder: core/includes/classes
 * 2. Create a new variable you want to assign the class to (as e.g. public $helpers)
 * 3. Assign the class within the instance() function ( as e.g. self::$instance->helpers = new Table_Reservation_System_Helpers();)
 * 4. Register the class you added to core/includes/classes within the includes() function
 *
 * HELPER COMMENT END
 */

if ( ! class_exists( 'Table_Reservation_System' ) ) :

	/**
	 * Main Table_Reservation_System Class.
	 *
	 * @package		TRS
	 * @subpackage	Classes/Table_Reservation_System
	 * @since		1.0.0
	 * @author		Guillermo Rodriguez
	 */
	final class Table_Reservation_System {

		/**
		 * The real instance
		 *
		 * @access	private
		 * @since	1.0.0
		 * @var		object|Table_Reservation_System
		 */
		private static $instance;

		/**
		 * TRS helpers object.
		 *
		 * @access	public
		 * @since	1.0.0
		 * @var		object|Table_Reservation_System_Helpers
		 */
		public $helpers;

		/**
		 * TRS settings object.
		 *
		 * @access	public
		 * @since	1.0.0
		 * @var		object|Table_Reservation_System_Settings
		 */
		public $settings;

		/**
		 * Throw error on object clone.
		 *
		 * Cloning instances of the class is forbidden.
		 *
		 * @access	public
		 * @since	1.0.0
		 * @return	void
		 */
		public function __clone() {
			_doing_it_wrong( __FUNCTION__, __( 'You are not allowed to clone this class.', 'table-reservation-system' ), '1.0.0' );
		}

		/**
		 * Disable unserializing of the class.
		 *
		 * @access	public
		 * @since	1.0.0
		 * @return	void
		 */
		public function __wakeup() {
			_doing_it_wrong( __FUNCTION__, __( 'You are not allowed to unserialize this class.', 'table-reservation-system' ), '1.0.0' );
		}

		/**
		 * Main Table_Reservation_System Instance.
		 *
		 * Insures that only one instance of Table_Reservation_System exists in memory at any one
		 * time. Also prevents needing to define globals all over the place.
		 *
		 * @access		public
		 * @since		1.0.0
		 * @static
		 * @return		object|Table_Reservation_System	The one true Table_Reservation_System
		 */
		public static function instance() {
			if ( ! isset( self::$instance ) && ! ( self::$instance instanceof Table_Reservation_System ) ) {
				self::$instance					= new Table_Reservation_System;
				self::$instance->base_hooks();
				self::$instance->includes();
				self::$instance->helpers		= new Table_Reservation_System_Helpers();
				self::$instance->settings		= new Table_Reservation_System_Settings();

				//Fire the plugin logic
				new Table_Reservation_System_Run();

				/**
				 * Fire a custom action to allow dependencies
				 * after the successful plugin setup
				 */
				do_action( 'TRS/plugin_loaded' );
			}

			return self::$instance;
		}

		/**
		 * Include required files.
		 *
		 * @access  private
		 * @since   1.0.0
		 * @return  void
		 */
		private function includes() {
			require_once TRS_PLUGIN_DIR . 'core/includes/classes/class-table-reservation-system-helpers.php';
			require_once TRS_PLUGIN_DIR . 'core/includes/classes/class-table-reservation-system-settings.php';

			require_once TRS_PLUGIN_DIR . 'core/includes/classes/class-table-reservation-system-run.php';
		}

		/**
		 * Add base hooks for the core functionality
		 *
		 * @access  private
		 * @since   1.0.0
		 * @return  void
		 */
		private function base_hooks() {
			add_action( 'plugins_loaded', array( self::$instance, 'load_textdomain' ) );
			add_action('wp_enqueue_scripts', array( self::$instance, 'table_reservation_application_init' ) );
		}

		/**
		 * Loads the plugin language files.
		 *
		 * @access  public
		 * @since   1.0.0
		 * @return  void
		 */
		public function load_textdomain() {
			load_plugin_textdomain( 'table-reservation-system', FALSE, dirname( plugin_basename( TRS_PLUGIN_FILE ) ) . '/languages/' );
		}

		/**
		 * Loads the plugin table reservation javascript file.
		 *
		 * @access  public
		 * @since   1.0.0
		 * @return  void
		 */
		function table_reservation_application_init() {
				wp_enqueue_script( 'table-reservations-js', TRS_PLUGIN_URL . 'js/table_reservations.js', array(), 1.0, false);
		}

	}

endif; // End if class_exists check.
