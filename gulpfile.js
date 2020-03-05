const gulp = require("gulp");
const concat = require("gulp-concat");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber"); //prevent errors form breaking gulp watch
const gutil = require("gulp-util"); //prevent errors form breaking gulp watch
const autoprefixer = require("gulp-autoprefixer");
const pug = require("gulp-pug");
const sourcemaps = require("gulp-sourcemaps");
const minify = require("gulp-minify");
const imagemin = require("gulp-imagemin");
const connect = require("gulp-connect");

// convert pug file to html file
gulp.task("html", function() {
  gulp
    .src("src/html/*.pug")
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe(gulp.dest("dist"))
    .pipe(connect.reload());
});

// Optimize Images
gulp.task("imagemin", function() {
  gulp
    .src("src/imgs/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/imgs"));
});

// Minify js
gulp.task("js", function() {
  gulp
    .src("src/js/*.js")
    .pipe(concat("main.js"))
    .pipe(minify())
    .pipe(gulp.dest("dist/js"))
    .pipe(connect.reload());
});

// compile sass
gulp.task("sass", function() {
  gulp
    .src(["src/css/**/*.scss", "src/css/**/*.css"])
    //prevent errors form breaking gulp watch
    .pipe(
      plumber(function(error) {
        gutil.log(error.message);
        this.emit("end");
      })
    )
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(concat("main.css"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/css"))
    .pipe(connect.reload());
});

// livereload
gulp.task("connect", function() {
  connect.server({
    root: "dist",
    port: 3000,
    livereload: true
  });
});

gulp.task("watch", function() {
  gulp.watch("src/html/**/*.pug", ["html"]);
  gulp.watch("src/imgs/*", ["imagemin"]);
  gulp.watch(["src/css/**/*.scss", "src/css/**/*.css"], ["sass"]);
  gulp.watch("src/js/*.js", ["js"]);
});

gulp.task("default", ["watch", "connect"]);
