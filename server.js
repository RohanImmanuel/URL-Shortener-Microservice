var mon = require("mongodb");
var mongo = mon.MongoClient;
var express = require("express");
var path = require("path");


var dbLink = 'mongodb://localhost:27017/surl';
var baseURL = 'https://url-shortener-microservice-rohanimmanuel.c9users.io/';

var app = express();

// DB Format
// {_id: 1, url: 'http://...'}

// Doc
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
});

// API
app.get('/new*', function(req, res) {
    var url = req.originalUrl.split('/new/').join('');
    
    if((isValidURL(url) || isAllowed(req.query.allow)) && url !== '') {
        mongo.connect(dbLink, function(err, db) {
            if(err) throw err;
            
            var links = db.collection('links');
            
            links.find({
                url: url
            }).toArray(function(err, result) {
                if(err) throw err;
                
                if(result.length > 0) {
                    res.json({
                        original_url: result[0].url,
                        short_url: baseURL + result[0]._id
                    });
                    db.close();
                    return;
                }
                
                links.insertOne({
                    url: url
                }, function(err, ins) {
                    if(err) throw err;
                    res.json({
                        original_url: ins.ops[0].url,
                        short_url: baseURL + ins.ops[0]._id
                    });
                    db.close();
                    res.end();
                });
            });
        });
    } else {
        res.end('Invalid URL!');
    }
});

// redirect
app.get('/*', function(req, res) {
    var urlId = new mon.ObjectID(req.originalUrl.toString().substr(1));
    mongo.connect(dbLink, function(err, db) {
        if(err) throw err;
        
        var links = db.collection('links');
        
        links.find({
            "_id": urlId
        }).toArray(function(err, result) {
            if(err) throw err;
            
            if(result.length > 0) {
                res.redirect(result[0].url);
            } else {
                res.end('URL Not Found!');
            }
            db.close();
        });
    });
});

// Function
function isValidURL(str) {
    return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(str);
}
function isAllowed(allow) {
    return (typeof allow !== 'undefined' && allow === 'true');
}


// Start Server
app.listen(8080);