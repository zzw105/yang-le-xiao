import chalk from "chalk";
import { fontColor } from "./utils";

interface itemInfo {
  rowIndex: number;
  colIndex: number;
}
type directionType = "up" | "left" | "down" | "right";

const Checkerboard = class {
  data: number[][] = Array.from({ length: 14 }, () => []);

  movingData: number[][] = Array.from({ length: 14 }, () => []);

  movingCheckerboard: InstanceType<typeof Checkerboard> | null = null;

  constructor(imgArr?: string[][], data?: number[][]) {
    imgArr &&
      imgArr.forEach((item, index) => {
        item.forEach((info) => {
          const [_, x, y] = info.split(/[_\.]/);
          this.data[+x][+y] = index + 1;
        });
      });
    data && (this.data = structuredClone(data));
  }

  findCross(item: itemInfo) {
    const { rowIndex, colIndex } = item;

    const leftList: itemInfo[] = [];
    const rightList: itemInfo[] = [];
    const upList: itemInfo[] = [];
    const downList: itemInfo[] = [];

    for (let i = 0; i < 10; i++) {
      if (i < colIndex) leftList.unshift({ rowIndex, colIndex: i });
      if (i > colIndex) rightList.push({ rowIndex, colIndex: i });
    }

    for (let i = 0; i < 14; i++) {
      if (i < rowIndex) upList.unshift({ rowIndex: i, colIndex });
      if (i > rowIndex) downList.push({ rowIndex: i, colIndex });
    }

    return { leftList, rightList, upList, downList };
  }

  findCrossRecently(item: itemInfo) {
    const { leftList, rightList, upList, downList } = this.findCross(item);
    const leftItem = leftList.find((item) => this.getItemName(item) !== 0);
    const rightItem = rightList.find((item) => this.getItemName(item) !== 0);
    const upItem = upList.find((item) => this.getItemName(item) !== 0);
    const downItem = downList.find((item) => this.getItemName(item) !== 0);
    return { leftItem, rightItem, upItem, downItem };
  }

  cleanCrossRecently(item: itemInfo, directionType: directionType[] = ["up", "left", "down", "right"], isClean = true) {
    const { leftItem, rightItem, upItem, downItem } = this.findCrossRecently(item);
    const directionCleanItemArr = directionType.map((type) => {
      if (type === "right") return rightItem;
      else if (type === "left") return leftItem;
      else if (type === "up") return upItem;
      else if (type === "down") return downItem;
    });
    const cleanItem = this.findItemListSame(this.getItemName(item), directionCleanItemArr);
    if (cleanItem) {
      if (isClean) {
        this.setZero(cleanItem);
        this.setZero(item);
        this.logData();
      }
      return cleanItem;
    }
  }

  crossMoveClean(item: itemInfo, directionType: directionType, canMove = true, last = false): itemInfo | undefined {
    const { leftList, rightList, upList, downList } = this.findCross(item);
    let crossList: itemInfo[] = [];
    if (directionType === "down") crossList = downList;
    else if (directionType === "left") crossList = leftList;
    else if (directionType === "right") crossList = rightList;
    else if (directionType === "up") crossList = upList;
    const itemName = this.getItemName(item);
    // 右边
    const crossListName = crossList.map((item) => this.getItemName(item));

    const crossIndex = crossListName.findIndex((item) => item === 0);

    if (crossIndex === -1) {
      canMove = false;
    } else if (crossListName[crossIndex + 1] !== 0) {
      last = true;
    }

    if (canMove) {
      crossListName.splice(crossIndex, 1);
      crossListName.unshift(itemName);
      this.data[item.rowIndex][item.colIndex] = 0;
      crossListName.forEach((crossListItem, index) => {
        if (directionType === "down") this.data[item.rowIndex + index + 1][item.colIndex] = crossListItem;
        else if (directionType === "left") this.data[item.rowIndex][item.colIndex - index - 1] = crossListItem;
        else if (directionType === "right") this.data[item.rowIndex][item.colIndex + index + 1] = crossListItem;
        else if (directionType === "up") this.data[item.rowIndex - index - 1][item.colIndex] = crossListItem;
      });

      let newItem: itemInfo;
      let directionTypeList: directionType[];

      if (directionType === "down") {
        newItem = { rowIndex: item.rowIndex + 1, colIndex: item.colIndex };
        directionTypeList = ["left", "right"];
      } else if (directionType === "left") {
        newItem = { rowIndex: item.rowIndex, colIndex: item.colIndex - 1 };
        directionTypeList = ["up", "down"];
      } else if (directionType === "right") {
        newItem = { rowIndex: item.rowIndex, colIndex: item.colIndex + 1 };
        directionTypeList = ["up", "down"];
      } else {
        newItem = { rowIndex: item.rowIndex - 1, colIndex: item.colIndex };
        directionTypeList = ["left", "right"];
      }

      const res = this.cleanCrossRecently(newItem, directionTypeList);
      if (res) {
        return res;
      }

      if (last) {
        canMove = false;
      }

      return this.crossMoveClean(newItem, directionType, canMove, last);
    }
  }

  checkMoveClean(item: itemInfo, directionType: directionType) {
    this.movingCheckerboard = new Checkerboard(undefined, this.data);
    const res = this.movingCheckerboard.crossMoveClean(item, directionType);
    if (res) {
      console.log({ directionType });

      this.data = this.movingCheckerboard.data;
      return res;
    } else {
      this.movingCheckerboard = null;
    }
  }

  clearDirectly(data = this.data) {
    this.logData();
    let isClear = false;
    // const rowNum = [0, 13, 1, 12, 2, 11, 3, 10, 4, 9, 5, 8, 6, 7];
    const rowNum = [0, 13, 1, 12, 2, 11, 3, 10, 4, 9, 5, 8, 6, 7].reverse();

    // const colNum = [0, 9, 1, 8, 2, 7, 3, 6, 4, 5];
    const colNum = [0, 9, 1, 8, 2, 7, 3, 6, 4, 5].reverse();

    do {
      isClear = false; // 每轮开始时重置为 false
      for (let i = 0; i < rowNum.length; i++) {
        const rowIndex = rowNum[i];
        for (let j = 0; j < colNum.length; j++) {
          const colIndex = colNum[j];
          const item = { rowIndex, colIndex };
          const itemName = this.getItemName(item, data);
          if (itemName !== 0) {
            const functions = [
              () => {
                return this.cleanCrossRecently(item);
              },
              () => {
                return this.checkMoveClean(item, "left");
              },
              () => {
                return this.checkMoveClean(item, "right");
              },
              () => {
                return this.checkMoveClean(item, "up");
              },
              () => {
                return this.checkMoveClean(item, "down");
              },
            ];
            for (const func of functions) {
              if (func()) {
                isClear = true;

                break;
              }
            }
          }

          if (isClear) break;
        }
        if (isClear) break;
      }
    } while (isClear); // 继续循环，直到没有清理操作
  }

  findItemListSame(targetName: number, itemList: (itemInfo | undefined)[]) {
    for (let i = 0; i < itemList.length; i++) {
      const item = itemList[i];
      if (item && targetName === this.getItemName(item)) {
        console.log(targetName, this.getItemName(item));
        return item;
      }
    }
  }

  getItemName(item: itemInfo, data = this.data) {
    return data[item.rowIndex][item.colIndex];
  }

  setZero(item: itemInfo) {
    this.data[item.rowIndex][item.colIndex] = 0;
  }

  // 打印数据
  logData(data: number[][] = this.data) {
    data.forEach((item) => {
      item.forEach((info) => {
        process.stdout.write(`${chalk.bgHex(fontColor[info])(info.toString().padStart(2, "0"))} `);
      });
      process.stdout.write("\n");
    });
    console.log("————————————————————————————————————————");
  }
};

export default Checkerboard;
