const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const configFilePath = path.resolve(__dirname, "../config.json");

const readConfig = () => {
  try {
    if (fs.existsSync(configFilePath)) {
      console.log("configFilePath: ", configFilePath);
      const jsonData = fs.readFileSync(configFilePath, "utf-8");
      console.log("jsonData: ", jsonData);
      return JSON.parse(jsonData);
    } else {
      const emptyData = {};
      fs.writeFileSync(configFilePath, JSON.stringify(emptyData), "utf-8");
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
      fs.writeFileSync(configFilePath, jsonData, "utf-8");
      console.log("config文件已更新!");
    }
    return data;
  } catch (error) {
    console.error(`Error saving JSON file: ${error}`);
  }
};

const readLog = async () => {
  const config = {
    urls: [],
    logType: 0,
    lang: app.getLocale(), // "zh-CN",
    current: 0,
    proxyPort: 8325,
    proxyMode: false,
    autoUpdate: true,
    fetchFullHistory: false,
    hideNovice: true,
  };
  try {
    // 原神 云原神 的log文件
    const detectGameType = async (userPath) => {
      let list = [];
      try {
        await fs.access(
          path.join(
            userPath,
            "/AppData/LocalLow/miHoYo/",
            "原神/output_log.txt"
          ),
          fs.constants.F_OK
        );
        list.push("原神");
      } catch (e) {}
      try {
        await fs.access(
          path.join(
            userPath,
            "/AppData/LocalLow/miHoYo/",
            "Genshin Impact/output_log.txt"
          ),
          fs.constants.F_OK
        );
        list.push("Genshin Impact");
      } catch (e) {}

      if (config.logType) {
        if (config.logType === 2) {
          list.reverse();
        } else if (config.logType === 3) {
          list = [];
        }
        list = list.slice(0, 1);
      } else if (config.lang !== "zh-CN") {
        list.reverse();
      }

      try {
        await fs.access(
          path.join(
            userPath,
            "/AppData/Local/",
            "GenshinImpactCloudGame/config/logs/MiHoYoSDK.log"
          ),
          fs.constants.F_OK
        );
        list.push("cloud");
      } catch (e) {}

      return list;
    };
    // https://github.com/biuuu/genshin-wish-export/blob/main/src/main/getData.js#L117
    let gameNames = [];
    try {
      gameNames = await detectGameType(userPath);
    } catch (error) {
      console.log(error);
    }
    console.log("gameNames", gameNames); // [ '原神', 'cloud' ]

    if (gameNames.length < 1) {
      return false;
    }

    // 获取游戏安装目录
    const promises = gameNames.map(async (name) => {
      // 云原神
      if (name === "cloud") {
        const cloudLogPath = path.join(
          userPath,
          "/AppData/Local/",
          "GenshinImpactCloudGame/config/logs/MiHoYoSDK.log"
        );
        console.log("【云原神】日志位置：", cloudLogPath);
        const cacheText = await fs.readFile(cloudLogPath, "utf8");

        const urlMch = cacheText.match(
          /https.+?auth_appid=webview_gacha.+?authkey=.+?game_biz=hk4e_\w+/g
        );
        if (urlMch) {
          return urlMch[urlMch.length - 1];
        }
      } else {
        // 原神
        const localLogPath = `${userPath}/AppData/LocalLow/miHoYo/${name}/output_log.txt`;

        console.log("【原神】日志路径：", localLogPath);

        const logText = await fs.readFile(localLogPath, "utf8");

        // 日志里找游戏安装路径  // D:/game/Genshin Impact/Genshin Impact Game/YuanShen_Data
        // 游戏路径里找log文件data_2 /webCaches/2.16.0.0/Cache/Cache_Data/data_2

        const gamePathMch = logText.match(
          /\w:\/.+(GenshinImpact_Data|YuanShen_Data)/
        );

        if (gamePathMch) {
          console.log("游戏安装路径", gamePathMch[0]); // D:/game/Genshin Impact/Genshin Impact Game/YuanShen_Data

          // 获取最新版本对应文件夹的缓存文件
          const [cacheText, cacheFile] = await getCacheText(gamePathMch[0]);

          // console.log('cacheFile: ', cacheFile);

          const urlMch = cacheText.match(
            /https.+?auth_appid=webview_gacha.+?authkey=.+?game_biz=hk4e_\w+/g
          );

          if (urlMch) {
            // cacheFolder = cacheFile.replace(/Cache_Data[/\\]data_2$/, "");
            return urlMch[urlMch.length - 1];
          } else {
            return "日志文件解析错误";
          }
        }
      }
    });

    const result = await Promise.all(promises);
    console.log("result: ", result);

    for (let idx in result) {
      const url = result[idx];
      if (url) {
        console.log("日志来源➡️➡️➡️", gameNames[idx]);
        return url;
      }
    }
  } catch (e) {
    return false;
  }
};

module.exports = {
  readConfig,
  saveConfig,
};
