import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

// Build



gulp.task('build', () => {
  let autoprefixer = require('autoprefixer');
  let reporter = require('postcss-reporter');
  let cssnano = require('cssnano');

  const autoprefixerBrowsers = [
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

  const processors = [
    autoprefixer(autoprefixerBrowsers),
    reporter({ clearMessages: true })
  ];

  const errorHandler = err => {
    $.util.log($.util.colors.red(`Error (${err.plugin}): ${err.message}`));
  };

  return gulp.src('./src/composition.css')
    .pipe($.plumber({ errorHandler }))
    .pipe($.newer('dist'))
    .pipe($.postcss(processors))
    .pipe($.license('MIT', {tiny: true}))
    .pipe(gulp.dest('dist'))
    .pipe($.if('*.css', $.postcss([ cssnano({discardComments: {removeAll: true} })])))
    .pipe($.size({title: 'styles'}))
    .pipe($.rename({suffix: ".min"}))
    .pipe(gulp.dest('dist'));
});
