<?php
/**
 * Plugin Name:       Engeteles – Black November Livros
 * Description:       Landing page Black November Livros em páginas inteiras (sem tema): a página principal, Termos de uso e Política de privacidade. Fica no endereço configurado em Configurações › Black Livros (padrão: /black-livros/). Não interfere nas outras páginas do site.
 * Version:           1.0.0
 * Author:            Engeteles
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Text Domain:       engeteles-black-livros
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'ENGETELES_BLACK_LIVROS_VERSION', '1.0.0' );
define( 'ENGETELES_BLACK_LIVROS_DIR', plugin_dir_path( __FILE__ ) );
define( 'ENGETELES_BLACK_LIVROS_URL', plugin_dir_url( __FILE__ ) );
define( 'ENGETELES_BLACK_LIVROS_OPTION', 'engeteles_black_livros_slug' );
define( 'ENGETELES_BLACK_LIVROS_DEFAULT_SLUG', 'black-livros' );

/**
 * Endereço base das páginas (ex.: black-livros → engeteles.com.br/black-livros/).
 */
function engeteles_black_livros_get_slug() {
	$slug = sanitize_title( (string) get_option( ENGETELES_BLACK_LIVROS_OPTION, ENGETELES_BLACK_LIVROS_DEFAULT_SLUG ) );
	return '' !== $slug ? $slug : ENGETELES_BLACK_LIVROS_DEFAULT_SLUG;
}

/**
 * Páginas do pacote: caminho relativo ao slug => arquivo HTML em site/.
 */
function engeteles_black_livros_routes() {
	$file   = ENGETELES_BLACK_LIVROS_DIR . 'site/routes.php';
	$routes = is_readable( $file ) ? include $file : array();
	return is_array( $routes ) ? $routes : array();
}

/**
 * Atende /black-livros/, /black-livros/termos-de-uso e /black-livros/politica-de-privacidade
 * antes do WordPress montar a página, sem carregar o tema.
 */
function engeteles_black_livros_parse_request( $wp ) {
	if ( is_admin() ) {
		return;
	}
	$slug    = engeteles_black_livros_get_slug();
	$request = trim( (string) $wp->request, '/' );
	if ( $request !== $slug && 0 !== strpos( $request, $slug . '/' ) ) {
		return;
	}
	$sub    = trim( substr( $request, strlen( $slug ) ), '/' );
	$routes = engeteles_black_livros_routes();
	if ( ! isset( $routes[ $sub ] ) ) {
		return; // Outros endereços continuam com o WordPress (ex.: 404 normal).
	}

	$file = ENGETELES_BLACK_LIVROS_DIR . 'site/' . $routes[ $sub ];
	if ( ! is_readable( $file ) ) {
		return;
	}

	$assets = untrailingslashit( set_url_scheme( ENGETELES_BLACK_LIVROS_URL . 'site' ) );
	$home   = untrailingslashit( home_url( '/' . $slug ) );
	$html   = str_replace(
		array( '{{ENGETELES_BLACK_LIVROS_ASSETS}}', '{{ENGETELES_BLACK_LIVROS_HOME}}' ),
		array( $assets, $home ),
		(string) file_get_contents( $file )
	);

	status_header( 200 );
	nocache_headers();
	header( 'Content-Type: text/html; charset=utf-8' );
	echo $html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- HTML estático do próprio plugin.
	exit;
}
add_action( 'parse_request', 'engeteles_black_livros_parse_request', 0 );

/**
 * Configurações › Black Livros (troca do endereço).
 */
function engeteles_black_livros_register_settings() {
	register_setting(
		'engeteles_black_livros',
		ENGETELES_BLACK_LIVROS_OPTION,
		array(
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_title',
			'default'           => ENGETELES_BLACK_LIVROS_DEFAULT_SLUG,
		)
	);
}
add_action( 'admin_init', 'engeteles_black_livros_register_settings' );

function engeteles_black_livros_add_settings_page() {
	add_options_page( 'Black Livros', 'Black Livros', 'manage_options', 'engeteles-black-livros', 'engeteles_black_livros_settings_page' );
}
add_action( 'admin_menu', 'engeteles_black_livros_add_settings_page' );

function engeteles_black_livros_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$slug   = engeteles_black_livros_get_slug();
	$routes = engeteles_black_livros_routes();
	?>
	<div class="wrap">
		<h1>Black November Livros</h1>
		<form method="post" action="options.php">
			<?php settings_fields( 'engeteles_black_livros' ); ?>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><label for="engeteles_black_livros_slug">Endereço</label></th>
					<td>
						<code><?php echo esc_html( trailingslashit( home_url() ) ); ?></code>
						<input name="<?php echo esc_attr( ENGETELES_BLACK_LIVROS_OPTION ); ?>" id="engeteles_black_livros_slug" type="text" class="regular-text" value="<?php echo esc_attr( $slug ); ?>">
						<p class="description">Não precisa criar páginas no WordPress: o plugin atende esses endereços sozinho. Evite usar o endereço de uma página que já existe.</p>
						<ul>
							<?php foreach ( array_keys( $routes ) as $sub ) : ?>
								<?php $url = home_url( '/' . $slug . '/' . ( '' !== $sub ? $sub . '/' : '' ) ); ?>
								<li><a href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener"><?php echo esc_html( $url ); ?></a></li>
							<?php endforeach; ?>
						</ul>
					</td>
				</tr>
			</table>
			<?php submit_button(); ?>
		</form>
	</div>
	<?php
}

function engeteles_black_livros_action_links( $links ) {
	array_unshift( $links, '<a href="' . esc_url( admin_url( 'options-general.php?page=engeteles-black-livros' ) ) . '">Configurações</a>' );
	return $links;
}
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'engeteles_black_livros_action_links' );
