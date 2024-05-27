const cheerio = require("cheerio");
const fs = require("fs");

fs.readFile("./insta2.html", "utf8", (err, data) => {
  if (err) {
    console.log(err);
  }

  const $ = cheerio.load(data);

  $("._aagv img").map((idx, ele) => {
    console.log(ele.attribs["alt"]);
  });
});
