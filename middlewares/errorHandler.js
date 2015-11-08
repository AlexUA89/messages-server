var logger =  require('libs/log');

module.exports.init =  function init (app) {

    app.use(function errorCallBack(err, req, res, next) {
        logger.crit('error on request '+process.domain.id+' '+req.method+' '+req.url);
        if(Array.isArray(err)) {
            err.forEach(function(error) {
                logger.crit('Stack = '+error.stack + ' Msg = ' + error.msg);
            })
        } else {
            logger.crit(err.stack);
        }
        if(!!err && !res.headersSent){
            res.send(500, "Something bad happened. :(");
        }
        if(err.domain) {
             //TODO do something with this this error
        }
    });

};




