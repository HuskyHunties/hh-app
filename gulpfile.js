const gulp = require('gulp');
const ts = require('gulp-typescript');
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', () => {
  return tsProject.src()
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(sourcemaps.init())
    .pipe(tsProject())
  .pipe(sourcemaps.write('maps'))
  .pipe(gulp.dest('build'));
  
});

gulp.task('watch', gulp.series('scripts', () => {
  gulp.watch('src/**/*.ts', ['scripts']);
}));

gulp.task('assets', function() {
  return gulp.src(JSON_FILES)
  .pipe(gulp.dest('build'));
});

gulp.task('default', gulp.series('watch', 'assets'));

