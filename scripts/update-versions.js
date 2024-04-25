const https = require("https");

const url =
  "https://raw.githubusercontent.com/ToaHartor/GI-cutscenes/main/versions.json";

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
        console.log(jsonData);
      } catch (error) {
        console.error("Error parsing JSON data:", error);
      }
    });
  })
  .on("error", (error) => {
    console.error("Error retrieving data:", error);
  });
