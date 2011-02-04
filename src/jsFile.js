var jsFile = function( path ) {
    if( !path ) {
        throw( "file must have path" );
    }
    var filePath = path;
    var source = function() {
        codeSource = readFile( path );
        if( codeSource === "" ) {
            throw( "code source is empty" );
        }
        return codeSource;
    };
    var cachePath = function() {
        var dir = new java.io.File( "./tmp/cache" );
        dir.mkdir();
        return dir.getPath() + "/" + self.getPath().replace(/\//g,"_");
    };
    var cacheResults = function( results ) {
        var file = new java.io.File( cachePath() );
        var values = [ self.getFile().lastModified(), results ];
        var cacheValue = JSON.stringify( values );
        var output = new java.io.PrintWriter( file );
        output.print( cacheValue );
        output.flush();
        output.close();
    };
    var cached = function() {
        var file = new java.io.File( cachePath() );
        return file.isFile();
    };
    var useCached = function() {
        if( cached() ) {
            // TODO need to unmarshal/deserialize output
            var cachedContent = JSON.parse( readFile( cachePath() ) );
            if(self.getFile().lastModified() === cachedContent[0]) {
                return cachedContent[1];
            }
            else {
                return false;
            }
        } 
        else {
            return false;
        }
    };

    var self = {
        ignore : function() {
            if( typeof CONF.SETTINGS === "undefined" ) {
            }
            return CONF.SETTINGS.ignore[ self.getPath() ];
        },
        getPath : function() {
            return filePath;
        },
        getFile : function() {
            return new java.io.File( self.getPath() );
        },
        doLint : function() {
            if( useCached() ) {
                ret = useCached();
            }
            else {
                var results = JSLINT( source(), { evil: true, forin: true, maxerr: 500 } );

                var e = JSLINT.errors, found = 0, w;
                var message = "", lineNumber;

                for ( var i = 0; i < e.length; i++ ) {
                        w = e[i];

                        if ( !CONF.SETTINGS.okErrors[ w.reason ] ) {
                                found++;
                                message += "\n\tREASON:" + w.reason     + "\n";
                                message += "\t\t" + "\n" + w.evidence + "\n";
                                message += "\t\t" +    "Problem at line " + w.line + " character " + w.character + ": " + w.reason;
                                lineNumber = w.line;
                        }
                }

                if ( found > 0 ) {
                        message += "\n\t\t\t" + found + " Error(s) found.";
                        ret = [ "failed", filePath, message, lineNumber ];
                } else {
                        ret = [ "passed", filePath ];
                }
                cacheResults( ret );
            }
            return ret;
        }
    };
    return self;
};

