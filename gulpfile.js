var gulp = require("gulp");
var browserSync = require("browser-sync");
var autoprefixer = require("gulp-autoprefixer");
var csscomb = require("gulp-csscomb");
var cssnano = require("gulp-cssnano");
var notify = require("gulp-notify");
var plumber = require("gulp-plumber");
var rename = require("gulp-rename");
var sass = require("gulp-sass")(require("sass")); // исправлено на новую версию Gulp
var sourcemaps = require("gulp-sourcemaps");

// Обработчик ошибок
var onError = function (err) {
  notify.onError({
    title: "Error",
    message: "<%= error %>",
  })(err);
  this.emit("end");
};

var plumberOptions = {
  errorHandler: onError,
};

var postCSSOptions = require("./config.postcss.json");
var autoprefixerOptions = postCSSOptions.autoprefixer;

// Задача для компиляции SASS
gulp.task("sass", function () {
  return gulp
    .src("_sass/screen.scss")
    .pipe(plumber(plumberOptions))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("css"));
});

// Задача для обработки CSS для dist
gulp.task("dist:css", function () {
  return gulp
    .src("_sass/hamburgers/hamburgers.scss")
    .pipe(sass())
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest("dist"))
    .pipe(csscomb(".csscomb.dist.json"))
    .pipe(cssnano())
    .pipe(rename("hamburgers.min.css"))
    .pipe(gulp.dest("dist"));
});

// Задача для слежения за изменениями файлов
gulp.task("watch", function () {
  var browserSyncConfig = require("./bs-config.js");

  browserSync.init(browserSyncConfig);

  gulp.watch("_sass/**/*.scss", gulp.series("sass"));
});

// Задача для сборки
gulp.task("build", gulp.series("sass"));

// Задача для сборки dist
gulp.task("dist", gulp.series("dist:css"));

// Задача по умолчанию
gulp.task("default", gulp.series("build", "watch"));
