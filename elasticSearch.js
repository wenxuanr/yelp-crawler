const config = require('./config.js');
const elasticsearch = require('elasticsearch');
const fs = require("fs");

const client = new elasticsearch.Client({
    host: config.ServiceHost
});


fs.readFile("elastic_data.json", "utf8", (err, data) => {
    data = JSON.parse(data);
    const res = [];
    data.forEach(item => {
        res.push({ index:  { _index: 'predictions', _type: 'prediction' } });
        res.push(item);
    });
    client.bulk({
        body: res
    }, (err, result) => {
        console.log(result);
    })
});

