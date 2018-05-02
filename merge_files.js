const fs = require("fs");

let resarr = [];
fs.readFile("./training_sample.csv", "utf-8", (err, res) => {
    if (err) {
        return console.error(err);
    }
    fs.readFile("./score_output.csv", "utf-8", (err, res2) => {
        if (err) {
            return console.error(err);
        }
        res = res.split("\n");
        res2 = res2.split("\n");
        for (let i = 0; i < res.length; i++) {
            // since res2 has title we start off with i + 1
            resarr.push(res[i] + "," + res2[i + 1]);
        }
        fs.writeFile("elastic_input.csv", resarr.join("\n"), "utf8", (err, result) => {
            console.log("succeess");
        })
    })
});