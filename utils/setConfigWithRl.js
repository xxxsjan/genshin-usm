const prompts = require("prompts");
const { readConfig, saveConfig } = require("./index.js");

module.exports = {};

(async () => {
  const data = readConfig();
  console.log('data: ', data);
  const initGames_path = data.Games_path || "";

  const questions = [
    // {
    //   type: "number",
    //   name: "value",
    //   message: "How old are you?",
    //   validate: (value) => (value < 18 ? `Nightclub is 18+ only` : true),
    // },
    {
      type: "text",
      name: "Games_path",
      message:
        "请输入YuanShen.exe所在目录，参考：Genshin Impact\\Genshin Impact Game: ",
      initial: initGames_path,
    },
    {
      type: "text",
      name: "USM_Files",
      message:
        "请输入单个usm文件位置，参考：Genshin Impact\\Genshin Impact Game\\YuanShen_Data\\StreamingAssets\\VideoAssets\\StandaloneWindows641）: ",
    },
  ];
  const response = await prompts(questions);

  console.log(response);
  // saveConfig(data);

})();
