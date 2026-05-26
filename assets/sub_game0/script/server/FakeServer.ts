import { AMoney } from "db://assets/doge/framework/common/Currency";
import { Utils } from "db://assets/doge/framework/common/Utils";

export type SpinResult = {
    itemType: { [key: string]: number[] },
    result?: number[][],
    treasure?: number[][],
    jackpot?: number[][],
    cash?: number[][],
    reward?: number,
}

export type DrawcardResult = {
    result: DrawcardType[];
    reward: number[],
}

export type LotteryResult = {
    reward: number,
}

type SymbolInfo = { symbolType: number, symbolNum: number, isCash: boolean }

enum SymbolType {
    S0 = 0,
    S1 = 1,
    S2 = 2,
    S3 = 3,
    S4 = 4,
    S5 = 5,
    S6 = 6,
    S7 = 7,
    S8 = 8,
    STreasure = 999,
    SUniversal = 1000,
    None = 99999
}

enum DrawcardType {
    RED = 0,
    PURPLE = 1,
    GREEN = 2,
    NONE = 3,
}

const ALL_TYPE: SymbolType[] = [
    SymbolType.S0,
    SymbolType.S1,
    SymbolType.S2,
    // SymbolType.S3,
    SymbolType.S4,
    SymbolType.S5,
    SymbolType.S6,
    SymbolType.S7,
    SymbolType.S8,
    // SymbolType.SWild,
    // SymbolType.SUniversal,
];
const LINE_SIZE = 4;
const COL_SIZE = 5;

const OddsTable = {
    "8": {
        "5": 6,
        "4": 3,
        "3": 1,
    },
    "7": {
        "5": 6,
        "4": 3,
        "3": 1,
    },
    "6": {
        "5": 10,
        "4": 4,
        "3": 2,
    },
    "5": {
        "5": 12,
        "4": 5,
        "3": 3,
    },
    "4": {
        "5": 12,
        "4": 5,
        "3": 3,
    },
    "3": {
        "5": 15,
        "4": 10,
        "3": 5,
    },
    "2": {
        "5": 30,
        "4": 15,
        "3": 6,
    },
    "1": {
        "5": 40,
        "4": 20,
        "3": 8,
    },
    "0": {
        "5": 50,
        "4": 25,
        "3": 10,
    },
}
const MinimumBet = 1;

export class FakeServer {

    public static getSpinInit(): SpinResult {
        return {
            itemType: {
                "0": [3, 7, 6, 2, 8],
                "1": [4, 999, 1, 0, 1],
                "2": [1000, 2, 6, 1000, 7],
                "3": [4, 1, 999, 0, 1],
                "4": [3, 7, 6, 2, 8],
            },
        }
    }

    public static createSpinResult(isGguaranteedWin: boolean, hasTreasure: boolean): SpinResult {
        let result = {
            itemType: {
                "0": [],
                "1": [],
                "2": [],
                "3": [],
                "4": [],
            },
            result: [],
            reward: 0,
            treasure: [],
            jackpot: [],
            cash: [],
        };


        // 全局1-2个（最多4个） 中奖数量 0个 70% 1个 30% 2个 0% 3个 0%
        let winnerNum = 0;
        if (isGguaranteedWin) {
            winnerNum = FakeServer.getByProbability([0, 1], [0, 1]);
        } else {
            winnerNum = FakeServer.getByProbability([0, 1], [0.6, 0.4]);
        }
        // let winnerNum = FakeServer.getByProbability([0, 1], [0, 1]);
        let winnerInfos: { symbolType: number, symbolNum: number }[] = [];
        if (winnerNum > 0) {

            let symbolType = 0;
            if (AMoney.value() >= -99999 && AMoney.value() < 400) {
                symbolType = FakeServer.getByProbability([SymbolType.S0, SymbolType.S1, SymbolType.S2, SymbolType.S4], [0.25, 0.25, 0.25, 0.25]);
            } else if (AMoney.value() >= 400 && AMoney.value() < 800) {
                symbolType = FakeServer.getByProbability([SymbolType.S5, SymbolType.S6, SymbolType.S7, SymbolType.S8], [0.25, 0.25, 0.25, 0.25]);
            } else if (AMoney.value() >= 800 && AMoney.value() < 1000) {
                symbolType = FakeServer.getByProbability([SymbolType.S7, SymbolType.S8], [0.5, 0.5]);
            } else if (AMoney.value() >= 1000 && AMoney.value() < 99999999) {
                symbolType = FakeServer.getByProbability([SymbolType.S5, SymbolType.S6, SymbolType.S7, SymbolType.S8], [0.25, 0.25, 0.25, 0.25]);
            }

            for (let i = 0; i < winnerNum; i++) {
                winnerInfos.push({
                    // 每个中奖符号类型 4-8 20% 0-3 0%
                    symbolType: symbolType,
                    // 单个中奖符号数量（3-5） 概率  3 70% 4 20% 5 10% 
                    symbolNum: FakeServer.getByProbability([3, 4, 5], [0.7, 0.2, 0.1]),
                });
            }
        }
        // 夺宝符号数量  0个50% 1个50% 2个0%
        let treasure = 0;
        if (hasTreasure) {
            treasure = FakeServer.getByProbability([0, 1], [0, 1]);
        }

        // jackpot符号数量  0-500 0个 70% 1个30% 500-1000 0个 90% 1个10% 1000-正无穷 0个 98% 1个2%
        let jackpot = 0;
        if (AMoney.value() >= -99999 && AMoney.value() < 500) {
            jackpot = FakeServer.getByProbability([0, 1], [0.6, 0.4]);
            // jackpot = FakeServer.getByProbability([0, 1], [0, 1]);
        } else if (AMoney.value() >= 500 && AMoney.value() < 1000) {
            jackpot = FakeServer.getByProbability([0, 1], [0.7, 0.3]);
            // jackpot = FakeServer.getByProbability([0, 1], [0, 1]);
        } else if (AMoney.value() >= 1000 && AMoney.value() < 99999999) {
            jackpot = FakeServer.getByProbability([0, 1], [1, 0]);
            // jackpot = FakeServer.getByProbability([0, 1], [0, 1]);
        }

        // cash奖励数量
        // let cash = FakeServer.getByProbability([0, 1, 2], [0, 0.7, 0.3]);
        let cash = 2;

        // 奖励值计算
        let reward = 0;
        for (let i = 0; i < winnerInfos.length; i++) {
            const info = winnerInfos[i];
            reward += OddsTable[info.symbolType][info.symbolNum] * MinimumBet;
        }
        result.reward = reward;

        console.log("Winner Num:", winnerNum);
        console.log("winner Infos:", JSON.stringify(winnerInfos));
        console.log("treasure Num:", treasure);
        console.log("jackpot Num:", jackpot);

        // 中奖信息确定
        let symbolMap: SymbolInfo[][] = new Array(LINE_SIZE);
        for (let i = 0; i < LINE_SIZE; i++) {
            const line: SymbolInfo[] = [];
            let num = 0;
            symbolMap[i] = line;
            let info = winnerInfos.pop();
            if (info) {
                line.push({
                    symbolType: info.symbolType,
                    symbolNum: info.symbolNum,
                    isCash: false,
                });
                num = COL_SIZE - info.symbolNum;
            } else {
                num = COL_SIZE;
            }

            if (num > 0) {
                for (let j = 0; j < num; j++) {
                    line.push({
                        symbolType: -1,
                        symbolNum: 1,
                        isCash: false,
                    });
                }
            }
            // 乱序
            line.sort(() => Math.random() - 0.5);
        }

        // 中奖前一个后一个信息确定
        for (let i = 0; i < LINE_SIZE; i++) {
            const line = symbolMap[i];
            for (let j = 0; j < line.length; j++) {
                const item = line[j];
                if (item.symbolNum >= 3) {
                    const ItemPre = line[j - 1];
                    const itemNext = line[j + 1];
                    if (ItemPre) {
                        ItemPre.symbolType = FakeServer.randomType([item.symbolType]);
                    }
                    if (itemNext) {
                        itemNext.symbolType = FakeServer.randomType([item.symbolType]);
                    }
                }
            }
        }

        // 乱序
        symbolMap.sort(() => Math.random() - 0.5);

        // 多添加一行(缓冲行)
        symbolMap.push([
            {
                symbolType: -1,
                symbolNum: 1,
                isCash: false,
            },
            {
                symbolType: -1,
                symbolNum: 1,
                isCash: false,
            },
            {
                symbolType: -1,
                symbolNum: 1,
                isCash: false,
            },
            {
                symbolType: -1,
                symbolNum: 1,
                isCash: false,
            },
            {
                symbolType: -1,
                symbolNum: 1,
                isCash: false,
            },
        ])

        console.log("symbolMap", symbolMap);
        // 其他确定
        let normalSymbolList = [];
        for (let i = 0; i < LINE_SIZE + 1; i++) {
            const line = symbolMap[i];
            console.log("Line length", line.length);
            for (let j = 0; j < line.length; j++) {
                const item = line[j];
                const itemPre1Type = line[j - 1]?.symbolType || -1;
                const itemPre2Type = line[j - 2]?.symbolType || -1;
                if (item.symbolType == -1) {
                    if (i != LINE_SIZE) {
                        normalSymbolList.push([i, j]);
                    }
                    let newType = 0;
                    do {
                        newType = FakeServer.randomType();
                    } while (newType == itemPre1Type && newType == itemPre2Type);
                    item.symbolType = newType;
                }
            }
        }

        // 夺宝Symbol
        normalSymbolList.sort(() => Math.random() - 0.5);
        for (let i = 0; i < treasure; i++) {
            const treasureItem = normalSymbolList.pop();
            symbolMap[treasureItem[0]][treasureItem[1]].symbolType = SymbolType.STreasure;
        }
        // Jackpot
        for (let i = 0; i < jackpot; i++) {
            const jackpotItem = normalSymbolList.pop();
            symbolMap[jackpotItem[0]][jackpotItem[1]].symbolType = SymbolType.S3;
        }
        // cash
        for (let i = 0; i < cash; i++) {
            let symbol = null;
            do {
                const cashItem = normalSymbolList.pop();
                symbol = symbolMap[cashItem[0]][cashItem[1]];
            } while (symbol.symbolNum >= 3);
            symbol.isCash = true;
        }

        console.log("Winner Data:", symbolMap);

        // 展开并替换万能Symbol
        for (let y = 0; y < LINE_SIZE + 1; y++) {
            const line = symbolMap[y];
            let len = line.length;
            for (let i = 0, k = 0; i < len; i++) {
                const item = line[i];
                let universalNum = 0;
                for (let j = 0; j < item.symbolNum; j++) {
                    let x = k++;
                    result.itemType[x][y] = item.symbolType;
                    if (item.symbolNum >= 3) {
                        // 添加到中奖集合
                        result.result.push([x, y]);
                        // 万能Symbol修改 每个中奖符号变万能的概率 20%变 80%不变
                        if (universalNum < item.symbolNum - 2) {
                            result.itemType[x][y] = FakeServer.getByProbability([SymbolType.SUniversal, item.symbolType], [0.2, 0.8]);
                            if (result.itemType[x][y] == SymbolType.SUniversal) {
                                universalNum++;
                            }
                        }
                    } else {
                        // 添加到夺宝集合&添加到Jackpot集合&现金奖励
                        if (item.symbolType == SymbolType.STreasure) {
                            result.treasure.push([x, y]);
                        } else if (item.symbolType == SymbolType.S3) {
                            result.jackpot.push([x, y]);
                        } else if (item.isCash) {
                            // 小额奖励值
                            let cashReward = FakeServer.cashReward();
                            result.cash.push([x, y, cashReward]);
                        }
                    }
                }
            }
        }
        console.log("result", JSON.stringify(result));
        return result;
    }

    public static getSpinResult(): SpinResult {
        return this.createSpinResult(false, true);
    }

    public static getNewUserSpinResult(): SpinResult {
        return this.createSpinResult(true, true);
    }

    public static getSpinContinuousResult(): SpinResult[] {
        let result = [];
        for (let i = 0; i < 3; i++) {
            result.push(FakeServer.createSpinResult(false, false));
        }
        return result;
    }

    public static getDrawcardResult(): DrawcardResult {
        let result = [DrawcardType.RED, DrawcardType.RED, DrawcardType.RED, DrawcardType.PURPLE, DrawcardType.PURPLE, DrawcardType.PURPLE, DrawcardType.GREEN, DrawcardType.GREEN, DrawcardType.GREEN];
        result.sort(() => Math.random() - 0.5);
        // for (let x = 0; x < 3; x++) {
        //     let col = [];
        //     for (let y = 0; y < 3; y++) {
        //         col.push(arr.pop());
        //     }
        //     result.push(col);
        // }
        return {
            result: result,
            reward: [200, 100, 60],
        };
    }

    public static getLotteryResult(): LotteryResult {
        let result = FakeServer.cashReward();
        return {
            reward: result,
        };
    }

    public static cashReward() {
        let cashReward = 0;
        if (AMoney.value() >= -99999 && AMoney.value() < 500) {
            cashReward = Utils.randomInt(200, 400) / 100;
        } else if (AMoney.value() >= 500 && AMoney.value() < 800) {
            cashReward = Utils.randomInt(100, 300) / 100;
        } else if (AMoney.value() >= 800 && AMoney.value() < 900) {
            cashReward = Utils.randomInt(30, 100) / 100;
        } else if (AMoney.value() >= 900) {
            cashReward = Utils.randomInt(10, 50) / 100;
        }
        return cashReward;
    }

    private static getByProbability(dataArr: any[], probabilityArr: number[], options: { normalize: boolean, allowZero: boolean, defaultReturn: boolean } = {
        normalize: true,    // 是否自动归一化概率
        allowZero: false,   // 是否允许概率为0
        defaultReturn: null // 无法返回时的默认值
    }) {

        // 参数验证
        if (!Array.isArray(dataArr) || !Array.isArray(probabilityArr)) {
            throw new Error('The args is must be an Array');
        }

        if (dataArr.length !== probabilityArr.length) {
            throw new Error('data length must be equal probability length');
        }

        if (dataArr.length === 0) {
            return options.defaultReturn;
        }

        // 过滤掉概率为0的项（如果设置不允许）
        let filteredData = [...dataArr];
        let filteredProb = [...probabilityArr];

        if (!options.allowZero) {
            const filtered = [];
            const filteredProbTemp = [];

            for (let i = 0; i < probabilityArr.length; i++) {
                if (probabilityArr[i] > 0) {
                    filtered.push(dataArr[i]);
                    filteredProbTemp.push(probabilityArr[i]);
                }
            }

            filteredData = filtered;
            filteredProb = filteredProbTemp;

            if (filteredData.length === 0) {
                return options.defaultReturn;
            }
        }

        // 归一化概率（使总概率为1）
        let probabilities: number[] = null;
        if (options.normalize) {
            const total = filteredProb.reduce((sum, prob) => sum + prob, 0);
            if (total <= 0) {
                return options.defaultReturn;
            }
            probabilities = filteredProb.map(prob => prob / total);
        } else {
            probabilities = filteredProb;
        }

        // 执行选择
        const random = Math.random();
        let accumulated = 0;

        for (let i = 0; i < probabilities.length; i++) {
            accumulated += probabilities[i];
            if (random < accumulated || i === probabilities.length - 1) {
                return filteredData[i];
            }
        }

        return options.defaultReturn;
    }

    public static randomType(excludeType: number[] = []) {
        let newType = 0;
        do {
            newType = ALL_TYPE[Utils.randomInt(0, ALL_TYPE.length - 1)];
        } while (excludeType.includes(newType));
        return newType;
    }
}


