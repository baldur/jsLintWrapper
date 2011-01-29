load( '../lib/external/json2.js' );
load( '../lib/external/jslint.js' );
load( '../src/Returner.js' );
load( '../src/jsFile.js' );
load( '../src/jsLintWrapper.js' );
load( '../conf/settings.js' );

jsLintWrapper.main( eval(arguments[0]) );

