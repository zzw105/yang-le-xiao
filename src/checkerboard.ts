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
  movingCheckerboard: typeof Checkerboard | null = null;
  constructor(imgArr?: string[][], data?: number[][]) {
    imgArr &&
      imgArr.forEach((item, index) => {
        item.forEach((info) => {
          const [_, x, y] = info.split(/[_\.]/);
          this.data[+x][+y] = index + 1;
        });
      });
    data && (this.data = data);
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

  cleanCrossRecently(
    item: itemInfo,
    directionType: directionType[] = ["up", "left", "down", "right"],
    isClean = true
  ) {
    const { leftItem, rightItem, upItem, downItem } =
      this.findCrossRecently(item);
    const directionCleanItemArr = directionType.map((type) => {
      if (type === "right") return rightItem;
      else if (type === "left") return leftItem;
      else if (type === "up") return upItem;
      else if (type === "down") return downItem;
    });
    const cleanItem = this.findItemListSame(
      this.getItemName(item),
      directionCleanItemArr
    );
    if (cleanItem) {
      if (isClean) this.setZero(cleanItem);
      return cleanItem;
    }
  }

  moveData(
    data: number[][],
    item: itemInfo,
    direction: directionType,
    num: number
  ) {
    const { leftList, rightList, upList, downList } = this.findCross(item);
    // 右
    let isMobileCompleted = false;
    const moveList: number[] = [];
    const rightListName = rightList.map((item) => this.getItemName(item, data));
    rightListName.forEach((itemName) => {
      if (isMobileCompleted) {
        moveList.push(itemName);
      } else {
        if (itemName !== 0) {
          moveList.push(itemName);
        }
        if (itemName === 0) {
          isMobileCompleted = true;
        }
      }
    });
    moveList.unshift(data[item.rowIndex][item.colIndex]);
    data[item.rowIndex][item.colIndex] = 0;
    moveList.forEach((moveListItem, index) => {
      data[item.rowIndex][item.colIndex + index + 1] = moveListItem;
    });

    this.logData(data);
  }

  cleanCrossMove(item: itemInfo) {
    const { leftList, rightList, upList, downList } = this.findCross(item);
    let leftMoveNum = 0;
    let rightMoveNum = 0;
    let upMoveNum = 0;
    let downMoveNum = 0;

    [leftList, rightList, upList, downList].forEach((list, type) => {
      let countState = 0;
      list.forEach((listItem) => {
        const listItemName = this.getItemName(listItem);
        if (countState === 0) {
          if (listItemName === 0) {
            countState++;
          }
        } else if (countState > 0) {
          if (listItemName === 0) {
            countState++;
          } else {
            if (type === 0) leftMoveNum = countState;
            else if (type === 1) rightMoveNum = countState;
            else if (type === 2) upMoveNum = countState;
            else if (type === 3) downMoveNum = countState;
            countState = -1;
          }
        }
      });
    });
    console.log(rightMoveNum);

    this.movingData = structuredClone(this.data);
    // this.moveData(this.movingData, item, "left", leftMoveNum);
    this.moveData(this.movingData, item, "right", rightMoveNum);
    // this.moveData(this.movingData, item, "up", upMoveNum);
    // this.moveData(this.movingData, item, "down", downMoveNum);

    // const leftMove: itemInfo[] = [];
    // const rightMove: itemInfo[] = [];
    // const upMove: itemInfo[] = [];
    // const downMove: itemInfo[] = [];

    // function setMoveItem(item: itemInfo, type: number, num: number) {
    //   if (type === 0) {
    //     leftMove.push({
    //       rowIndex: item.rowIndex,
    //       colIndex: item.colIndex - num,
    //     });
    //   } else if (type === 1) {
    //     rightMove.push({
    //       rowIndex: item.rowIndex,
    //       colIndex: item.colIndex + num,
    //     });
    //   } else if (type === 2) {
    //     upMove.push({
    //       rowIndex: item.rowIndex - num,
    //       colIndex: item.colIndex,
    //     });
    //   } else if (type === 3) {
    //     downMove.push({
    //       rowIndex: item.rowIndex + num,
    //       colIndex: item.colIndex,
    //     });
    //   }
    // }

    // [leftList, rightList, upList, downList].forEach((list, type) => {
    //   let countState = 0;
    //   list.forEach((listItem) => {
    //     const listItemName = this.getItemName(listItem);
    //     if (countState === 0) {
    //       if (listItemName === 0) {
    //         countState++;
    //         setMoveItem(item, type, countState);
    //       }
    //     } else if (countState > 0) {
    //       if (listItemName === 0) {
    //         countState++;
    //         setMoveItem(item, type, countState);
    //       } else {
    //         countState = -1;
    //       }
    //     }
    //   });
    // });
    // console.log({ leftMove, rightMove, upMove, downMove });
    // leftMove.forEach((moveItem) => {
    //  const res =  this.cleanCrossRecently(moveItem, ["up",  "down",]);
    // });
    // leftList.forEach((leftListItem) => {
    //   const leftListItemName = this.getItemName(leftListItem);
    //   if (countState === 0) {
    //     if (leftListItemName === 0) {
    //       countState = 1;
    //       leftRightMove.push(leftListItem);
    //     }
    //   } else if (countState === 1) {
    //     if (leftListItemName === 0) {
    //       leftRightMove.push(leftListItem);
    //     } else {
    //       countState = 2;
    //     }
    //   }
    // });
  }

  clearDirectly(data = this.data) {
    this.logData();
    let isClear = false;
    do {
      isClear = false; // 每轮开始时重置为 false
      this.data.forEach((row, rowIndex) => {
        row.forEach((_, colIndex) => {
          const item = { rowIndex, colIndex };
          const itemName = this.getItemName(item, data);
          if (itemName === 0) return;
          const res = this.cleanCrossRecently(item);
          if (res) {
            this.setZero(item);
            isClear = true; // 如果发生清理，标记为 true
          }
        });
      });
      this.logData();
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
        process.stdout.write(
          `${chalk.bgHex(fontColor[info])(info.toString().padStart(2, "0"))} `
        );
      });
      process.stdout.write("\n");
    });
    console.log("————————————————————————————————————————");
  }
};

export default Checkerboard;
