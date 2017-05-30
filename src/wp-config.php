<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// Pull in wp-config-local.php file

if ( file_exists( dirname( __FILE__ ) . '/wp-config-local.php' ) ) {
	include( dirname( __FILE__ ) . '/wp-config-local.php' );
}

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'FM7h9QQ-*[j;kQ1oHZK?G9]OJ0$Kw4Cq?7k-;Xl2A/R4a#p B,uGE8(*$T5/No0P');
define('SECURE_AUTH_KEY',  '`_]YN/D*~5-`f:&)UU]/6I(SKt,tq^fk*QAc}H$&bG2:jgq{c%j6[fK)7V8/5rfM');
define('LOGGED_IN_KEY',    '@3(PR]H2g3S[aK[Wz*Ye4jS_l8-4Cr6z10T{-Pu8^D7O#{s!Cw siB*m%1N-sJRV');
define('NONCE_KEY',        'o]9GTJK)*XIgttB=:T9lamlJQT;F|Sy7XAOMA3ehdBhFBN,Xb[;[+^6/NIUD2Ez_');
define('AUTH_SALT',        'J{(WS+LJj,0:|]N>`t_soWe-]I7,G/481@iK HmI+zm~-NVAcofd_-GJ&_ACA}c^');
define('SECURE_AUTH_SALT', '~CAz65d<q1Q:.#{W,e%-Z_B?xZy_D<e.e*Bl[ULEJ5XX8IVy,Vr&VCKkFqF&lx3p');
define('LOGGED_IN_SALT',   '*UE_.Vqa|e9|AKix&iTG]B9Vj]UIeV2YP($H>fpFJlQ248cdEXh%]/b!q3Dnw8-(');
define('NONCE_SALT',       'FMon)N[/)| Bokof%4tC]Y#Z{4JI)8_=;R&qoVa#%a`wYKyGl`rcz_3OA1wE&2,*');

/**#@-*/

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
if ( ! defined( 'WP_DEBUG' ) )
	define( 'WP_DEBUG', false );

if ( WP_DEBUG ) {
	define( 'WP_DEBUG_DISPLAY', false );
	define( 'WP_DEBUG_LOG', true );
	define( 'JETPACK_DEV_DEBUG', true );
}

/** Miscellaneous */
define( 'WP_MEMORY_LIMIT', '512M' );
define( 'SUCURISCAN_HIDE_ADS', true );

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
