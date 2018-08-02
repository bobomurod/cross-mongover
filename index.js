var sample = require('mongodb-collection-sample');
var mongodb = require('mongodb');
var _ = require('lodash');

mongodb.connect('mongodb://127.0.0.1:27017', function(err,db){
    if(err){
        console.error("cannot connect to mongodb:", err);
        return process.exit(1);
    }
    var docs = _.range(0,1000).map(function(i){
        return {
            _id: 'needle' + i,
            is_even: i % 2
        };
    });
    db.collection('haystack').insert(docs, function(err){
        if(err){
            console.error('couldnt insert doc', err);
            return process.exit(1);
        }
        var options = {};
        options.size = 5;
        options.query = {};
        var stream = sample(db, 'haystack', options);
        stream.on('error', function(err) {
            console.log('Error in sample stream', err);
            return process.exit(1);
        });
        stream.on('data', function(doc) {
            console.log('Got sampled document `%j`', doc);
        });
        stream.on('end', function() {
            console.log('Sampling complete, goodbuy');
            db.close();
            process.exit(0);
        });
    });
});