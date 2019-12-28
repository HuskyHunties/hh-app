const gulp = require('gulp');
const ts = require('gulp-typescript');
const eslint = require('gulp-eslint');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', () => {
  const tsResult = tsProject.src()
  .pipe(eslint())
  .pipe(eslint.format())
  //.pipe(eslint.failAfterError())
  .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('build'));
});

gulp.task('watch', gulp.series('scripts', () => {
  gulp.watch('src/**/*.ts', ['scripts']);
}));

gulp.task('assets', function() {
  return gulp.src(JSON_FILES)
  .pipe(gulp.dest('build'));
});

gulp.task('default', gulp.series('watch', 'assets'));

