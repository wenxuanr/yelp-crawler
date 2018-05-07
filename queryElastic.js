const elasticsearch = require('elasticsearch');
const config = require('./config');
const client = new elasticsearch.Client({
    host: config.ServiceHost
});
const AWS = require("aws-sdk");
AWS.config.update({region: config.AWS_REGION});
const dynamodb = new AWS.DynamoDB();


client.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000
}, function (error) {
    if (error) {
        console.trace('elasticsearch cluster is down!');
    } else {
        console.log('All is well');
    }
});

    client.search({
        q: 'japanese'
    }).then(function (body) {
        var hits = body.hits.hits;
        console.log(hits);
        let firstItem = hits[0];
        let id = hits[0]._source.id;
        let params = {
            RequestItems: {
                "yelp-restaurants": {
                    Keys : [{
                        "id" : {
                            S : id
                        }
                    }]
                }
            }
        }
        console.log(params);
        console.log(id)
        dynamodb.batchGetItem(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });
    }, function (error) {
        console.trace(error.message);
    });