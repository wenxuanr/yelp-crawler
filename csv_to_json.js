const fs = require("fs");

const result = [];
fs.readFile("elastic_input.csv", "utf8", (err, data) => {
    data = data.split("\n");
    data.forEach(line => {
        result.push(formatJSON(line));
    })
    fs.writeFile("elastic_data.json", JSON.stringify(result), "utf8", (err, data) => {
        console.log("json created successully");
    })
})

function formatJSON(line) {
    line = line.split(",");
    // id category score label
    let json = {
        id: line[0],
        category: line[1],
        score: parseFloat(line[5]),
        label: line[4]
    }
    return json;
}


