module.exports = function(grunt) {

  grunt.initConfig({
    shell: {
      openDist: {
        command: 'open dist/index.html'
      },
      removeDist: {
        command: 'rm -rf dist'
      },
      generateSvgs: {
        command: 'mkdir -p tmp && ruby bin/generator.rb --xml tmp'
      },
      removeSvgs: {
        command: 'rm -rf tmp'
      },
      downloadLib: {
        command: 'curl https://raw.github.com/chrokh/svg-and-canvas-pattern-generator/master/lib/generator.rb -o bin/generator.rb'
      },
      chmodLib: {
        command: 'sudo chmod 755 bin/generator.rb'
      }
    },
    svg2png: {
      all: {
        files: [{ src: ['tmp/*.svg'], dest: 'dist/img/' }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-svg2png');

  grunt.registerTask('setup', ['shell:downloadLib', 'shell:chmodLib']);
  grunt.registerTask('open', ['shell:openDist']);
  grunt.registerTask('dist', [
    'shell:removeDist',
    'shell:generateSvgs',
    'svg2png:all',
    'shell:removeSvgs',
    'buildHtml',
    'open']);

  grunt.registerTask('buildHtml', function(){
    var done = this.async();
    var fs=require('fs'),
        path=require('path'),
        jsdom=require('jsdom');
    var dir=path.resolve('dist/img');

    fs.readdir(dir, function(err, files){
      if(err) return err;

      var fragment = '';
      files.forEach(function(file){
        fragment += '<img src="img/' + file + '">';
      });

      jsdom.env({
        file: './template.html',
        done: function(errors, window){
          window.document.getElementById('exercises').innerHTML = fragment;
          var data = '<!DOCTYPE html>' + window.document.innerHTML,
              file = path.resolve('dist/index.html');

          fs.writeFile(file, data, function(err) {
            if(err) return err;
            done("Building html: DONE");
          }); 
        }
      });
    });
  });
};
