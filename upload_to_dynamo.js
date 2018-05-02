const AWS = require('aws-sdk');
const config = require('./config');
const fs = require('fs');
const moment = require("moment");
const ddb = new AWS.DynamoDB({
    region: config.AWS_REGION
});

let curr = 0;
fs.readFile("output.json", "utf8", (err, data) => {
    data = JSON.parse(data);
    let length = data.length;
    let requestItems = [];
    for (let i = curr; i < length && i < curr + 25; i++) {
        let req = {
            PutRequest: {
                Item: amazonDynamo(data[i])
            }
        }
        requestItems.push(req);
    }
    let params = {
        RequestItems: {
            [config.DYNAMO_TABLE_NAME]: requestItems
        }
    };
    ppromise(params);
});

function ppromise(params) {
    let fn = ((resolve, reject) => {
        dynamo.batchWriteItem(params, (err, result) => {
            if (err) {
                console.log(err);
                console.log(params);
            }
            resolve(result);
        });
    });
    return new Promise(fn);
}
function amazonDynamo(item) {
    let result = {};
    let checkList = ["id", "category", "review_count", "rating", "name", "image_url", "location", "coordinates", "phone"];
    checkList.forEach(attribute => {
        if (item[attribute]) {
            const type = typeof item[attribute];
            let value = item[attribute];
            let key = "S";
            if (type === 'object') {
                value = JSON.stringify(value);
            } else if (type === 'number') {
                value = value.toString();
                key = "N";
            }
            result[attribute] = {[key]: value};
        }
    });
    /**
     * Additional attributes
     */
    if (item.location && item.location.zip_code) {
        result.zip_code = {S: item.location.zip_code};
    }
    if (item.coordinates && item.coordinates.latitude) {
        result.lat = {N: item.coordinates.latitude.toString()};
    }
    if (item.coordinates && item.coordinates.longitude) {
        result.lng = {N: item.coordinates.longitude.toString()};
    }
    if (item.location && item.location.display_address) {
        result.address = {S: item.location.display_address[0] + "," + item.location.display_address[1]};
    }
    result.created_at = {S: moment().format("YYYY-MM-DD HH:mm:ss")};
    return result;
}
