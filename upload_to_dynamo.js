const fs = require("fs");
const AWS = require("aws-sdk");
const DOC = require("dynamodb-doc");
const config = require("./config");
const attr = require('dynamodb-data-types').AttributeValue;
const moment= require('moment');
AWS.config.update({region: config.AWS_REGION});
const dynamodb = new AWS.DynamoDB();




fs.readFile("output.json", "utf8", (err, data) => {
    data = JSON.parse(data);
    data.forEach(el => {
        let noneEmptyData = transformToAmazonItem(el);
        let param = {
            RequestItems: {
                "yelp-restaurants": [{
                    PutRequest: {
                        Item: noneEmptyData
                    }
                }]
            }
        }
        dynamodb.batchWriteItem(param, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
            /*
            data = {
            }
            */
        });
    })





    /**/
    // data = JSON.parse(data);
    // data.forEach(element => {
    //    let noneEmptyData = transFormData(element);
    //    let dataWrap = attr.wrap(noneEmptyData);
    //    let param = {
    //         RequestItems: {
    //             "yelp-restaurants": [{
    //                 PutRequest: {
    //                     Item: noneEmptyData
    //                 }
    //             }]
    //         }
    //     }
    //
    //     dynamodb.batchWriteItem(param, function(err, data) {
    //         if (err) console.log(err, err.stack); // an error occurred
    //         else     console.log(data);           // successful response
    //         /*
    //         data = {
    //         }
    //         */
    //     });
    // });

});

function transformToAmazonItem(item) {
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
