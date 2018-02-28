module.exports = function(grunt) {
  const config = {
    // Sass
    sass: {
      expanded: {
        options: {
          outputStyle: 'expanded',
          sourcemap: false,
        },
        files: {
          'dist/css/grace.css': 'src/scss/grace.scss',
        }
      },

      min: {
        options: {
          outputStyle: 'compressed',
          sourcemap: false,
        },
        files: {
          'dist/css/grace.min.css': 'src/scss/grace.scss',
        }
      },

      docs: {
        options: {
          outputStyle: 'compressed',
          sourcemap: false,
        },
        files: {
          'css/docs-grace.css': 'src/scss/docs-grace.scss'
        }
      }
    },

    // PostCss w/Autoprefixer
    postcss: {
      options: {
        processors: [
          require('autoprefixer')({
            browsers: [
              'last 2 versions',
              'Chrome >= 30',
              'Firefox >= 30',
              'ie >= 10',
              'Safari >= 8',
            ]
          })
        ]
      },
      expanded: {
        src: 'dist/css/grace.css'
      },
      min: {
        src: 'dist/css/grace.min.css'
      },
      docs: {
        src: 'css/docs-grace.css'
      },
    },

    // Watch
    watch: {
      sass: {
        files: ['src/scss/**/*'],
        tasks: ['sass_compile'],
        options: {
          interrupt: false,
          spawn: false,
        }
      }
    },

    // Concurrent
    concurrent: {
      options: {
        logConcurrentOutput: true,
        limit: 10,
      },
      monitor: {
        tasks: [
          'sass_compile',
          'watch:sass'
        ]
      }
    },

    notify: {
      sass_compile: {
        options: {
          enabled: true,
          message: 'Sass Compiled',
          title: "Grace",
          success: true,
          duration: 1
        }
      }
    }
  }

  grunt.initConfig(config);

  // Load Grunt tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-notify');

  // Register Tasks
  grunt.registerTask('sass_compile', ['sass:docs', 'postcss:docs', 'notify:sass_compile']);
  grunt.registerTask('monitor', ['concurrent:monitor']);
}