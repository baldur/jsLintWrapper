var CONF = {
    SETTINGS : {
        // ignore files relative path as it shows up in stdout and then give a reason "must eval to true"
        ignore : {
            'some_path/file_to_ignore.js' : 'tell me son ... what is on your mind'
        },

        // folders to include or exlucde
        ignoreDirs : {
            "./lib/external"       : true,
            "public"               : false, 
            "vendor"               : true, 
            "app"                  : false, 
            "test"                 : true,
            "tmp"                  : true
        },

        // this date will make files older be ignored
        // but if they are modified we check them again
        forgiveOlderThan : new Date( "17 December 2010" ),
        
        // errors we choose to ignore
        // add your own to getinto a habbit of clean running
        okErrors : {
            "Expected an identifier and instead saw 'undefined' (a reserved word)."  : true,
            "Use '===' to compare with 'null'."                                      : true,
            "Use '!==' to compare with 'null'."                                      : true,
            "Expected an assignment or function call and instead saw an expression." : true,
            "Expected a 'break' statement before 'case'."                            : true,
            "'e' is already defined."                                                : true
        }
    }
};

