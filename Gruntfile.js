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
          'docs/css/docs-grace.css': 'src/scss/docs-grace.scss'
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

    site: {
      docs: {
        options: {
          templates: 'src/docs/templates',
          defaultTemplate: 'default.html',
        },
        src: 'src/docs/pages',
        dest: 'docs',
      }
    },

    // Browser Sync
    browserSync: {
      bsFiles: ["css/docs-grace.css", "!**/node_modules/**/*"],
      options: {
        server: {
          baseDir: './docs'
        },
        port: 8000,
        ui: {
          port: 8080,
          weinre: {
            port: 9090,
          },
        },
        open: false
      }
    },

    // Watch
    watch: {
      docs: {
        files: ['src/docs/**/*'],
        tasks: ['docs_compile'],
        options: {
          interrupt: false,
          spawn: false,
        }
      },

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
          'docs_compile',
          'sass_compile',
          'watch:docs',
          'watch:sass',
          'notify:watching',
          'server',
        ]
      }
    },

    notify: {
      watching: {
        options: {
          enabled: true,
          message: 'Watching Files',
          title: 'Grace',
          success: true,
          duration: 1
        }
      },

      sass_compile: {
        options: {
          enabled: true,
          message: 'Sass Compiled',
          title: 'Grace',
          success: true,
          duration: 1
        }
      },

      docs_compile: {
        options: {
          enabled: true,
          message: 'Docs Compiled',
          title: 'Grace',
          success: true,
          duration: 1
        }
      },

      server: {
        options: {
          enabled: true,
          message: 'Server Running',
          title: 'Grace',
          success: true,
          duration: 1
        }
      },
    }
  }

  grunt.initConfig(config);

  // Load Grunt tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-markdown-site');

  // Register Tasks
  grunt.registerTask('docs_compile', ['site', 'notify:docs_compile']);
  grunt.registerTask('sass_compile', ['sass:docs', 'postcss:docs', 'notify:sass_compile']);
  grunt.registerTask('server', ['browserSync', 'notify:server']);
  grunt.registerTask('monitor', ['concurrent:monitor']);
}