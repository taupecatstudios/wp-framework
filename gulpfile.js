/**
 * Declare our required plugins
 */
var gulp			= require( 'gulp' ),
	composer		= require( 'gulp-composer' ),
	del				= require( 'del' ),
	merge			= require( 'merge-stream' ),
	argv			= require( 'yargs' ).argv,
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
	replace			= require( 'gulp-replace' ),
	gfs				= require( 'graceful-fs' ),
	unzip			= require( 'gulp-unzip' ),
	shell			= require( 'gulp-shell' ),
	git				= require( 'gulp-git' ),
	deporder		= require( 'gulp-deporder' ),
	livereload		= require( 'gulp-livereload' );


/**
 * Directories
 */
var dist			= __dirname + '/dist',
	src				= __dirname + '/src',
	project			= 'wp-framework';


/**
 * clean
 * Remove the dist directory.
 */
gulp.task( 'clean', function() {

	return del( dist ).then( paths => {

		if ( 0 < paths.length ) {

			console.log( 'Distribution directory (', paths, ') deleted.' );
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
 * Copy wp-config.php to dist/wp-config.php and the appropriate wp-config-{env}.php
 * file to dist/wp-config-local.php.
 */
gulp.task( 'copy-config', function() {

	var streams = [];

	/** index.php (for WordPress in a subdirectory) */

	streams.push(
		gulp.src( __dirname + '/src/index.php' )
			.pipe( gulp.dest( __dirname + '/dist' ) )
	);

	/** wp-config.php */

	streams.push(
		gulp.src( __dirname + '/src/wp-config.php' )
			.pipe( gulp.dest( __dirname + '/dist' ) )
	);

	/** wp-config-local.php */

	streams.push(
		gulp.src( __dirname + '/src/wp-config-local.php' )
			.pipe( gulp.dest( __dirname + '/dist' ) )
	);

	return merge( streams );
});


/**
 * uploads
 * Link /uploads directory.
 */
gulp.task( 'uploads', function() {

	/** Only run in development */

	if ( ! argv.prod && ! argv.production && ! argv.stage && ! argv.staging ) {

		if ( ! gfs.existsSync( __dirname + '/dist/wp-content/uploads' ) ) {

			if ( ! gfs.existsSync( __dirname + '/dist/wp-content' ) ) {

				if ( ! gfs.existsSync( __dirname + '/dist' ) ) {

					gfs.mkdirSync( __dirname + '/dist' );

				}

				gfs.mkdirSync( __dirname + '/dist/wp-content' );
			}

			return gulp.src( __dirname )
				.pipe( shell( 'ln -s ../../uploads dist/wp-content/uploads' ) );
		}
	}

	return false;
});


/**
 * css
 * Process Sass into unminified CSS with a sourcemap and minified CSS without
 * a sourcemap.
 */
gulp.task( 'css', [ 'css:unminified', 'css:minified', 'css:styleguide' ] );

gulp.task( 'css:unminified', function() {

	var src		= __dirname + '/src/sass/**/*.scss',
		dest	= __dirname + '/dist/wp-content/themes/' + project + '/css';

	// Unminified, sourcemapped

	return gulp.src( src )
		.pipe( plumber( function( err ) {
			gutil.beep();
			var errorText = err.message + "\n\n" + err.source;
			gutil.log( gutil.colors.red( errorText ) );
		}))
		.pipe( sourcemaps.init() )
		.pipe( sass.sync() )
		.pipe( postcss([
			autoprefixer()
		]))
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest( dest ) )
		.pipe( livereload() );
});

gulp.task( 'css:minified', function() {

	var src		= __dirname + '/src/sass/**/*.scss',
		dest	= __dirname + '/dist/wp-content/themes/' + project + '/css';

	// Minified, not sourcemapped

	return gulp.src( src )
		.pipe( plumber() )
		.pipe( sass.sync() )
		.pipe( postcss([
			autoprefixer(),
			csswring()
		]))
		.pipe( rename({
			suffix: '.min'
		}))
		.pipe( gulp.dest( dest ) );
});

gulp.task( 'css:styleguide', () => {

	var src		= __dirname + '/src/sass',
		dest	= __dirname + '/dist/styleguide',
		css		= [
			'https://fonts.googleapis.com/css?family=Oswald:500\\&subset=latin-ext',
			'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
			'/wp-content/themes/' + project + '/css/' + project + '.css'
		];

	return gulp.src( '', { read: false } )
		.pipe( shell(
			__dirname + '/node_modules/kss/bin/kss --source ' + src + ' --destination ' + dest + ' --css ' + css[0] + ' --css ' + css[1] + ' --css ' + css[2]
		))
		.pipe( livereload() );
});


/**
 * js
 * Process custom front-end and admin JavaScript into a single concatenated file,
 * and an uglified version for production.
 */
gulp.task( 'js', [ 'js:front-end', 'js:admin', 'js:plugins', 'js:header' ] );

gulp.task( 'js:front-end', function() {

	var src		= __dirname + '/src/js',
		dest	= __dirname + '/dist/wp-content/themes/' + project + '/js';

	return gulp.src( src + '/front-end/**/*.js' )
		.pipe( plumber() )
		.pipe( deporder() )
		.pipe( concat( project + '.js' ) )
		.pipe( gulp.dest( dest ) )
		.pipe( uglify() )
		.pipe( rename({
			suffix: '.min'
		}))
		.pipe( gulp.dest( dest ) )
		.pipe( livereload() );
});

gulp.task( 'js:admin', function() {

	var src		= __dirname + '/src/js',
		dest	= __dirname + '/dist/wp-content/themes/' + project + '/js';

	return gulp.src( src + '/admin/**/*.js' )
		.pipe( plumber() )
		.pipe( deporder() )
		.pipe( concat( project + '-admin.js' ) )
		.pipe( gulp.dest( dest ) )
		.pipe( uglify() )
		.pipe( rename({
			suffix: '.min'
		}))
		.pipe( gulp.dest( dest ) )
});

gulp.task( 'js:plugins', function() {

	var src		= __dirname + '/src/js',
		dest	= __dirname + '/dist/wp-content/themes/' + project + '/js';

	return gulp.src( src + '/plugins/**/*.js' )
		.pipe( concat( project + '-plugins.js' ) )
		.pipe( gulp.dest( dest ) )
		.pipe( uglify() )
		.pipe( rename({
			suffix: '.min'
		}))
		.pipe( gulp.dest( dest ) )
});

gulp.task( 'js:header', function() {

	var src		= __dirname + '/src/js',
		dest	= __dirname + '/dist/wp-content/themes/' + project + '/js';

	return gulp.src( src + '/header/**/*' )
		.pipe( plumber() )
		.pipe( deporder() )
		.pipe( concat( project + '-header.js' ) )
		.pipe( gulp.dest( dest ) )
		.pipe( uglify() )
		.pipe( rename({
			suffix: '.min'
		}))
		.pipe( gulp.dest( dest ) )
		.pipe( livereload() );
});


/**
 * theme
 * Copy the theme files.
 */
gulp.task( 'theme', function() {

	var src		= __dirname + '/src/theme/**/*',
		dest	= __dirname + '/dist/wp-content/themes/' + project;

	return gulp.src( src )
		.pipe( gulp.dest( dest ) )
		.pipe( livereload() );
});


/**
 * plugin
 * Build the project-specific plugin.
 */
gulp.task( 'plugin', function() {

	var src		= __dirname + '/src/plugin/**/*',
		dest	= __dirname + '/dist/wp-content/mu-plugins/' + project;

	gulp.src( src )
		.pipe( gulp.dest( dest ) );

	// Build the loader files, using mu-plugin.php as a template

	src		= __dirname + '/src/' + project + '/plugin';
	dest	= __dirname + '/dist/wp-content/mu-plugins';

	return gulp.src([ __dirname + '/src/mu-plugin.php' ])
		.pipe( rename( project + '.php' ) )
		.pipe( gulp.dest( __dirname + '/dist/wp-content/mu-plugins' ) )
		.pipe( livereload() );
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
		'uploads',
		[ 'css', 'js', 'theme', 'plugin' ],
		callback
	);
});


/**
 * watch
 * Watch files that require a task to act on them.
 */
gulp.task( 'watch', function() {

	livereload.listen();
	gulp.watch( src + '/sass/**/*.scss',	[ 'css' ] );
	gulp.watch( src + '/js/**/*.js',		[ 'js' ] );
	gulp.watch( src + '/theme/**/*',		[ 'theme' ] );
	gulp.watch( src + '/plugin/**/*',		[ 'plugin' ] );
	gulp.watch( src + '/wp-config/*',		[ 'copy-config' ] );
});


/**
 * deploy
 * Deploy application to AWS via CodeBuild.
 *
 * TODO!
 */
gulp.task( 'deploy', function( callback ) {

	if ( ( ! argv.stage ) && ( ! argv.staging ) ) {

		// set argv to be prod by default if not already set to staging
		argv.prod = true;
	}

	// run the default task
	sequence(
		'default',
		callback
	);
});
