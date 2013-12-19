module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            base: {
                src: ['BattcherIntel/**/*.ts'],
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
                    "BattcherIntel/app/**/*.js",
                    "BattcherIntel/app/**/*.html",
                    "BattcherIntel/scripts/knockout-3.0.0.js",
                    "BattcherIntel/scripts/knockout.validation.js",
                    "BattcherIntel/scripts/durandal/**/*.*"
                ],
                options: {
                    baseUrl: "BattcherIntel/app/",
                    mainPath: "BattcherIntel/app/main.js",
                    out: "BattcherIntel/app/main-built.js",
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