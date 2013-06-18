module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['index.js', 'Gruntfile.js', 'src/**/*.js', 'spec/**/*.js'],
      options: {
        browser: true
      }
    },
    uglify: {
      options: {
        banner: '/*! <= % pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        report: 'gzip'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    jasmine: {
      downshow: {
        src: 'src/**/*.js',
        options: {
          specs: 'spec/*.js'
        }
      }

    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.registerTask('default', ['jshint', 'uglify', 'jasmine']);
};


