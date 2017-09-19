/**
 * Declare our required plugins
 */
var gulp			= require( 'gulp' ),
	composer		= require( 'gulp-composer' ),
	del				= require( 'del' ),
	merge			= require( 'merge-stream' ),
	sass			= require( 'gulp-sass' ),
	rename			= require( 'gulp-rename' ),
	uglify			= require( 'gulp-uglify' ),
	concat			= require( 'gulp-concat' ),
	postcss			= require( 'gulp-postcss' ),
	autoprefixer	= require( 'autoprefixer' ),
	csswring		= require( 'csswring' ),
	sourcemaps		= require( 'gulp-sourcemaps' ),
	plumber			= require( 'gulp-plumber' ),
	gutil			= require( 'gulp-util' ),
	sequence		= require( 'run-sequence' ),
	shell			= require( 'gulp-shell' ),
	deporder		= require( 'gulp-deporder' ),
	jshint			= require( 'gulp-jshint' ),
	refresh			= require( 'gulp-refresh' );


/**
 * Directories
 */
var paths = {
	web:			__dirname + '/web',
	src:			__dirname + '/src',
	project:		'##PROJECT##'
}


/**
 * clean
 * Remove the web directory.
 */
gulp.task( 'clean', function() {

	return del( [
		paths.web + '/wp-content/themes/' + paths.project,
		paths.web + '/wp-content/mu-plugins/' + paths.project
	] ).then( paths => {

		if ( 0 < paths.length ) {

			console.log( 'Web directory (', paths, ') deleted.' );
		}
	});
});


/**
 * composer
 * Install the required composer packages.
 */
gulp.task( 'composer', function() {

	return composer();
});


/**
 * copy-config
 * Copy the wp-config* files to web/.
 */
gulp.task( 'copy-config', function() {

	var streams = [];

	/** wp-config.php */

	streams.push(
		gulp.src( paths.src + '/wp-config.php' )
			.pipe( gulp.dest( paths.web ) )
	);

	/** wp-config-local.php */

	streams.push(
		gulp.src( paths.src + '/wp-config-local.php' )
			.pipe( gulp.dest( paths.web ) )
	);

	return merge( streams );
});


/**
 * css
 * Process Sass into unminified CSS with a sourcemap and minified CSS without
 * a sourcemap.
 */
gulp.task( 'css', [
	'css:unminified',
	'css:minified',
	'css:editor'
]);

// Unminified, sourcemapped

gulp.task( 'css:unminified', function() {

	var src		= paths.src + '/sass/' + paths.project + '.scss',
		dest	= paths.web + '/wp-content/themes/' + paths.project + '/css';

	return gulp.src( src )
		.pipe( plumber( function( err ) {
			gutil.beep();
			var errorText = err.message + "\n\n" + err.source;
			gutil.log( gutil.colors.red( errorText ) );
		}))
		.pipe( sourcemaps.init() )
		.pipe( sass() )
		.pipe( postcss([
			autoprefixer()
		]))
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest( dest ) )
		.pipe( refresh() );
});

// Minified, not sourcemapped

gulp.task( 'css:minified', function() {

	var src		= paths.src + '/sass/' + paths.project + '.scss',
		dest	= paths.web + '/wp-content/themes/' + paths.project + '/css';

	return gulp.src( src )
		.pipe( plumber() )
		.pipe( sass() )
		.pipe( postcss([
			autoprefixer(),
			csswring()
		]))
		.pipe( rename({
			suffix: '.min'
		}))
		.pipe( gulp.dest( dest ) );
});

// Editor

gulp.task( 'css:editor', function() {

	var src		= paths.src + '/sass/' + paths.project + '-editor.scss',
		dest	= paths.web + '/wp-content/themes/' + paths.project + '/css';

	return gulp.src( src )
		.pipe( plumber() )
		.pipe( sass() )
		.pipe( postcss([
			autoprefixer(),
			csswring()
		]))
		.pipe( rename({
			suffix: '.min'
		}))
		.pipe( gulp.dest( dest ) );
});

// Styleguide

gulp.task( 'css:styleguide', () => {

	var src		= paths.src + '/sass',
		dest	= paths.web + '/styleguide',
		css		= '/wp-content/themes/' + paths.project + '/css/' + paths.project + '.css';

	return gulp.src( '', { read: false } )
		.pipe( shell(
			__dirname + '/node_modules/kss/bin/kss --source ' + src + ' --destination ' + dest + ' --css ' + css
		))
		.pipe( refresh() );
});


/**
 * js
 * Process custom front-end and admin JavaScript into a single concatenated file,
 * and an uglified version for production.
 */
gulp.task( 'js', [
	'js:front-end',
	'js:admin',
	'js:plugins',
	'js:header'
]);

gulp.task( 'js:front-end', function() {

	var src		= paths.src + '/js',
		dest	= paths.web + '/wp-content/themes/' + paths.project + '/js';

	return gulp.src( src + '/front-end/**/*.js' )
		.pipe( plumber() )
		.pipe( deporder() )
		.pipe( jshint() )
		.pipe( jshint.reporter( 'default' ) )
		.pipe( concat( paths.project + '.js' ) )
		.pipe( gulp.dest( dest ) )
		.pipe( uglify() )
		.pipe( rename({
			suffix: '.min'
		}))
		.pipe( gulp.dest( dest ) )
		.pipe( refresh() );
});

gulp.task( 'js:admin', function() {

	var src		= paths.src + '/js',
		dest	= paths.web + '/wp-content/themes/' + paths.project + '/js';

	return gulp.src( src + '/admin/**/*.js' )
		.pipe( plumber() )
		.pipe( deporder() )
		.pipe( concat( paths.project + '-admin.js' ) )
		.pipe( gulp.dest( dest ) )
		.pipe( uglify() )
		.pipe( rename({
			suffix: '.min'
		}))
		.pipe( gulp.dest( dest ) )
});

gulp.task( 'js:plugins', function() {

	var src		= paths.src + '/js',
		dest	= paths.web + '/wp-content/themes/' + paths.project + '/js';

	return gulp.src( src + '/plugins/**/*.js' )
		.pipe( concat( paths.project + '-plugins.js' ) )
		.pipe( gulp.dest( dest ) )
		.pipe( uglify() )
		.pipe( rename({
			suffix: '.min'
		}))
		.pipe( gulp.dest( dest ) )
});

gulp.task( 'js:header', function() {

	var src		= paths.src + '/js',
		dest	= paths.web + '/wp-content/themes/' + paths.project + '/js';

	return gulp.src( src + '/header/**/*' )
		.pipe( plumber() )
		.pipe( deporder() )
		.pipe( concat( paths.project + '-header.js' ) )
		.pipe( gulp.dest( dest ) )
		.pipe( uglify() )
		.pipe( rename({
			suffix: '.min'
		}))
		.pipe( gulp.dest( dest ) )
		.pipe( refresh() );
});


/**
 * theme
 * Copy the theme files.
 */
gulp.task( 'theme', function() {

	var src		= paths.src + '/theme/**/*',
		dest	= paths.web + '/wp-content/themes/' + paths.project;

	return gulp.src( src )
		.pipe( gulp.dest( dest ) );
});


/**
 * plugin
 * Build the project-specific plugin.
 */
gulp.task( 'plugin', function() {

	var src		= paths.src + '/plugin/**/*',
		dest	= paths.web + '/wp-content/mu-plugins/' + paths.project;

	gulp.src( src )
		.pipe( gulp.dest( dest ) );

	// Build the loader files, using mu-plugin.php as a template

	src		= paths.src + '/' + paths.project + '/plugin';
	dest	= paths.web + '/wp-content/mu-plugins';

	return gulp.src([ paths.src + '/mu-plugin.php' ])
		.pipe( rename( paths.project + '.php' ) )
		.pipe( gulp.dest( dest ) );
});


/**
 * default
 * composer, copy-config, css, js, theme, and plugin tasks.
 * Using the run-sequence plugin, because composer has been giving
 * me fits about installing wordpress core when run concurrently
 * with the copy-config task.
 */
gulp.task( 'default', function( callback ) {

	sequence(
		'composer',
		'copy-config',
		[ 'css', 'js', 'theme', 'plugin' ],
		callback
	);
});


/**
 * watch
 * Watch files that require a task to act on them.
 */
gulp.task( 'watch', [ 'default' ], function() {

	refresh.listen();
	gulp.watch( paths.src + '/sass/**/*.scss',	[ 'css' ] );
	gulp.watch( paths.src + '/js/**/*.js',		[ 'js' ] );
	gulp.watch( paths.src + '/theme/**/*',		[ 'theme' ] );
	gulp.watch( paths.src + '/plugin/**/*',		[ 'plugin' ] );
});
