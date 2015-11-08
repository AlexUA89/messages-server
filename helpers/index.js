var requireDir = require( 'require-dir' );
var helpers = requireDir( './helpers' );

var helpersExport = {};

for ( var property in helpers ) {

    helpersExport[ property ] = helpers[ property ];
}

module.exports = helpersExport;