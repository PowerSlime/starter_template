const gulp = require('gulp'),
    argv = require('yargs').argv,
    bourbon = require('node-bourbon'),
    browserSync = require('browser-sync').create(),
    cleanCss = require('gulp-clean-css'),
    del = require('del'),
    gulpIf = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    pug = require('gulp-pug'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    svgSprite = require('gulp-svg-sprite'),
    sass = require('gulp-sass');


// Configs
const config = {
    runOnBuild: ['html', 'css', 'js', 'imagemin', 'svg-sprite', 'fonts'],
    path: {
        source: 'src',
        dist: 'docs'  // "Docs" because it's supports by GitHub Pages
    },

    // This var is for activating the source maps
    isDevelopment: argv.N || argv['nosourcemaps'] ? false : true,

    plumber: {
        errorHandler: console.error // notify.onError()
    }
};


const paths = {
    // We are watching all files for changes but build only those
    // which are in "build" path
    build: {
        css: `${config.path.source}/css/*.{sass,scss}`,
        fonts: `${config.path.source}/fonts/**/*`,
        html: `${config.path.source}/*.{jade,pug}`,
        img: `${config.path.source}/img/**/*`,
        js: `${config.path.source}/js/*`,
        svg: `${config.path.source}/svg/*.svg`,
    },

    watch: {
        css: `${config.path.source}/**/*.{sass,scss}`,
        fonts: `${config.path.source}/fonts/**/*`,
        html: `${config.path.source}/**/*.{jade,pug}`,
        img: `${config.path.source}/img/**/*`,
        js: `${config.path.source}/**/*.js`,
        svg: `${config.path.source}/svg/*.svg`
    },

    // Part for browser-sync plugin
    sync: {
        watch: `${config.path.dist}/**/*.*`,
    }
};


// Tasks
gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: config.path.dist,
            middleware: function (req, res, next) {
                res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
                res.setHeader("Access-Control-Allow-Origin", "*");
                next();
            },
        },

        // Disable browser-sync's notification on page
        // As "Connected to BrowserSync", "Injected main.min.css", etc...
        notify: false
    });

    // BrowserSync's watcher
    browserSync.watch(paths.sync.watch).on('change', browserSync.reload);
});


gulp.task('clean', () => {
    return del(config.path.dist);
});


gulp.task('css', () => {
    return gulp.src(paths.build.css, {base: config.path.source})
        .pipe(plumber(config.plumber))
        .pipe(gulpIf(config.isDevelopment, sourcemaps.init()))
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: [
                './node_modules/'
                // bourbon.includePaths
            ]
        }))
        .pipe(cleanCss({
            compatibility: 'ie8',
            level: 2,
            rebaseTo: config.path.dist
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulpIf(config.isDevelopment, sourcemaps.write(".")))
        .pipe(gulp.dest(config.path.dist));
});


gulp.task('html', () => {
    return gulp.src(paths.build.html, {base: config.path.source})
        .pipe(plumber(config.plumber))
        .pipe(pug({
            pretty: false
        }))
        .pipe(gulp.dest(config.path.dist));
});


gulp.task('js', () => {
    // In future (v4.0.0) there will be webpack handler
    // wait a bit for it
    return gulp.src(paths.build.js, {base: config.path.source, since: gulp.lastRun('js')})
        .pipe(gulp.dest(config.path.dist));
});


gulp.task('imagemin', () => {
    return gulp.src(paths.build.img, {base: config.path.source, since: gulp.lastRun('imagemin')})
        .pipe(plumber(config.plumber))
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
        .pipe(gulp.dest(config.path.dist));
});


gulp.task('svg-sprite', () => {
    return gulp.src(paths.build.svg, {base: config.path.source})
        .pipe(plumber(config.plumber))
        .pipe(svgSprite({
            mode: {
                symbol: {
                    dest: 'svg/',
                    sprite: "sprite.svg"
                }
            }
        }))
        .pipe(gulp.dest(config.path.dist))
});


gulp.task('fonts', () => {
    return gulp.src(paths.build.fonts, {base: config.path.source})
        .pipe(gulp.dest(config.path.dist));
});

// Watchers
gulp.task('watch', () => {
    gulp.watch(paths.watch.css, gulp.series('css'));
    gulp.watch(paths.watch.html, gulp.series('html'));
    gulp.watch(paths.watch.js, gulp.series('js'));
    gulp.watch(paths.watch.img, gulp.series('imagemin'));
    gulp.watch(paths.watch.svg, gulp.series('svg-sprite'));
    gulp.watch(paths.watch.fonts, gulp.series('fonts'));
});


// CLI tasks
gulp.task('build', gulp.series('clean', gulp.parallel(...config.runOnBuild)));
gulp.task('default', config.isDevelopment ? gulp.series('build', gulp.parallel('watch', 'browser-sync')) : gulp.series('build'));
