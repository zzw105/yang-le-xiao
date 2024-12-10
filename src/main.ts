import sharp from "sharp";
import _, { find } from "lodash";
import path from "path";
import fs from "fs";
import looksSame from "looks-same";
import { logArr, outArr } from "./utils";
import Checkerboard from "./checkerboard";
// 输入图片路径
const inputImagePath = path.join(__dirname, "./assets/grid.jpg");
const outputImagePath = path.join(__dirname, `./out/`);
// 图片阵列尺寸
const gridRow = 14; // 10
const gridCol = 10; // 14

const initTop = 543;
const initBottom = 660;
const initLeft = 10;
const initRight = 10;

// 存储哈希值和位置的映射

// sharp(inputImagePath)
//   .metadata() // 获取图像的尺寸
//   .then((metadata) => {
//     const imgWidth = metadata.width;
//     const imgHeight = metadata.height;
//     if (!imgWidth || !imgHeight) {
//       return;
//     }

//     // 计算每个小块的宽度和高度
//     const blockWidth = Math.floor((imgWidth - initLeft - initRight) / gridCol);
//     const blockHeight = Math.floor(
//       (imgHeight - initTop - initBottom) / gridRow
//     );

//     let promises = []; // 用于保存所有裁剪的 Promise

//     // 循环裁剪每个小块
//     for (let row = 0; row < gridRow; row++) {
//       for (let col = 0; col < gridCol; col++) {
//         const left = col * blockWidth + initLeft; // 左边界
//         const top = row * blockHeight + initTop; // 上边界

//         // 裁剪每个小块
//         const outputPath = `${outputImagePath}block_${row}_${col}.jpg`; // 输出文件路径
//         promises.push(
//           sharp(inputImagePath)
//             .extract({
//               left: left + 12,
//               top: top + 12,
//               width: blockWidth - 24,
//               height: blockHeight - 24,
//             }) // 裁剪指定区域
//             .toFile(outputPath) // 保存为新文件
//         );
//       }
//     }

//     // 等待所有裁剪操作完成
//     return Promise.all(promises);
//   })
//   .then(() => {
//     console.log("所有裁剪块已生成");
//   })
//   .catch((err) => {
//     console.error("裁剪失败:", err);
//   });

//
//
//
// const imgArr: string[][] = [];
// // 读取目录中的所有文件和文件夹
// const files = fs.readdirSync(outputImagePath);

// const fn = async () => {
//   // 遍历所有文件和文件夹

//   for (let i = 0; i < files.length; i++) {
//     const file = files[i];
//     const filePath = path.join(outputImagePath, file); // 获取文件或文件夹的完整路径

//     const allRes = await Promise.all(
//       imgArr.map(([itemFilePath]) => {
//         return looksSame(filePath, itemFilePath, {
//           tolerance: 50,
//           ignoreAntialiasing: true,
//         });
//       })
//     );
//     console.log({ allRes });

//     const index = allRes.findIndex((res) => {
//       return res.equal;
//     });

//     if (index === -1) {
//       imgArr.push([filePath]);
//       console.log(filePath, imgArr.length);
//     } else {
//       imgArr[index].push(filePath);
//     }
//   }
// };
// fn().then((res) => {
//   console.log(res);

//   console.log(imgArr);
// });

// const checkerboard: number[][] = Array.from({ length: 14 }, () => []);
// checkerboard[1][2] = 1;
const checkerboard = new Checkerboard(outArr);
checkerboard.clearDirectly();
checkerboard.cleanCrossMove({ rowIndex: 3, colIndex: 0 });
// checkerboard.clearDirectly();
// checkerboard.logData();
// checkerboard.findCross({ rowIndex: 5, colIndex: 2 });
