module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ''
            },
            dist: {
                files: {
                    'dist/js/stacklayout.js': ['js/stacklayout.js']
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            dist: {
                files: {
                    'dist/js/stacklayout.min.js': ['dist/js/stacklayout.js']
                }
            }
        },
        sass: {
            options: {
                implementation: require('node-sass'),
                outputStyle: 'expanded'
            },
            dist: {
                files: {
                    'dist/css/stacklayout.css': ['scss/stacklayout.scss']
                }
            }
        },
        cssmin: {
            options: {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            dist: {
                files: {
                    'dist/css/stacklayout.min.css': ['dist/css/stacklayout.css']
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'js/**/*.js'],
            options: {
                //jQuery: true,
                //console: true,
                //module: true,
                //document: true
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', [
        'jshint',
        'concat',
        'uglify',
        'sass',
        'cssmin'
    ]);
};
