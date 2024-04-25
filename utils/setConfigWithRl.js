const readline = require("readline");
const { readConfig, saveConfig } = require("./index.js");

// 创建readline接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 提问函数
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// 主函数
async function setConfigWithRl() {
  const data = readConfig();

  let Games_path, USM_Files;
  if (!data.Games_path) {
    Games_path = await askQuestion(
      "请输入YuanShen.exe所在目录，参考：Genshin Impact\\Genshin Impact Game: "
    );
  }

  USM_Files = await askQuestion(
    "请输入单个usm文件位置，参考：Genshin Impact\\Genshin Impact Game\\YuanShen_Data\\StreamingAssets\\VideoAssets\\StandaloneWindows641）: "
  );

  data.Games_path = Games_path || data.Games_path;
  data.USM_Files = USM_Files || data.USM_Files;

  saveConfig(data);

  rl.close();
}

module.exports = { setConfigWithRl };
