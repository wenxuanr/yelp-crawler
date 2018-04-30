const fs = require("fs");

let result = [];

fs.readFile("output.json", "utf-8", (err, data) => {
   jsonData = JSON.parse(data);
   jsonData.sort((a, b) => {
       let standardA = (a.rating ? a.rating * 10 : 0) + (a.review_count ? a.review_count * 1.5 : 0);
       let standardB = (b.rating ? b.rating * 10 : 0) + (b.review_count ? b.review_count * 1.5 : 0);
       return standardA - standardB;
   });
   let counter = 0;
   let top = jsonData.length - 1;
   let bottom = 0;
   while (counter < 100) {
       counter++;
       result.push(makeCsvLine(jsonData[top--], 1));
       result.push(makeCsvLine(jsonData[bottom++], 0));
   }
   writeToFile(result);

});

function makeCsvLine(json, recommend) {
    // id, category, rating, review_count, recommended
    let res = [];
    res.push(json.id);
    res.push(json.category ? json.category : undefined);
    res.push(json.rating ? json.rating : 0);
    res.push(json.review_count ? json.review_count : 0);
    res.push(recommend);
    console.log(res);
    return res.join(",");
}

function formatCsv(array) {
    return array.join("\n");
}


function writeToFile(csvArray) {
    fs.writeFile("training_sample.csv", formatCsv(csvArray), "utf8", (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log("generate ok");
    })
}