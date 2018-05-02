const fs = require("fs");

let result = [];
fs.readFile("elastic_input.csv", "utf8", (err, data) => {

    data = data.split("\n");

    data.forEach(line => {
        if (line.split(",")[4] === '1') {
            result.push(line);
        }
    });

    fs.writeFile("elastic_input.csv", result.join("\n"), "utf8", (err, result) => {
        console.log("finished filter");
    })
});