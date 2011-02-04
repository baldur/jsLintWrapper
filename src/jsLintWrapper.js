var jsLintWrapper = (function () {
        // private attributes

        var problemFiles = [], 
                detailedFailReport = [];

        var buildReport = function( report ) { 
            var failedcount = 0, passedcount = 0;
            for(var i in report) {
                if( report[i][0] == "passed" ) {
                    passedcount++;
                } else if( report[i][0] == "failed" ) {
                    failedcount++;
                    details = { 'fileName'     : report[i][1],
                                            'message'        : report[i][2],
                                            'lineNumber' : report[i][3] };
                    detailedFailReport.push( details );
                    Returner.collect( "\n\n *****" );
                    Returner.collect( report[i][0], report[i][1], report[i][3], report[i][2] );
                }
            }
            Returner.collect( "\n" );
            Returner.collect( report.length        + " files checked\n" );
            Returner.collect( "\t"+passedcount + " files passed" );
            Returner.collect( "\t"+failedcount + " files failed\n" );
            self.failedcount = failedcount;
            self.passedcount = passedcount;

            Returner.collect( "\n These awesome files got caught in raised exception" );
            for( var y=0; y<problemFiles.length; y++ ) {
                Returner.collect( "filename: ", problemFiles[y][0], "\traised error: ", problemFiles[y][1] );
            }

            Returner.collect( "\n Files that are ignored in settings" );
            for( var key in CONF.SETTINGS.ignore ) {
                Returner.collect( "\t\treason: ", CONF.SETTINGS.ignore[ key ], "file: ", key );
            }
        };

        var generateReport = function( files ) {
            //here we can ask file if it wants to get processed
            var report = [];
            for( var i in files ) {
                if( files[i].ignore() ) {
                    Returner.collect( "IGNORED in settings ... reason: ", files[i].ignore() );
                    continue;
                }
                try {
                    if( files[i].getPath() !== "" ) {
                        var output = files[i].doLint();

                        report.push( output );
                        Returner.collect( output[0], "file:", "....", files[i].getPath() );
                    }
                } catch(e) {
                    Returner.collect( "FAILED!!", files[i].getPath(), "probably too much to handle or parse error", e );
                    problemFiles.push( [files[i].getPath(), e] );
                }
            }
            return report;
        };

        var rules = function( file ) {
            if( file.isDirectory() ) {
                return !( CONF.SETTINGS.ignoreDirs[ file.getName() ] || 
                          CONF.SETTINGS.ignoreDirs[ file ] );
            }
            else {
                return ( /\.js$/.test( file ) );
            }
        };

        var fileLister = function( dir, list ) {

            var filter = { 
                accept: function( file ) {
                    return rules( file );
                } 
            };

            jsFilter = new java.io.FileFilter( filter );

            var pathObject = new java.io.File( dir );
            if( pathObject.isFile() ) {
                return [ new jsFile( dir ) ];
            }
            var files = pathObject.listFiles( jsFilter );

            for( var index in files ) {
                var forgiveOlderThan = CONF.SETTINGS.forgiveOlderThan;
                var fileLastModified = new Date(files[index].lastModified());
                path = dir + "/";
                filepath = path + files[index].getName();
                if( files[index].isFile() && fileLastModified.getTime() > forgiveOlderThan.getTime() ) {
                    list.push( new jsFile( filepath ) );
                }
                else if( files[index].isDirectory() ) {
                    fileLister( filepath, list );
                }
            }
            return list;
        };

        var getSourceFiles = function( arg ) {
            // TODO ADD optional filters to include and exclude selected directories
            var path = arg ? arg : ".";
            return fileLister( path, [] );
        };

        var commandlineOptions = { 
            singleFile : false,
            verbose : true
        };

        //public
        var self = {
            failedcount: undefined,
            passcount: undefined,
            main : function( opts ) {
                for( var i in opts ) {
                    commandlineOptions[i] = opts[i];
                }

                Returner.verbose = commandlineOptions.verbose;

                var files = getSourceFiles( commandlineOptions.singleFile );
                var report = generateReport( files );

                buildReport( report );

                Returner.print();

                if( !commandlineOptions.verbose && jsLintWrapper.failedcount > 0 ) {
                    java.lang.System.exit(1);
                }

            }
        };

        return self;
})();

