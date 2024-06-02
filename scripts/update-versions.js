const https = require("https");
const fs = require("fs");
const path = require("path");

const url =
  "https://raw.githubusercontent.com/ToaHartor/GI-cutscenes/main/versions.json";

const localVersionPath = path.resolve(__dirname, "../versions.json");

const localVersion = JSON.parse(
  fs.readFileSync(localVersionPath, { encoding: "utf-8" }) || { list: [] }
);
const preVersion = localVersion.list[localVersion.list.length - 1]?.version;

https
  .get(url, (response) => {
    let data = "";
    console.log("data: ", data);

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      try {
        const jsonData = JSON.parse(data);

        const lastVersion = jsonData.list[jsonData.list.length - 1].version;

        console.log("本地版本", preVersion);
        console.log("远端版本", lastVersion);

        if (lastVersion && preVersion !== lastVersion) {
          fs.writeFileSync(localVersionPath, JSON.stringify(jsonData, null, 2));
        }
      } catch (error) {
        console.error("Error parsing JSON data:", error);
      }
    });
  })
  .on("error", (error) => {
    console.error("Error retrieving data:", error);
  });
