const gulp = require('gulp'),
	bourbon = require('node-bourbon'),
	browserSync = require('browser-sync').create(),
	cleanCss = require('gulp-clean-css'),
	imagemin = require('gulp-imagemin')
	imageminJpegRecompress = require('imagemin-jpeg-recompress'),
	notify = require('gulp-notify'),
	pug = require('gulp-pug'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass');


config = {
	dist_dir: 'dist',
	src_dir: 'src',
	run_on_start: ['sass', 'pug', 'move_html_to_dist', 'move_js_to_dist', 'imagemin']
}


config.images_dist = `${config.dist_dir}/img`;
config.images_src = `${config.src_dir}/img`;


patterns = {
	dist: `${config.dist_dir}/**/*`,
	sass: `${config.src_dir}/**/*.{sass,scss}`,
	pug: `${config.src_dir}/*.{jade,pug}`,
	pug_files: `${config.src_dir}/**/*.{jade,pug}`,
	html: `${config.src_dir}/*.html`,
	js: `${config.src_dir}/**/*.js`,
	img: `${config.images_src}/**/*`
}


gulp.task('browser-sync', () => {
	browserSync.init({
		server: {
			baseDir: config['dist_dir']
		},

		notify: false
	});
});


gulp.task('sass', () => {
	return gulp.src(patterns.sass)
		.pipe(sass({
			outputStyle: 'compressed',
			includePaths: bourbon.includePaths
		}).on("error", notify.onError()))
		.pipe(cleanCss({
			compatibility: 'ie8',
			level: 2
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(`${config.dist_dir}`))
})


gulp.task('pug', () => {
	return gulp.src(patterns.pug)
		.pipe(pug({
			pretty: '\t'
		}).on('error', notify.onError()))
		.pipe(gulp.dest(`${config.dist_dir}`))
})


gulp.task('move_html_to_dist', () => {
	return gulp.src(patterns.html)
		.pipe(gulp.dest(`${config.dist_dir}`))
})


gulp.task('move_js_to_dist', () => {
	return gulp.src(patterns.js)
		.pipe(gulp.dest(`${config.dist_dir}`))
})


gulp.task('imagemin', () => {
	return gulp.src(patterns.img)
		.pipe(imagemin([
			imagemin.gifsicle({interlaced: true}),
			imagemin.jpegtran({progressive: true}),
			imageminJpegRecompress({
				loops: 5,
				min: 65,
				max: 70,
				quality:'medium'
			}),
	    	imagemin.svgo(),
	    	imagemin.optipng({optimizationLevel: 3})
	    ]))
		.pipe(gulp.dest(`${config.images_dist}`))
})


gulp.task('sync', () => {
	return gulp.src(patterns.dist)
		.pipe(browserSync.stream());
})


gulp.task('watch', config.run_on_start.concat(['browser-sync']), () => {
	gulp.watch(patterns.dist, ['sync']);
	gulp.watch(patterns.sass, ['sass']);
	gulp.watch(patterns.pug, ['pug']);
	gulp.watch(patterns.pug_files, ['pug'], null)
	gulp.watch(patterns.html, ['move_html_to_dist']);
	gulp.watch(patterns.js, ['move_js_to_dist']);
	gulp.watch(patterns.img, ['imagemin']);
})

gulp.task('default', ['watch']);
gulp.task('build', config.run_on_start)
