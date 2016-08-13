var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    buffer = require('vinyl-buffer'),
    csso = require('gulp-csso'),
    imagemin = require('gulp-imagemin'),
    merge = require('merge-stream'),
    spritesmith = require('gulp.spritesmith');

// watch
gulp.task('watch', function(){
  gulp.watch('../src/scss/*.scss', ['sass']);
});

// sass
gulp.task('sass', function(){
  return gulp.src(['../src/scss/*.scss'])
             .pipe(sourcemaps.init())
             .pipe(sass().on('error', sass.logError))
             .pipe(autoprefixer({
               browsers: ['last 2 versions'],
               cascade: false
             }))
             .pipe(sourcemaps.write('./'))
             .pipe(gulp.dest('../src/css'));
});

// image-sprite
gulp.task('sprite', function() {
    var spriteData = gulp.src('../assets/img/before_images/*.png').pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.css',
      padding: 8,
      cssOpts: {
        cssSelector: function (item) {
          return '.sprite_' + item.name;
        }
      }
    }));
    // Pipe image stream through image optimizer and onto disk
    var imgStream = spriteData.img
      // DEV: We must buffer our stream into a Buffer for `imagemin`
      .pipe(buffer())
      .pipe(imagemin())
      .pipe(gulp.dest('../assets/img/'));
    // Pipe CSS stream through CSS optimizer and onto disk
    var cssStream = spriteData.css
      // .pipe(csso())
      .pipe(gulp.dest('../assets/css/'));
    // Return a merged stream to handle both `end` events
    return merge(imgStream, cssStream);
});
