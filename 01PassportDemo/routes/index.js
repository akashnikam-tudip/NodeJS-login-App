var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
    res.render('index', { title: 'Express' });
})

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/user/login');
    }
}

module.exports = router;
/**
 * Created by lt-48 on 1/6/16.
 */
