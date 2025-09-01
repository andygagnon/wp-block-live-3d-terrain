<?php
/**
 * Plugin Name:       Live 3d Terrain - AAG
 * Description:       Demo of live 3D terrain block.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Andre Gagnon
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       live-3d-terrain-aag
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
/**
 * Registers the block using a `blocks-manifest.php` file, which improves the performance of block type registration.
 * Behind the scenes, it also registers all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */
function create_block_live_3d_terrain_aag_block_init() {
	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
	 * based on the registered block metadata.
	 * Added in WordPress 6.8 to simplify the block metadata registration process added in WordPress 6.7.
	 *
	 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
	 */
	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
		return;
	}

	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` file.
	 * Added to WordPress 6.7 to improve the performance of block type registration.
	 *
	 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
	 */
	if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		wp_register_block_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	}
	/**
	 * Registers the block type(s) in the `blocks-manifest.php` file.
	 *
	 * @see https://developer.wordpress.org/reference/functions/register_block_type/
	 */
	$manifest_data = require __DIR__ . '/build/blocks-manifest.php';
	foreach ( array_keys( $manifest_data ) as $block_type ) {
		register_block_type( __DIR__ . "/build/{$block_type}" );
	}
}
add_action( 'init', 'create_block_live_3d_terrain_aag_block_init' );

/**
 * Enqueues the Three.js script for both the editor and the front end.
 *
 * We register the script here so it can be used as a dependency
 * later if needed, but we enqueue it globally since it's required
 * for both environments.
 */
function live_3d_terrain_aag_enqueue_threejs_script() {
	// Register the script with a unique handle and specify its source (CDN).
	wp_register_script(
		'live-3d-terrain-aag-threejs',
		'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
		[], // No dependencies for Three.js itself.
		'128', // Version of the library.
		true // Enqueue in the footer.
	);

	// Enqueue the script on the front-end.
	wp_enqueue_script( 'live-3d-terrain-aag-threejs' );
}

// Hook this function to the `wp_enqueue_scripts` action for the front end.
add_action( 'wp_enqueue_scripts', 'live_3d_terrain_aag_enqueue_threejs_script' );
// Hook this function to the `enqueue_block_editor_assets` for the editor.
add_action( 'enqueue_block_editor_assets', 'live_3d_terrain_aag_enqueue_threejs_script' );


