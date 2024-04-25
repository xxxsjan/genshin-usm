const path = require("path");
const { existsSync } = require("fs");
const { execSync, exec } = require("child_process");

const { readConfig, saveConfig } = require("./utils");

(async () => {
  const _oldConfig = readConfig();

  const defaultConfig = {
    Cutscenes: path.resolve(__dirname, "Cutscenes.exe"),
    Ffmpegr: path.resolve(__dirname, "ffmpeg.exe"),
    Output_path: path.resolve(__dirname, "output"),
    Out_Language: 0, // 0国语配音 1英语配音 2日语配音 3韩语配音
    Games_path: "",
    USM_Files: "",
  };

  const GlobalVar = saveConfig({
    ...defaultConfig,
    ..._oldConfig,
  });

  GlobalVar.Video_Name = path.parse(GlobalVar.USM_Files).name;
  GlobalVar.Audio_Name = `${GlobalVar.Video_Name}_${GlobalVar.Out_Language}.wav`;

  // 单文件解析
  function parseFile() {
    if (!GlobalVar.USM_Files) {
      console.log("请先配置usm文件位置==> config.json --> USM_Files");
      return;
    }
    const outputDir = path.resolve(GlobalVar.Output_path, GlobalVar.Video_Name);
    const _command = `GICutscenes demuxUsm "${GlobalVar.USM_Files}" -o "${outputDir}" && exit`;

    try {
      const options = { encoding: "utf-8" };
      const output = execSync(_command, options);
      // console.log("output: ", output);
      console.log("已成功提取到：", outputDir);
    } catch (error) {}
  }

  function parseDir() {
    const USM_dir = path.join(
      GlobalVar.Games_path,
      "YuanShen_Data",
      "StreamingAssets",
      "VideoAssets",
      "StandaloneWindows64"
    );
    const _command = `GICutscenes batchDemux "${USM_dir}" -o "${GlobalVar.Output_path}" -m -e ffmpeg && exit`;

    existsSync(_command);
  }

  // 生成视频
  function generateVideo() {
    const ivfPath = `${GlobalVar.Output_path}\\${GlobalVar.Video_Name}\\${GlobalVar.Video_Name}.ivf`;
    const name = `${GlobalVar.Output_path}\\${GlobalVar.Video_Name}\\${GlobalVar.Audio_Name}`;
    const mkvPath = `${GlobalVar.Output_path}\\${GlobalVar.Video_Name}_${GlobalVar.Out_Language}.mkv`;
    const _command = `ffmpeg -i "${ivfPath}" -i "${name}" -c:v copy -c:a copy "${mkvPath}" && exit`;

    const output = execSync(_command, { encoding: "utf-8" });
  }

  parseFile();
  generateVideo();
  process.exit();
})();
