module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            buildall:{
                options:{
                    mangle:true,
                    compress:{
                        drop_console:true
                    },
                    report:"min"
                },
                files:[{
                    expand:true,
                    cwd:"src/js",//js目录下
                    src:"**/*.js",//所有js文件
                    dest:"dist/js",//输出到此目录
                    ext:".min.js"
                }]
            }
        },
        //cssmin: {
        //    target: {
        //        files: [{
        //            expand: true,
        //            cwd: 'src/css',
        //            src: "**/*.css",
        //            dest: 'dist/css',
        //            ext: '.min.css'
        //        }]
        //    }
        //},
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                //这里是覆盖JSHint默认配置的选项
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        watch: {
            //files: ['<%= jshint.files %>'],
            //tasks: ['jshint', 'qunit']
            css: {
                files: 'src/css/*.css',
                tasks: ['css'],
                options: {
                    livereload: true,
                },
            },
            scripts:{
                files:['src/js/*.js'],
                tasks:['minall'],
                options:{
                    spawn:true,
                    interrupt:true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    //grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('minall', ['uglify:buildall']);
    //grunt.registerTask('css', ['cssmin:target']);
    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('full', ['jshint' , 'concat', 'uglify']);
    grunt.registerTask('default', ['concat', 'uglify']);

};