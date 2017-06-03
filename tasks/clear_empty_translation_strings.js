'use strict';

module.exports = function (grunt) {

    grunt.registerMultiTask('clearEmptyTranslationStrings', 'Clear empty keys in translation files', function () {

        // Shorcuts!
        var _file = grunt.file;

        // Declare all var from configuration
        var files = _file.expand(this.data.src);

        // Parse all files to extract translations with defined regex
        files.forEach(function (file) {

            grunt.log.writeln("Process file: " + file);
            var content = _file.read(file);
            //grunt.log.writeln(content);
            var obj = JSON.parse(content);
            //grunt.log.writeln(obj);
            var counter = 0;
            for (var k in obj) {
                if (obj.hasOwnProperty(k) && obj[k] == "") {
                    //grunt.log.writeln(k);
                    delete obj[k];
                    counter++;
                }
            }

            _file.write(file, JSON.stringify(obj, null, '\t'));

            grunt.log.writeln("Deleted : " + counter + " keys");

        });
    });
};
