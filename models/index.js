var requireDir = require( 'require-dir' );
var models = requireDir( './mongoose' );

var modelExport = {};

for ( var property in models ) {

    modelExport[ property ] = models[ property ];
}

module.exports = modelExport;




