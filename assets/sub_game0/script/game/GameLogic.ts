import { Component, _decorator, find, Node, sp, Prefab, instantiate, v3, tween, Size, Tween, macro, Line, easing, Label, Sprite, misc, AudioSource, EventTouch } from "cc";
import { GameSymbol, SymbolState, SymbolType } from "./GameSymbol";
import { GameTitle } from "./GameTitle";
import { NetworkSystem } from "../system/NetworkSystem";
import { Toast } from "db://assets/doge/framework/init";
import { SpinResult } from "../server/FakeServer";
import { PanelCreator } from "../component/creator/PanelCreator";
import { RewardType } from "../component/panels/NormalRewardPanel";
import { Language } from "db://assets/doge/framework/language/Language";
import { SpinSystem } from "../system/SpinSystem";
import { ACoins, AMoney } from "db://assets/doge/framework/common/Currency";
import AudioTools from "db://assets/doge/framework/common/AudioTools";
import { AUDIOS } from "../../constant/Constant";
import { Utils, Wait } from "db://assets/doge/framework/common/Utils";
import { WithdrawSystem } from "../system/WithdrawSystem";
import { GuideSystem } from "../system/GuideSystem";
import { UserSystem } from "../system/UserSystem";
import { LotterySystem } from "../system/LotterySystem";
import { UploadSystem } from "../system/UploadSystem";
import { Clock } from "db://assets/doge/framework/common/Clock";
const { ccclass, property } = _decorator;

const COL_SIZE = 5;
const LINE_SIZE = 5;
const ROLL_SPEED = 4200;
// const ROLL_SPEED = 360;


@ccclass("GameLogic")
export class GameLogic extends Component {

    @property(Prefab)
    private gameSymbolPrefab: Prefab = null;

    @property(GameTitle)
    private title: GameTitle = null;
    @property([Node])
    private items: Node[] = [];
    @property(Node)
    private spinTimesBtn: Node = null;
    @property(Node)
    private treasureBox: Node = null;
    @property(Node)
    private date: Node = null;

    // Symbols Map = [5][7];
    private slotsContent: SlotsContent = new SlotsContent().init();
    private static GAME_SYMBOL_W: number = 0;
    private static GAME_SYMBOL_H: number = 0;

    private rollResult: SpinResult = null;
    private treasureRollResult: SpinResult[] = null;
    private treasureReward: number = 0;
    private spinId: number = 1;
    private _CurrSpinId: number = 0;

    protected onEnable(): void {
        Language.on("@treasure", this.onTreasureNumChanged, this);
    }

    onTreasureNumChanged() {
        let percent = find("Progress/Fg", this.treasureBox).getComponent(Sprite);
        let percentTxt = find("Percent", this.treasureBox).getComponent(Label);
        let num = SpinSystem.I.getTreasure();
        let limit = SpinSystem.I.getTreasureLimit();
        percent.fillRange = num / limit;
        percentTxt.string = Language.getWord("l_text5", num.toString(), limit.toString());
    }

    protected start(): void {

    }

    protected update(dt: number): void {
        let time = SpinSystem.I.getSpinReplenishTime();
        if (time >= 0) {
            this.date.getComponent(Label).string = Clock.getClock(time, "mm:ss");
            this.date.active = true;
        } else {
            this.date.active = false;
        }
    }

    public static getBasePositionY(idx: number) {
        return GameLogic.GAME_SYMBOL_H * (idx + 0.5);
    }

    init() {
        console.log(this.gameSymbolPrefab.data.transform);
        let size: Size = this.gameSymbolPrefab.data.transform.contentSize;
        GameLogic.GAME_SYMBOL_W = size.width;
        GameLogic.GAME_SYMBOL_H = size.height;
        // let item = find("SlotsGame/SlotsContent/GameItem", this.node);
        // item.getComponent(GameSymbol).init(SymbolType.S1, SymbolState.win);
        this.title.init();
        // find("Num", this.spinTimesBtn).getComponent(Label).string = "10";
        this.onTreasureNumChanged();
        this.initMap();
    }

    async initMap() {
        let result = await NetworkSystem.getSpinInit();
        if (result.error) {
            Toast.show("Spin Result error");
            return;
        }
        this.createSymbolMap(result.data, 0);
    }

    // 创建Symbol
    createSymbolMap(data: SpinResult, startY: number, offsetY: number = 0) {
        for (let x = 0; x < this.items.length; x++) {
            this.items[x].removeAllChildren();
            this.createSymbolCol(x, data, startY, offsetY);
        }
    }

    createSymbolCol(colIndex: number, data: SpinResult, startIndex: number, offsetY: number = 0) {
        const col = data.itemType[colIndex];
        console.log("col", col);
        const item = this.items[colIndex];
        let len = col.length;
        for (let y = 0, y1 = startIndex; y < len; y++, y1++) {
            const symbolType = col[y];
            let symbolObj = this.createNewSymbol(colIndex, y1, symbolType, SymbolState.idle);
            symbolObj.parent = item;
            symbolObj.position = v3(0, GameLogic.getBasePositionY(y1) + offsetY, 0);
        }
    }

    createNewSymbol(x: number, y: number, type: SymbolType, state: SymbolState) {
        let node = instantiate(this.gameSymbolPrefab);
        let gameSymbol = node.getComponent(GameSymbol);
        gameSymbol.init(type, state);
        this.slotsContent.add(x, y, gameSymbol);
        return node;
    }

    onSpinBtnClick() {
        if (!SpinSystem.I.hasTimes()) {
            this.onMoreSpinBtnClick();
            return;
        }

        if (this._CurrSpinId == this.spinId) {
            return;
        }

        this._CurrSpinId = this.spinId;

        if (GuideSystem.I.getStep() == 0) {
            GuideSystem.I.nextShow();
            UserSystem.I.getNewUserReward((rewardA: number, rewardB: number) => {
                console.log("getNewUserReward", rewardA, rewardB);
                if (rewardA > 0 || rewardB > 0) {
                    this.spin(true);
                }
            })
        } else {
            this.spin(false);
        }
    }

    onMoreSpinBtnClick() {
        PanelCreator.moreSpin();
    }

    onAboutClick() {
        PanelCreator.aboutPanel();
    }

    onTreasureBoxClick(event: EventTouch) {
        let btn: Node = event.target;
        let tips = find("Tips", btn);
        tips.active = true;
        tips.alpha = 255;
        Tween.stopAllByTarget(tips);
        tween(tips)
            .delay(5)
            .to(0.2, { alpha: 0 })
            .call(() => {
                tips.active = false;
            })
            .start();
    }

    startRoll(time: number) {
        let rollDis = ROLL_SPEED * time;
        let rollRound = (Math.ceil(rollDis / GameLogic.GAME_SYMBOL_H));
        console.log("Roll Round:", rollRound)
        find("RollingAudio", this.node).getComponent(AudioSource).play();
        for (let x = 0; x < this.slotsContent.colSize(); x++) {
            this.scheduleOnce(() => {
                const col = this.slotsContent.getCol(x);
                this.startRollCol(x, col, rollRound);
            }, 0.1 * x);
        }
    }

    startRollCol(colIdx: number, col: GameSymbol[], rollRound: number) {
        let len = col.length;
        for (let y = 0; y < len; y++) {
            const gameSymbol = col[y];
            if (gameSymbol) {
                tween(gameSymbol.node)
                    .to(0.1, { y: gameSymbol.node.y + 40 })
                    .call(() => {
                        if (y == len - 1) {
                            this.startUpdateRollCol(colIdx, col, rollRound);
                        }
                    })
                    .start()
            }
        }

    }

    startUpdateRollCol(colIdx: number, col: GameSymbol[], rollRound: number) {
        let isRollResult: boolean = false;

        let cb = (dt: number) => {
            let len = col.length;
            // console.log("updateRollCol", colIdx, col);
            let baseline = GameLogic.getBasePositionY(-1);
            let offset = 0;
            let recycleSymbol: GameSymbol = null;
            for (let y = 0; y < len; y++) {
                const gameSymbol = col[y];
                if (gameSymbol) {
                    // 移动
                    gameSymbol.node.y -= ROLL_SPEED * dt;
                    if (gameSymbol.node.y <= baseline) {
                        // 超过基线 回收Symbol
                        recycleSymbol = gameSymbol;
                        if (isRollResult) {
                            // 最终结果 需要移动到队尾的Symbol 按结果集重新初始化
                            recycleSymbol.init(this.rollResult.itemType[colIdx].shift(), SymbolState.idle);
                        } else {
                            // 非最终结果 需要移动到队尾的Symbol 随机一个样式重新初始化
                            recycleSymbol.init(GameSymbol.randomType(), SymbolState.blur);
                        }
                    }
                }
            }
            if (recycleSymbol) {
                // 可回收的Symbol 移动到队尾
                offset = recycleSymbol.node.y - baseline;
                recycleSymbol.node.position = v3(0, GameLogic.getBasePositionY(LINE_SIZE - 1) + offset, 0);
                // 从队首删除 重新加入到队尾
                let gameSymbol = this.slotsContent.shift(colIdx);
                this.slotsContent.push(colIdx, gameSymbol);
                if (isRollResult) {
                    const y = LINE_SIZE - rollRound
                    // 确定是否现金奖励
                    let cash = this.getCashReward(colIdx, y);
                    if (cash) {
                        recycleSymbol.setCash(cash[2]);
                        console.log("是金框符号", recycleSymbol.getType(), cash[2]);
                    } else {
                        recycleSymbol.removeCash();
                    }
                }
                // 完成一次 rollRound 次数-1
                rollRound -= 1;

            }
            if (rollRound == 0 && isRollResult) {
                // roll 全部完成 并且 为最终结果
                // 停止update
                this.unschedule(cb);
                this.onRollColResultEnd(colIdx, col);
            } else if (rollRound == 0 && !isRollResult) {
                // roll 全部完成 并且 非最终结果
                isRollResult = true;
                // 继续Roll 最终结果
                rollRound = LINE_SIZE;
                this.onRollColEnd(colIdx);
            }
        }
        this.schedule(cb, 0, macro.REPEAT_FOREVER);
    };

    async onRollColEnd(colIndex: number) {
        console.log(`onRollEnd${colIndex}`, this.rollResult);
    }

    onRollColResultEnd(colIndex: number, col: GameSymbol[]) {
        // 对齐下位置 并播放一个弹动动画
        let time = 0.1
        let len = col.length;
        for (let i = 0; i < len; i++) {
            const gameSymbol = col[i];
            if (gameSymbol) {
                gameSymbol.node.y = GameLogic.getBasePositionY(i);
                let t = tween(gameSymbol.node)
                    .by(time, { y: -10 })
                    .by(time, { y: 10 })
                if (colIndex == len - 1 && i == 0) {
                    t.call(() => { find("RollingAudio", this.node).getComponent(AudioSource).stop(); });
                }
                t.start();
            }
        }

        // 最后一列
        if (colIndex == len - 1) {
            this.scheduleOnce(() => {
                // 发放现金奖励
                if (this.treasureRollResult) {
                    let len = this.rollResult.cash.length;
                    for (let i = 0; i < len; i++) {
                        this.treasureReward += this.rollResult.cash[i][2];
                    }
                } else {
                    if (this.rollResult.result.length <= 0) {
                        this.addCash();
                    }
                }
                this.playTitleAnim(this.rollResult);
                // 是否中奖
                if (this.rollResult.result.length > 0) {
                    // 中奖
                    this.onWin();
                } else if (this.rollResult.jackpot.length > 0) {
                    // 未中奖 只有jackpot
                    this.onJackpotOnly();
                } else {
                    // 未中奖 无jackpot
                    this.onNotWin();
                }
            }, time * 2 + 0.2)
        }
    }

    onWin() {
        // win动画展示
        AudioTools.sound(AUDIOS.getWin);
        AudioTools.sound(AUDIOS[`win${Utils.randomInt(0, 4)}`]);
        let len = this.rollResult.result.length;
        let idx = 0;
        for (let i = 0; i < len; i++) {
            const item = this.rollResult.result[i];
            let treasure = this.rollResult.treasure.find((value: number[]) => {
                return value[0] == item[0] && value[1] == item[1]
            });
            if (treasure) {
                continue;
            }
            let jackpot = this.rollResult.jackpot.find((value: number[]) => {
                return value[0] == item[0] && value[1] == item[1]
            });
            if (jackpot) {
                continue;
            }
            const gameSymbol = this.slotsContent.get(item[0], item[1]);
            gameSymbol.onChangeStateEnd((state: SymbolState) => {
                if (state == SymbolState.win) {
                    idx += 1;
                    if (idx == len) {
                        // 最后一个Symbol播放完胜利动画之后 开始下落
                        this.startDropDown();
                    }
                }
            });
            gameSymbol.changeState(SymbolState.win);
        }
        let treasureLen = this.rollResult.treasure.length;
        for (let i = 0; i < treasureLen; i++) {
            const item = this.rollResult.treasure[i];
            const gameSymbol = this.slotsContent.get(item[0], item[1]);
            gameSymbol.changeState(SymbolState.win_idle);
        }
        SpinSystem.I.refTreasure();
        let jackpotLen = this.rollResult.jackpot.length;
        for (let i = 0; i < jackpotLen; i++) {
            const item = this.rollResult.jackpot[i];
            const gameSymbol = this.slotsContent.get(item[0], item[1]);
            gameSymbol.changeState(SymbolState.win);
            // jackpot动画
            this.title.addJackpot(gameSymbol.node.worldPosition);
        }
    }

    onJackpotOnly() {
        AudioTools.sound(AUDIOS.onlyJackpot);
        let treasureLen = this.rollResult.treasure.length;
        for (let i = 0; i < treasureLen; i++) {
            const item = this.rollResult.treasure[i];
            const gameSymbol = this.slotsContent.get(item[0], item[1]);
            gameSymbol.changeState(SymbolState.win_idle);
        }
        SpinSystem.I.refTreasure();
        let jackpotLen = this.rollResult.jackpot.length;
        let idx = 0;
        for (let i = 0; i < jackpotLen; i++) {
            const item = this.rollResult.jackpot[i];
            const gameSymbol = this.slotsContent.get(item[0], item[1]);
            gameSymbol.onChangeStateEnd((state: SymbolState) => {
                if (state == SymbolState.win) {
                    idx += 1;
                    if (idx == jackpotLen) {
                        // 最后一个Symbol播放完胜利动画之后 开始下落
                        this.startDropDown();
                    }
                }
            });
            gameSymbol.changeState(SymbolState.win);
            // jackpot动画
            this.title.addJackpot(gameSymbol.node.worldPosition);
        }
    }

    onNotWin() {
        let len = this.rollResult.treasure.length;
        for (let i = 0; i < len; i++) {
            const item = this.rollResult.treasure[i];
            const gameSymbol = this.slotsContent.get(item[0], item[1]);
            gameSymbol.changeState(SymbolState.win_idle);
        }
        SpinSystem.I.refTreasure();
        let isDelay = this.onPlayDropDownEnd(this.rollResult.reward);
        if (isDelay) {
            this.scheduleOnce(() => { this.onPlayDropEndDelay() }, 0.1);
        }
    }

    addCash() {
        let len = this.rollResult.cash.length;
        for (let i = 0; i < len; i++) {
            const item = this.rollResult.cash[i];
            AMoney.add(item[2]);
            const gameSymbol = this.slotsContent.get(item[0], item[1]);
            gameSymbol.cashAnimation();
        }
    }

    startDropDown() {
        AudioTools.sound(AUDIOS.dropDown);
        // 移除所有win状态的symbol并重置后放置在队尾
        for (let x = 0; x < this.slotsContent.colSize(); x++) {
            const col = this.slotsContent.getCol(x);
            const len = col.length;
            for (let y = len - 1, i = len - 1; y >= 0; y--) {
                const gameSymbol = col[y];
                if (gameSymbol && gameSymbol.getState() == SymbolState.win) {
                    i += 1;
                    col.splice(y, 1);
                    this.slotsContent.push(x, gameSymbol);
                    gameSymbol.init(GameSymbol.randomType(), SymbolState.idle);
                    gameSymbol.node.position = v3(0, GameLogic.getBasePositionY(i), 0);
                }
            }
        }
        AudioTools.sound(AUDIOS[`rate${this.rollResult.result.length}`]);

        // 为所有Symbol增加对齐动画
        let count = 0;
        for (let x = 0; x < this.slotsContent.colSize(); x++) {
            const col = this.slotsContent.getCol(x);
            const len = col.length;
            for (let y = 0, i = 0; y < len; y++) {
                const gameSymbol = col[y];
                if (gameSymbol) {
                    let currPosY = gameSymbol.node.y;
                    let targetPosY = GameLogic.getBasePositionY(y);
                    let time = (currPosY - targetPosY) / GameLogic.GAME_SYMBOL_H * 0.2;
                    if (time) {
                        count++;
                        tween(gameSymbol.node)
                            .to(time, { y: targetPosY }, { easing: easing.quartIn })
                            .by(0.1, { y: 10 })
                            .by(0.1, { y: -10 })
                            .call(async () => {
                                count--;
                                if (count == 0) {
                                    let treasureNum = this.treasureRollResult ? this.treasureRollResult.length : 0;
                                    if (treasureNum <= 0 && SpinSystem.I.isDrawCard()) {
                                        await new Wait().second(1.0);
                                    }
                                    let delayTime = this.onPlayDropDownEnd(this.rollResult.reward);
                                    if (delayTime) {
                                        this.scheduleOnce(() => { this.onPlayDropEndDelay() }, delayTime);
                                    } else {
                                        // this.onPlayDropEndDelay()
                                    }
                                }
                            })
                            .start()
                    }
                }
            }
        }
    }

    onPlayDropDownEnd(reward: number): number {
        console.log("DropEnd");
        let delayTime = 0;
        if (this.treasureRollResult) {
            // 免费抽奖中
            if (this.treasureRollResult.length > 0) {
                // 继续
                this.treasureSpin();
                delayTime = 0;
            } else {
                delayTime = 0.1;
                let isShowTreasureReward = !!this.treasureReward;
                let isShowDrawCard = SpinSystem.I.isDrawCard();
                // 结束 弹免费3轮抽奖结果
                if (isShowTreasureReward) {
                    PanelCreator.pushTreasureWinPanel(this.treasureReward);
                }
                if (isShowDrawCard) {
                    SpinSystem.I.setJackpotTimes(0);
                    this.title.clearAllJackpot();
                    // 翻牌活动
                    PanelCreator.pushDrawcard();
                    WithdrawSystem.I.recordJackpot();
                }
                // 显示提现比率
                PanelCreator.pushWithdrawRate();

                this.treasureRollResult = null;
                this.treasureReward = 0;
            }
        } else {
            // 非免费抽奖中
            delayTime = 0.1;
            if (reward > 0) {
                let len = this.rollResult.cash.length;
                for (let i = 0; i < len; i++) {
                    reward += this.rollResult.cash[i][2];
                }
                // 开始弹奖励弹窗
                if (GuideSystem.I.getStep() == 1) {
                    PanelCreator.newUserRewarad(reward);
                } else {
                    PanelCreator.pushNormalReward(reward);
                }
            }
            if (SpinSystem.I.isDrawCard()) {
                SpinSystem.I.setJackpotTimes(0);
                this.title.clearAllJackpot();
                // 翻牌活动
                PanelCreator.pushDrawcard();
                WithdrawSystem.I.recordJackpot();
            }
            if (SpinSystem.I.isTreasure()) {
                SpinSystem.I.setTreasure(0);
                // 免费3轮抽奖
                PanelCreator.pushTreasurePanel(() => {
                    this.onTreasureSpinClick();
                });
            } else {
                // 显示提现比率
                PanelCreator.pushWithdrawRate();
            }
        }
        return delayTime;
    }

    onPlayDropEndDelay() {
        this.spinId += 1;
        console.log("Open Next");
    }

    playTitleAnim(spinResult: SpinResult) {
        let reward = 0;
        let len = this.rollResult.cash.length;
        for (let i = 0; i < len; i++) {
            reward += this.rollResult.cash[i][2];
        }
        reward += spinResult.reward;
        // titleWin动画展示
        this.title.setAmount(reward);
        this.title.winAnimtion();
    }

    async spin(isNewUser: boolean) {
        let result = null;
        if (isNewUser) {
            result = await NetworkSystem.getNewUserSpinResult();
        } else {
            result = await NetworkSystem.getSpinResult();
        }
        if (result.error) {
            Toast.show("Spin Result error");
            return;
        }
        AudioTools.sound(AUDIOS.startSpin);
        this.rollResult = result.data;
        SpinSystem.I.spinSuccess();
        SpinSystem.I.addTimes(-1);
        SpinSystem.I.addTreasure(this.rollResult.treasure.length);
        LotterySystem.I.addSpin();
        WithdrawSystem.I.recordSpin()
        this.startRoll(1.0);
    }

    async onTreasureSpinClick() {
        let result = await NetworkSystem.getSpinContinuousResult();
        if (result.error) {
            Toast.show("Spin Result error");
            return;
        }
        this.treasureRollResult = result.data;
        this.treasureReward = this.treasureRollResult.reduce((total, item) => {
            const value = item.reward;
            return total + (typeof value === 'number' ? value : 0);
        }, 0);

        this._CurrSpinId = this.spinId;
        this.treasureSpin();

    }

    treasureSpin() {
        this.rollResult = this.treasureRollResult.shift();
        this.startRoll(1.0);
    }

    getCashReward(x: number, y: number) {
        return this.rollResult.cash.find((value: number[]) => {
            return value[0] == x && value[1] == y;
        });
    }
}

class SlotsContent {

    private readonly COL_SIZE: number = 5;

    private list: GameSymbol[][] = null;

    init() {
        this.list = [];
        for (let i = 0; i < COL_SIZE; i++) {
            this.list.push([]);
        }
        return this;
    }

    push(x: number, gameSymbol: GameSymbol) {
        return this.list[x].push(gameSymbol);
    }

    add(x: number, y: number, gameSymbol: GameSymbol) {
        this.list[x][y] = gameSymbol;
    }

    remove(x: number, y: number) {
        return this.list[x].splice(y, 1);
    }

    setEmpty(x: number, y: number) {
        return this.list[x][y] = null;
    }

    shift(x: number) {
        return this.list[x].shift();
    }

    get(x: number, y: number): GameSymbol {
        return this.list[x][y];
    }

    colSize() {
        return this.list.length;
    }

    getCol(idx: number) {
        return this.list[idx];
    }

    removeTop7() {

        // 清除最开始的7行
        for (let x = 0; x < COL_SIZE; x++) {
            const col = this.list[x];
            let delected = col.splice(0, 7);
            for (let i = 0; i < delected.length; i++) {
                delected[i].node.destroy();
            }
        }
    }

    removeAllEmpty() {

    }
}


