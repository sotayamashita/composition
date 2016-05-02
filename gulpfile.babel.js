'use strict';

import gulp from 'gulp';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// Build

gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  const PROCESSORS = [
    require('postcss-import')(),
    require('postcss-extend')(),
    require('postcss-nested')(),
    require('postcss-apply')(),
    require("postcss-custom-properties")(),
    require('autoprefixer')(AUTOPREFIXER_BROWSERS),
    require('postcss-reporter')({ clearMessages: true })
  ];

  return gulp.src('./src/main.css')
    .pipe($.postcss(PROCESSORS))
    .pipe(gulp.dest('dest'))
    .pipe($.if('*.css', $.postcss([
      require('cssnano')({discardComments: {removeAll: true} })
    ])))
    .pipe($.rename({suffix: ".min"}))
    .pipe(gulp.dest('dest'))
    .pipe(gulp.dest('app'));
});

// Watch files for changes & reload
gulp.task('serve', ['styles'], () => {
  browserSync({
    notify: false,
    // Customize the Browsersync console logging prefix
    logPrefix: 'WSK',
    // Allow scroll syncing across breakpoints
    scrollElementMapping: ['main', '.mdl-layout'],

    server: ['.tmp', 'app'],
    port: 3000
  });

  gulp.watch(['app/index.html'], reload);
  gulp.watch(['src/**/*.css'], ['styles', reload]);
});
