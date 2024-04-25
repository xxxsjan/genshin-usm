const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const filePath = path.resolve(process.cwd(), "config.json");

const readConfig = () => {
  try {
    if (fs.existsSync(filePath)) {
      const jsonData = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(jsonData);
    } else {
      const emptyData = {};
      fs.writeFileSync(filePath, JSON.stringify(emptyData), "utf-8");
      return emptyData;
    }
  } catch (error) {
    console.error(`Error reading JSON file: ${error}`);
    return null;
  }
};

const saveConfig = (data) => {
  try {
    const old = readConfig();
    const isEqual = _.isEqual(old, data);

    if (!isEqual) {
      const jsonData = JSON.stringify(data, null, 2);
      fs.writeFileSync(filePath, jsonData, "utf-8");
      console.log("config文件已更新!");
    }
    return data;
  } catch (error) {
    console.error(`Error saving JSON file: ${error}`);
  }
};

module.exports = {
  readConfig,
  saveConfig,
};
