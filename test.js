const config = require('./config.js');
const elasticsearch = require('elasticsearch');
const fs = require("fs");


const client = new elasticsearch.Client({
    host: config.ServiceHost
});

let index = 0;
function test1() {
    client.search({
        q:'chinese'
    }).then(function (body) {
        let index = 0;
        let res = [];
        while (index < 5) {
            res.push(body.hits.hits[index]);
            index++;
        }
        return res;
    }).then((res) => {
        let idarr = [];
        res.forEach((x) => {
            idarr.push(x._source.id);
        })
        console.log(idarr);
    })
}
test1();