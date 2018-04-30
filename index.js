const fs = require("fs");
const config = require("./config");
const args = process.argv;
const yelp = require("yelp-fusion");
const client = yelp.client(config.YELP_AUTH);
const usage = "please type `node index.js number_of_results_per_type`";

if (args.length < 3) {
    console.log(usage);
    return;
}

let count = parseInt(args[2]);
console.log(count);
if (!count) {
    console.log(usage);
    return;
}

if (count > 1000) {
    console.log("offset has only limit of 1000, DEFAULT = 1000");
    count = 1000;
}

const categories = config.YELP_CATEGORIES;
const location = config.YELP_LOCATION;
let id = [];
let json = [];
let offset = 0;

categories.forEach(async function (cate) {
    offset = 0;
    let busienss;
    while (offset < count) {
        busienss = await get_Yelp(location, cate, offset);
        console.log("processed batch " + busienss);
        offset = busienss;
    }
});

async function get_Yelp(location, category, offset) {
    if (offset > count) {
        return;
    }
    try {
        let res = await client.search({
            categories: category,
            location: location,
            limit: 50,
            sort_by: 'best_match',
            term: 'restaurants',
            offset: offset
        });
        offset+=50;
        console.log("processing category: " + category);
        console.log("offset is " + offset);
        pushToJson(res.jsonBody.businesses, category);
        writeJson();
    } catch (err) {
        console.log(err);
    }

    return offset;
}


function pushToJson(business, category) {
    business.forEach(business => {
        if (!id[business.id]) {
            id[business.id] = true;
            business.category = category;
            json.push(business);
        }
    })
}

function writeJson() {
    fs.writeFile("output.json", JSON.stringify(json), "utf8", (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log("output.json is completed");
    })
}