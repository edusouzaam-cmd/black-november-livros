<?php
// Remove só a configuração do plugin.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}
delete_option( 'engeteles_black_livros_slug' );
