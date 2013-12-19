module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            base: {
                src: ['**/*.ts'],
                options: {
                    module: 'amd', //or commonjs
                    target: 'es5', //or es3
                    sourcemap: true,
                }
            }
        },
        durandal: {
            dist: {
                src: [
                    "app/**/*.js",
                    "app/**/*.html",
                    "scripts/knockout-3.0.0.js",
                    "scripts/knockout.validation.js",
                    "scripts/durandal/**/*.*"
                ],
                options: {
                    baseUrl: "app/",
                    mainPath: "app/main.js",
                    out: "app/main-built.js",
                    paths: {
                        'knockout': '../scripts/knockout-3.0.0',
                        'knockout.validation': '../scripts/knockout.validation'
                    },

                    uglify2: {
                        compress: {
                            global_defs: {
                                DEBUG: false
                            }
                        }
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-durandal');

    grunt.registerTask('default', ['typescript', 'durandal']);
}