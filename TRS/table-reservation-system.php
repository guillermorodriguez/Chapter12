<?php
/**
 * TRS
 *
 * @package       TRS
 * @author        Guillermo Rodriguez
 * @license       gplv2
 * @version       1.0.0
 *
 * @wordpress-plugin
 * Plugin Name:   TRS
 * Plugin URI:    trs.test.com
 * Description:   Table reservation plugin
 * Version:       1.0.0
 * Author:        Guillermo Rodriguez
 * Author URI:    https://www.linkedin.com/in/DrGuillermoRodriguez
 * Text Domain:   table-reservation-system
 * Domain Path:   /languages
 * License:       GPLv2
 * License URI:   https://www.gnu.org/licenses/gpl-2.0.html
 *
 * You should have received a copy of the GNU General Public License
 * along with TRS. If not, see <https://www.gnu.org/licenses/gpl-2.0.html/>.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * HELPER COMMENT START
 *
 * This file contains the main information about the plugin.
 * It is used to register all components necessary to run the plugin.
 *
 * The comment above contains all information about the plugin
 * that are used by WordPress to differenciate the plugin and register it properly.
 * It also contains further PHPDocs parameter for a better documentation
 *
 * The function TRS() is the main function that you will be able to
 * use throughout your plugin to extend the logic. Further information
 * about that is available within the sub classes.
 *
 * HELPER COMMENT END
 */

// Plugin name
define( 'TRS_NAME',			'TRS' );

// Plugin version
define( 'TRS_VERSION',		'1.0.0' );

// Plugin Root File
define( 'TRS_PLUGIN_FILE',	__FILE__ );

// Plugin base
define( 'TRS_PLUGIN_BASE',	plugin_basename( TRS_PLUGIN_FILE ) );

// Plugin Folder Path
define( 'TRS_PLUGIN_DIR',	plugin_dir_path( TRS_PLUGIN_FILE ) );

// Plugin Folder URL
define( 'TRS_PLUGIN_URL',	plugin_dir_url( TRS_PLUGIN_FILE ) );

/**
 * Load the main class for the core functionality
 */
require_once TRS_PLUGIN_DIR . 'core/class-table-reservation-system.php';

/**
 * The main function to load the only instance
 * of our master class.
 *
 * @author  Guillermo Rodriguez
 * @since   1.0.0
 * @return  object|Table_Reservation_System
 */
function TRS() {
	return Table_Reservation_System::instance();
}

TRS();
