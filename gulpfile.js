const gulp = require("gulp"),
    argv = require("yargs").argv,
    autoprefixer = require("gulp-autoprefixer"),
    browserSync = require("browser-sync").create(),
    cleanCss = require("gulp-clean-css"),
    del = require("del"),
    gulpIf = require("gulp-if"),
    htmlPrettify = require("gulp-html-prettify"),
    imagemin = require("gulp-imagemin"),
    imageminJpegRecompress = require("imagemin-jpeg-recompress"),
    nunjucks = require("gulp-nunjucks"),
    plumber = require("gulp-plumber"),
    postCss = require("gulp-postcss"),
    postCssImport = require("postcss-import"),
    postCssLost = require("lost"),
    postCssShort = require("postcss-short"),
    pug = require("gulp-pug"),
    rename = require("gulp-rename"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    svgSprite = require("gulp-svg-sprite"),
    webpack = require("webpack"),
    webpackConfig = require("./webpack.config.js"),
    webpackStream = require("webpack-stream");


// Configs
const config = {
    runOnBuild: [
        "pug",
        "nunjucks",
        "css",
        "js",
        "imagemin",
        "svg-sprite",
        "fonts",
        "json",
        "xml",
        "static_files"
    ],
    path: {
        source: "src",
        dist: "docs"  // "Docs" because it's supports by GitHub Pages
    },

    // This var is for activating the source maps
    isDevelopment: argv.N || argv["nosourcemaps"] ? false : true,

    plumber: {
        errorHandler: console.error
    }
};

config.postCss = {
    plugins: [
        postCssImport({
            addModulesDirectories: ["node_modules"]
        }),
        postCssLost({
            flexbox: "flex",
            rounder: 100
        }),
        postCssShort({
            prefix: "x"
        }),
    ],
    config: null
};


const paths = {
    // We are watching all files for changes but build only those
    // which are in "build" path
    build: {
        css: `${config.path.source}/css/*.{sass,scss}`,
        fonts: `${config.path.source}/fonts/**/*`,
        img: `${config.path.source}/img/**/*`,
        js: `${config.path.source}/js/*.js`,
        nunjucks: `${config.path.source}/*.{njk,html}`, // For enabling IDE support look https://github.com/mozilla/nunjucks/issues/472#issuecomment-123219907
        pug: `${config.path.source}/*.{jade,pug}`,
        svg: `${config.path.source}/svg/*.svg`,
        json: `${config.path.source}/**/*.json`,
        xml: `${config.path.source}/**/*.xml`,
        static_files: `${config.path.source}/static/**/*`,
    },

    watch: {
        css: `${config.path.source}/**/*.{sass,scss,css}`,
        fonts: `${config.path.source}/fonts/**/*`,
        img: `${config.path.source}/img/**/*`,
        js: `${config.path.source}/**/*.js`,
        nunjucks: `${config.path.source}/**/*.{njk,html}`,
        pug: `${config.path.source}/**/*.{jade,pug}`,
        svg: `${config.path.source}/svg/*.svg`,
        json: `${config.path.source}/**/*.json`,
        xml: `${config.path.source}/**/*.xml`,
        static_files: `${config.path.source}/static/**/*`,
    },

    // Part for browser-sync plugin
    sync: {
        watch: `${config.path.dist}/**/*.*`,
    }
};

// Tasks
gulp.task("browser-sync", () => {
    browserSync.init({
        server: {
            baseDir: config.path.dist,
            // Enable directory listening
            // Shows all files in directory that we serve
            directory: true
        },

        // Watch files for changes
        watch: true,

        // Add HTTP access control (CORS) headers to assets served by Browsersync
        cors: true,

        // Disable opening url in browser
        open: false,

        // Disable browser-sync's notification on page
        // As "Connected to BrowserSync", "Injected main.min.css", etc...
        notify: false,

        // Wait 0.5s before reloading the page
        reloadDebounce: 500
    });

    // BrowserSync's watcher
    // browserSync.watch(paths.sync.watch).on('change', browserSync.reload);
});


gulp.task("clean", () => {
    return del(`${config.path.dist}/**/*`);
});


gulp.task("css", () => {
    return gulp.src(paths.build.css, {base: config.path.source})
        .pipe(plumber(config.plumber))
        .pipe(gulpIf(config.isDevelopment, sourcemaps.init()))
        .pipe(sass({
            outputStyle: "compressed"
        }))
        .pipe(postCss(config.postCss.plugins, config.postCss.config))
        .pipe(autoprefixer())
        // Enable css minify only on production build
        // Disabled in development mode to save CPU resources
        .pipe(cleanCss({
            compatibility: "ie10",
            level: {
                2: {
                    all: true
                }
            }
        }))
        .pipe(rename({suffix: ".min"}))
        .pipe(gulpIf(config.isDevelopment, sourcemaps.write(".", {includeContent: false, sourceRoot: "/src"})))
        .pipe(gulp.dest(config.path.dist));
});


gulp.task("nunjucks", () => {
    return gulp.src(paths.build.nunjucks, {base: config.path.source})
        .pipe(nunjucks.compile()) // docs https://mozilla.github.io/nunjucks/
        // .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(rename({
            extname: ".html"
        }))
        .pipe(gulp.dest(config.path.dist))
});


gulp.task("pug", () => {
    return gulp.src(paths.build.pug, {base: config.path.source})
        .pipe(plumber(config.plumber))
        .pipe(pug({
            cache: true
        }))
        .pipe(htmlPrettify({
            indent_char: " ",
            indent_size: 4
        }))
        .pipe(gulp.dest(config.path.dist));
});


gulp.task("js", () => {
    // In future (v4.0.0) there will be webpack handler
    // wait a bit for it
    return gulp.src(paths.build.js, {base: config.path.source})
        .pipe(plumber(config.plumber))
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest(`${config.path.dist}/js/`));
});


gulp.task("imagemin", () => {
    return gulp.src(paths.build.img, {base: config.path.source})
        .pipe(plumber(config.plumber))
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imageminJpegRecompress({
                loops: 5,
                min: 65,
                max: 70,
                quality: "medium"
            }),
            imagemin.svgo(),
        ]))
        .pipe(gulp.dest(config.path.dist));
});


gulp.task("svg-sprite", () => {
    return gulp.src(paths.build.svg, {base: config.path.source})
        .pipe(plumber(config.plumber))
        .pipe(svgSprite({
            mode: {
                symbol: {
                    dest: "svg/",
                    sprite: "sprite.svg"
                }
            }
        }))
        .pipe(gulp.dest(config.path.dist))
});

gulp.task("fonts", () => {
    return gulp.src(paths.build.fonts, {base: config.path.source})
        .pipe(gulp.dest(config.path.dist));
});

gulp.task("json", () => {
    return gulp.src(paths.build.json, {base: config.path.source})
        .pipe(gulp.dest(config.path.dist));
});


gulp.task("xml", () => {
    return gulp.src(paths.build.xml, {base: config.path.source})
        .pipe(gulp.dest(config.path.dist));
});


gulp.task("static_files", () => {
    return gulp.src(paths.build.static_files, {base: config.path.source})
        .pipe(gulp.dest(config.path.dist));
});


// Watchers
gulp.task("watch", () => {
    gulp.watch(paths.watch.css, gulp.series("css"));
    gulp.watch(paths.watch.fonts, gulp.series("fonts"));
    gulp.watch(paths.watch.img, gulp.series("imagemin"));
    gulp.watch(paths.watch.js, gulp.series("js"));
    gulp.watch(paths.watch.nunjucks, gulp.series("nunjucks"));
    gulp.watch(paths.watch.pug, gulp.series("pug"));
    gulp.watch(paths.watch.svg, gulp.series("svg-sprite"));
    gulp.watch(paths.watch.json, gulp.series("json"));
    gulp.watch(paths.watch.xml, gulp.series("xml"));
    gulp.watch(paths.watch.static_files, gulp.series("static_files"));
});


// CLI tasks
gulp.task("build", gulp.series("clean", gulp.parallel(...config.runOnBuild)));
gulp.task("default", config.isDevelopment ? gulp.series("build", gulp.parallel("watch", "browser-sync")) : gulp.series("build"));


module.exports = {
    config: config
};
