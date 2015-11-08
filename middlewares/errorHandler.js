//var logger =  require('libs/log');
//
//module.exports.init =  function init (app) {
//
//    app.use(function errorCallBack(err, req, res, next) {
//        logger.crit('error on request %d %s %s', process.domain.id, req.method, req.url);
//        logger.crit(err.stack);
//        if(!!err && !res.headersSent){
//            res.send(500, "Something bad happened. :(");
//        }
//        if(err.domain) {
//             //TODO do something with this this error
//        }
//    });
//
//};




