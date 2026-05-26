import { Component, PhysicsSystem2D, Sprite, Vec2, _decorator, Node, profiler, sys } from "cc";
import { StorageBox } from "db://assets/doge/framework/common/StorageBox";
import { DogeFrawmwork, Loader, SceneLoader } from "db://assets/doge/framework/init";
import { Language } from "db://assets/doge/framework/language/Language";
import { ForkFlag, ForkTools } from "db://assets/doge/framework/fork/ForkTools";
import AudioTools from "db://assets/doge/framework/common/AudioTools";
import { PlayerSystem } from "../system/PlayerSystem";
import { NI } from "db://assets/native_interface/NI";
import { AMoney, Currency } from "db://assets/doge/framework/common/Currency";
import { AUDIOS, MAIN, PACKAGE_NAME, PRELOAD, SCENES_NAME, STORAGE } from "../../constant/Constant";
import { EDITOR } from "cc/env";
import { NetworkSystem } from "db://assets/sub_game0/script/system/NetworkSystem";
const { ccclass, property } = _decorator;

export const Variables = {
    loadingPercent: "0",
    currSym: "$",
    AMoney: "0",
    BMoney: "0",
    BMoney1: "0",
    ACoins: "0",
}

const defineVariable = () => {
    for (const key in Variables) {
        Language.defVariable(key, Variables[key]);
    }
}

if (EDITOR) {
    defineVariable();
}

@ccclass('LoadingScene')
export default class LoadingScene extends Component {

    @property(Sprite)
    public progress: Sprite = null;
    @property(Node)
    public flag: Node = null;

    private loadingState: number = 0;

    public onLoad() {
        NI.currentPage(0);
        defineVariable();
        profiler.hideStats();
        DogeFrawmwork.init();
        this.progress.fillRange = 0;
        this.flag.x = this.progress.node.widths * (this.progress.fillRange - 0.5);
    }

    public async start() {
        NetworkSystem.init(PACKAGE_NAME);
        // 获取SystemInfo
        let userInfo: UserInfoResult = NI.syncUser();
        // 玩家信息初始化
        PlayerSystem.I.init(userInfo);
        StorageBox.initGlobal(PlayerSystem.I.getAppID());
        // 获取游戏数据
        let gameData: GameDataResult = NI.syncGameData();
        // 初始化语言
        Language.init(PlayerSystem.I.getLanguage(), PlayerSystem.I.getCurrency());
        // 金币系统初始化
        let amoney = parseFloat(StorageBox.load(AMoney.KEY, gameData.m0.toString()));
        // let amoney = 999;
        let amoneyTime = parseInt(StorageBox.load(STORAGE.AMONEY_TIME, "0"));
        if (amoneyTime != 0 && new Date().getTime() > amoneyTime) {
            amoney = 0;
            console.log("clear amoney time");
        }
        Currency.init(amoney, gameData.m1, gameData.m2, 0);
        ForkTools.init(ForkFlag.B);
        // 资源预加载
        Loader.init().preLoad(PRELOAD.SPFRAME_FRAMES);
        // 预加载音乐音效
        await AudioTools.init().loadAudioRes(Object.values(AUDIOS));
        SceneLoader.preloadScene(SCENES_NAME.SubGame_0);
    }

    public async update() {
        let percent = 0;
        switch (this.loadingState) {
            case 0:
                percent = Loader.percent * 0.8 * 0.3;
                this.loadingState = Loader.isComplete() ? 1 : 0;
                break;
            case 1:
                percent = (SceneLoader.progress(SCENES_NAME.SubGame_0) * 0.2 + 0.8) * 0.3;
                this.loadingState = SceneLoader.isComplete(SCENES_NAME.SubGame_0) ? 2 : 1;
                break;
            case 2:
                console.log(SCENES_NAME.SubGame_0)
                SceneLoader.changeScene(SCENES_NAME.SubGame_0, () => { });
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
