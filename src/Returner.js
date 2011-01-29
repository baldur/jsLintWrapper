var Returner = {
    verbose: true,
    report: [],
    collect: function() {
        if( this.verbose ){
            this.report.push( Array.prototype.join.call( arguments, ' ' ) );
        } 
    },
    print: function() {
        for(var i=0; i<this.report.length; i++) {
            print(this.report[i]);
        }
    }
};

