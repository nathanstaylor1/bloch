module.exports = function(grunt) {
 grunt.initConfig({

     less: {
         development: {
             options: {
                 paths: ["assets/css"]
             },
             files: {"www/assets/css/main.css": "www/assets/less/main.less"}
         },
         production: {
             options: {
                 paths: ["assets/less"],
                 cleancss: true
             },
             files: {"www/assets/css/main.css": "www/assets/less/main.less"}
         }
     },
     watch: {
         files: ['www/assets/less/*','www/assets/less/includes/*','www/assets/less/includes/mixins/*'],
         tasks: ['less'],
         options: {
          livereload: true,
        }
    }
 });
 grunt.loadNpmTasks('grunt-contrib-less');
 grunt.loadNpmTasks('grunt-contrib-watch');
 grunt.registerTask('default', ['less']);
};