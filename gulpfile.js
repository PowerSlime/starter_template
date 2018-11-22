const gulp = require('gulp'),
    argv = require('yargs').argv,
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    cleanCss = require('gulp-clean-css'),
    del = require('del'),
    gulpIf = require('gulp-if'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    notify = require('gulp-notify'),
    nunjucks = require('gulp-nunjucks'),
    plumber = require('gulp-plumber'),
    pug = require('gulp-pug'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    ttf2eot = require('gulp-ttf2eot'),
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2'),
    svgSprite = require('gulp-svg-sprite');


// Configs
const config = {
    runOnBuild: ['pug', 'nunjucks', 'css', 'js', 'imagemin', 'svg-sprite', 'ttf-move', 'ttf2woff', 'ttf2eot'],
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
        fonts: `${config.path.source}/fonts/*.ttf`,
        img: `${config.path.source}/img/**/*`,
        js: `${config.path.source}/js/*`,
        nunjucks: `${config.path.source}/*.{njk,html}`, // For enabling IDE support look https://github.com/mozilla/nunjucks/issues/472#issuecomment-123219907
        pug: `${config.path.source}/*.{jade,pug}`,
        svg: `${config.path.source}/svg/*.svg`,
    },

    watch: {
        css: `${config.path.source}/**/*.{sass,scss}`,
        fonts: `${config.path.source}/fonts/*.ttf`,
        img: `${config.path.source}/img/**/*`,
        js: `${config.path.source}/**/*.js`,
        nunjucks: `${config.path.source}/**/*.{njk,html}`,
        pug: `${config.path.source}/**/*.{jade,pug}`,
        svg: `${config.path.source}/svg/*.svg`,
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
            baseDir: config.path.dist
        },

        // Add HTTP access control (CORS) headers to assets served by Browsersync
        cors: true,

        // Disable opening url in browser
        open: false,

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
            ]
        }))
        .pipe(autoprefixer())
        .pipe(cleanCss({
            compatibility: 'ie10',
            level: 2
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulpIf(config.isDevelopment, sourcemaps.write(".")))
        .pipe(gulp.dest(config.path.dist));
});


gulp.task('nunjucks', () => {
    return gulp.src(paths.build.nunjucks, {base: config.path.source})
        .pipe(nunjucks.compile()) // docs https://mozilla.github.io/nunjucks/
        // .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(rename({
            extname: '.html'
        }))
        .pipe(gulp.dest(config.path.dist))
});


gulp.task('pug', () => {
    return gulp.src(paths.build.pug, {base: config.path.source})
        .pipe(plumber(config.plumber))
        .pipe(pug({
            pretty: true
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
                quality: 'medium'
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


gulp.task('ttf-move', () => {
    return gulp.src(paths.build.fonts, {base: config.path.source, since: gulp.lastRun('ttf-move')})
        .pipe(gulp.dest(config.path.dist));
});


gulp.task('ttf2woff', () => {
    return gulp.src(paths.build.fonts, {base: config.path.source})
        .pipe(ttf2woff())
        .pipe(gulp.dest(config.path.dist));
});


gulp.task('ttf2woff2', () => {
    // Took a lot of time, run it manually if you need it
    // check http://socialcompare.com/en/comparison/browser-fonts-support-comparison
    return gulp.src(paths.build.fonts, {base: config.path.source})
        .pipe(ttf2woff2())
        .pipe(gulp.dest(config.path.dist));
});


gulp.task('ttf2eot', () => {
    return gulp.src(paths.build.fonts, {base: config.path.source})
        .pipe(ttf2eot())
        .pipe(gulp.dest(config.path.dist));
});


// Watchers
gulp.task('watch', () => {
    gulp.watch(paths.watch.css, gulp.series('css'));
    gulp.watch(paths.watch.fonts, gulp.parallel(['ttf-move', 'ttf2woff', 'ttf2eot']));
    gulp.watch(paths.watch.img, gulp.series('imagemin'));
    gulp.watch(paths.watch.js, gulp.series('js'));
    gulp.watch(paths.watch.nunjucks, gulp.series('nunjucks'));
    gulp.watch(paths.watch.pug, gulp.series('pug'));
    gulp.watch(paths.watch.svg, gulp.series('svg-sprite'));
});


// CLI tasks
gulp.task('build', gulp.series('clean', gulp.parallel(...config.runOnBuild)));
gulp.task('fonts:fast', gulp.parallel(['ttf-move', 'ttf2woff', 'ttf2eot']));
gulp.task('fonts:all', gulp.parallel(['ttf-move', 'ttf2woff', 'ttf2woff2', 'ttf2eot']));
gulp.task('default', config.isDevelopment ? gulp.series('build', gulp.parallel('watch', 'browser-sync')) : gulp.series('build'));
