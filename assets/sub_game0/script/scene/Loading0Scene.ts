import { _decorator, Component, Node, Sprite } from 'cc';
import AudioTools from 'db://assets/doge/framework/common/AudioTools';
import { EDITOR } from 'cc/env';
import { Language } from 'db://assets/doge/framework/language/Language';
import { StorageBox } from 'db://assets/doge/framework/common/StorageBox';
import { AUDIOS, PRELOAD, RES_NAME, SCENES_NAME } from '../../constant/Constant';
import { NI } from 'db://assets/native_interface/NI';
import { UserSystem } from '../system/UserSystem';
import { Loader, SceneLoader } from 'db://assets/doge/framework/init';
import { PlayerSystem } from 'db://assets/main/script/system/PlayerSystem';
import { PropSystem } from '../system/PropSystem';
import { CheckinSystem } from '../system/CheckinSystem';
import { WithdrawSystem } from '../system/WithdrawSystem';
import { GuideSystem } from '../system/GuideSystem';
import { GameMode, LevelSystem } from '../system/LevelSystem';
import { MapSystem } from '../system/MapSystem';
import { ScoreSystem, STORAGE } from '../system/ScoreSystem';
import { SlotGameSystem } from '../system/SlotGameSystem';
import { SpinSystem } from '../system/SpinSystem';
import { LotterySystem } from '../system/LotterySystem';
const { ccclass, property } = _decorator;

export const Variables = {
    currLv: "0",
    runningLv: "0",
    gameTarget: "1",
    game2048: "0",
    game1024: "0",
    score: "0",
    higherScore: "0",
    slotgame: "0",
    prop0Num: "0",
    prop1Num: "0",
    prop2Num: "0",
    prop3Num: "0",
    propPrice: "0",
    levelWithdraw: "0",
    rate: "0",

    spinTimes: "0",
    treasure: "0",
    jackpot: "0",
}

const defineVariable = () => {
    for (const key in Variables) {
        Language.defVariable(key, Variables[key]);
    }
}

if (EDITOR) {
    defineVariable();
}

@ccclass('Loading0Scene')
export class Loading0Scene extends Component {

    @property(Sprite)
    public progress: Sprite = null;
    @property(Node)
    public flag: Node = null;

    private loadingState: number = 0;

    protected onLoad(): void {
        NI.currentPage(0);
        this.progress.fillRange = 0;
        this.flag.x = this.progress.node.widths * (this.progress.fillRange - 0.5);
    }

    protected start(): void {
        defineVariable();
        this.init();
    }

    public async init() {
        // 初始化存储器
        StorageBox.init(`${RES_NAME}`);
        let gameData: GameDataResult = NI.syncGameData();
        // 用户系统初始化
        UserSystem.I.init(gameData.m0, gameData.rate);
        // 提现信息初始化
        await WithdrawSystem.I.init();
        // 道具初始化
        PropSystem.I.init();
        // 签到初始化
        CheckinSystem.I.init();
        // 引导初始化
        GuideSystem.I.init();
        SpinSystem.I.init(gameData.m3);
        LotterySystem.I.init();
        // 资源预加载
        Loader.init().bundle(RES_NAME).preLoad(PRELOAD.SPFRAME_FRAMES);
        // 加载全部地图配置
        // await MapSystem.init();
        // 预加载音乐音效
        await AudioTools.loadAudioRes(Object.values(AUDIOS), RES_NAME);
        // 玩家上线
        PlayerSystem.I.goOnline();
        UserSystem.I.updateRewardRate(WithdrawSystem.I.getAdCount());
        // 场景预加载
        SceneLoader.preloadScene(SCENES_NAME.Game);
    }

    public toNextScene() {
        LevelSystem.I.setRunningLv(LevelSystem.I.getCurrLevel(), GameMode.PASS);
        // 切换游戏场景
        SceneLoader.changeScene(SCENES_NAME.Game, () => {
            AudioTools.playBgm(AUDIOS.bgm);
        });
    }

    public async update() {
        let percent = 0;
        switch (this.loadingState) {
            case 0:
                percent = Loader.percent * 0.4 * 0.7 + 0.3;
                this.loadingState = Loader.isComplete() ? 1 : 0;
                break;
            case 1:
                percent = (SceneLoader.progress(SCENES_NAME.Game) * 0.6 + 0.4) * 0.7 + 0.3;
                this.loadingState = SceneLoader.isComplete(SCENES_NAME.Game) ? 2 : 1;
                break;
            case 2:
                this.toNextScene();
                this.loadingState = 3;
                break;
            default:
                return;
        }
        if (percent > this.progress.fillRange) {
            this.progress.fillRange = percent;
            this.flag.x = this.progress.node.widths * (this.progress.fillRange - 0.5);
            Language.updVariable("loadingPercent", (percent * 100).toFixed(0));
        }
    }
}