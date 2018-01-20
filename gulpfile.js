const gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	bourbon = require('node-bourbon'),
	browserSync = require('browser-sync').create(),
	imagemin = require('gulp-imagemin')
	imageminJpegRecompress = require('imagemin-jpeg-recompress'),
	jade = require('gulp-jade'),
	minifyCss = require('gulp-minify-css'),
	notify = require('gulp-notify'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass');


config = {
	dist_dir: 'dist',
	src_dir: 'src'
}


config.images_dist = `${config.dist_dir}/img`;
config.images_src = `${config.src_dir}/img`;


patterns = {
	sass: `${config.src_dir}/**/*.{sass,scss}`,
	jade: `${config.src_dir}/*.jade`,
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
		.pipe(minifyCss())
		.pipe(autoprefixer({browsers: ['last 5 versions']}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(`${config.dist_dir}`))
		.pipe(browserSync.stream());
})


gulp.task('jade', () => {
	return gulp.src(patterns.jade)
		.pipe(jade({
			pretty: true
		}).on("error", notify.onError()))
		.pipe(gulp.dest(`${config.dist_dir}`))
		.pipe(browserSync.stream());
})


gulp.task('move_html_to_dist', () => {
	return gulp.src(patterns.html)
		.pipe(gulp.dest(`${config.dist_dir}`))
		.pipe(browserSync.stream());
})


gulp.task('move_js_to_dist', () => {
	return gulp.src(patterns.js)
		.pipe(gulp.dest(`${config.dist_dir}`))
		.pipe(browserSync.stream());
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
		.pipe(browserSync.stream());
})


gulp.task('watch', ['browser-sync'], () => {
	gulp.watch(patterns.sass, ['sass']);
	gulp.watch(patterns.jade, ['jade']);
	gulp.watch(patterns.html, ['move_html_to_dist']);
	gulp.watch(patterns.js, ['move_js_to_dist']);
	gulp.watch(patterns.img, ['imagemin']);
})

gulp.task('default', ['watch']);
