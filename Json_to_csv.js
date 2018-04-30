const fs = require("fs");

let csv = [];
let count = 0;
fs.readFile("output.json", (err, data) => {
    data = JSON.parse(data);
    console.log(data);
    data.forEach(json => {
        csv.push(makeCsvLine(json));
    });
    writeToFile(csv);
});

function makeCsvLine(json) {
    // id, category, rating, review_count, recommended
    let res = [];
    res.push(json.id);
    res.push(json.category ? json.category : undefined);
    res.push(json.rating ? json.rating : 0);
    res.push(json.review_count ? json.review_count : 0);
    return res.join(",");
}

function formatCsv(array) {
    return array.join("\n");
}

function writeToFile(result) {
    fs.writeFile("output.csv", formatCsv(result), "utf8", (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log("generated csv file");
    })
}


