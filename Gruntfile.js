module.exports = function(grunt) {
    var platform = grunt.option('platform');
    var osPathMap = {
        'osx': {
            'nw': 'nw.js_package/nwjs-sdk-v0.22.3-osx-x64/nwjs.app/Contents/MacOS/nwjs',
            'nwjc': 'nw.js_package/nwjs-sdk-v0.22.3-osx-x64/nwjc'
        },
        'win32': {
            'nw': '"nw.js_package/nwjs-sdk-v0.22.3-win-ia32/nw.exe"',
            'nwjc': '"start nw.js_package/nwjs-sdk-v0.22.3-win-ia32/nwjc.exe"'
        },
        'win64': {
            'nw': '"nw.js_package/nwjs-sdk-v0.22.3-win-x64/nw.exe"',
            'nwjc': '"nw.js_package/nwjs-sdk-v0.22.3-win-x64/nwjc.exe"'
        }
    };

    switch (platform) {
        case "osx":
            break;
        case "win32":
            break;
        case "win64":
            break;
        default:
            grunt.fail.fatal("Use --platform argument to specify YOUR OS. Available arguments: osx, win32, win64");
    }


    var buildOptions = {
        options: {
            flavor: 'normal',
            version: '0.22.3',
            zip: false,
            macIcns: 'icons/icon.icns',
            macPlist: {
                'CFBundleIdentifier': 'IDENTIFY'
            },
            winIco: 'icons/icon.ico'
        },
        src: [
            'index.html',
            'package.json'
        ]
    };

    function clone(hash) {
        var json = JSON.stringify(hash);
        return JSON.parse(json);
    }

    var osxBuildOpts = clone(buildOptions);
    osxBuildOpts['options']['platforms'] = ['osx64'];

    var win32BuildOpts = clone(buildOptions);
    win32BuildOpts['options']['platforms'] = ['win32'];

    var win64BuildOpts = clone(buildOptions);
    win64BuildOpts['options']['platforms'] = ['win64'];

    var linux32BuildOpts = clone(buildOptions);
    linux32BuildOpts['options']['platforms'] = ['linux32'];

    var linux64BuildOpts = clone(buildOptions);
    linux64BuildOpts['options']['platforms'] = ['linux64'];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        shell: {
            run: {
                options: {
                    stdout: true,
                    execOptions: {
                        cwd: '.'
                    }
                },
                command: osPathMap[platform]['nw']+' --enable-logging=stderr .'
            },
            sign_mac: {
                options: {
                    stdout: true
                },
                command: [
                    'export IDENTITY=SOME KEY',
                    'export PARENT_PLIST=~/Jscode/nw_example/mas/parent.plist',
                    'export CHILD_PLIST=~/Jscode/nw_example/mas/child.plist',
                    'export APP_PATH=~/Jscode/nw_example/build/MyApp/osx64/MyApp.app',
                    //'codesign --deep -s $IDENTITY --entitlements $CHILD_PLIST $APP_PATH"/Contents/Versions/58.0.3029.110/nwjs Helper.app"',
                    'codesign --deep -s $IDENTITY --entitlements $PARENT_PLIST $APP_PATH'
                ].join('&&')
            },
            pkg_mac: {
                options: {
                    stdout: true
                },
                command: [
                    'export IDENTITY=SOME KEY',
                    'export APP_NAME=MyApp',
                    'export APP_PATH=~/Jscode/nw_example/build/MyApp/osx64/',
                    'cd $APP_DIR && productbuild --component "$APP_NAME.app" /Applications --sign $IDENTITY "$APP_NAME.pkg"'
                ].join('&&')
            },
        },
    });

    grunt.loadTasks('tasks');

    grunt.task.registerTask('deploy_and_build', [
        'nwjs:osx64',
    ]);

};