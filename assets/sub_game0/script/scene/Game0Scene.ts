import { _decorator, Button, Component, director, find, Label, Node, Prefab, tween } from 'cc';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { LoadingPanel } from '../component/panels/LoadingPanel';
import { SCENES_NAME, SUBGAME } from '../../constant/Constant';
import { Panel } from 'db://assets/doge/framework/panel/Panel';
import { CurrencyType, Language } from 'db://assets/doge/framework/language/Language';
import { WithdrawSystem } from '../system/WithdrawSystem';
import { AMoney, BMoney } from 'db://assets/doge/framework/common/Currency';
import { PlayerSystem } from 'db://assets/main/script/system/PlayerSystem';
import { Clock } from 'db://assets/doge/framework/common/Clock';
import { StorageBox } from 'db://assets/doge/framework/common/StorageBox';
import { CheckinSystem } from '../system/CheckinSystem';
import { GuideSystem } from '../system/GuideSystem';
import { GuidePanel } from '../component/panels/GuidePanel';
import { NI } from 'db://assets/native_interface/NI';
import { LevelSystem } from '../system/LevelSystem';
import { PanelCreator } from '../component/creator/PanelCreator';
import { GamePanel } from '../component/panels/GamePanel';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
const { ccclass, property } = _decorator;

@ccclass('Game0Scene')
export class Game0Scene extends Component {
    @property(Node)
    private gamePanel: Node = null;
    @property(Node)
    private guidePanl: Node = null;
    @property(Node)
    private amoney: Node = null;
    @property(Node)
    private bmoney: Node = null;
    // @property(Node)
    // private levelWithdraw: Node = null;
    // @property(Node)
    // private withdrawTask: Node = null;
    // @property(Node)
    // private slotEntrance: Node = null;

    @property(Node)
    private withdrawTips: Node = null;
    // @property(Node)
    // private onlineReward: Node = null;


    private onlineTime: number = 0;
    private onlineRewardNum: number = 0;
    private frame: Node = null;

    public static showLoading() {
        find("Canvas/Loading").getComponent(LoadingPanel).showLoading();
    }

    public static hideLoading() {
        find("Canvas/Loading").getComponent(LoadingPanel).hideLoading();
    }

    protected onEnable(): void {
        getEventEmiter().on(SUBGAME.SCENE.MAIN, this.toMainScene, this);
        getEventEmiter().on(SUBGAME.SCENE.GAME, this.restartGame, this);

        Language.on("@AMoney", this.onAMoneyChange, this);
        Language.on("@BMoney", this.onBMoneyChange, this);
    }

    protected onDisable(): void {
        getEventEmiter().off(SUBGAME.SCENE.MAIN, this.toMainScene, this);
        getEventEmiter().off(SUBGAME.SCENE.GAME, this.restartGame, this);

        Language.off("@AMoney", this.onAMoneyChange, this);
        Language.off("@BMoney", this.onBMoneyChange, this);
    }

    protected onLoad(): void {
        NI.currentPage(0);

        this.onAMoneyChange();
        this.onBMoneyChange();

        tween(this.amoney.getComponentInChildren(Button).node)
            .to(1, { scales: 1.1 })
            .to(1, { scales: 1.0 })
            .union()
            .repeatForever()
            .start();
        tween(this.bmoney.getComponentInChildren(Button).node)
            .to(1, { scales: 1.1 })
            .to(1, { scales: 1.0 })
            .union()
            .repeatForever()
            .start();

        // switch (Language.currency) {
        //     case CurrencyType.US:
        //         this.levelWithdraw.active = false;
        //         this.withdrawTask.active = false;
        //         this.slotEntrance.active = false;
        //         tween(this.levelWithdraw)
        //             .to(1, { scales: 1.1 })
        //             .to(1, { scales: 1.0 })
        //             .union()
        //             .repeatForever()
        //             .start();
        //         break;
        //     case CurrencyType.ID:
        //         this.levelWithdraw.active = true;
        //         this.withdrawTask.active = false;
        //         this.slotEntrance.active = false;
        //         tween(this.levelWithdraw)
        //             .to(1, { scales: 1.1 })
        //             .to(1, { scales: 1.0 })
        //             .union()
        //             .repeatForever()
        //             .start();
        //         break;
        //     case CurrencyType.BR:
        //         this.levelWithdraw.active = false;
        //         this.withdrawTask.active = true;
        //         this.slotEntrance.active = false;
        //         tween(this.withdrawTask)
        //             .to(1, { scales: 1.1 })
        //             .to(1, { scales: 1.0 })
        //             .union()
        //             .repeatForever()
        //             .start();
        //         break;
        // }
    }

    protected start(): void {
        PanelFactory.openWithInstance(Panel.init(this.gamePanel, GamePanel), GamePanel);

        if (PlayerSystem.I.isNewUser()) {
            Panel.init(this.guidePanl, GuidePanel);
            GuideSystem.I.show();
        } else {
            this.guidePanl.destroy();
            if (CheckinSystem.I.canPopup(new Date())) {
                // 弹出签到
                PanelCreator.pushCheckin();
                CheckinSystem.I.setPopupTime(new Date());
            }
        }
        // 在线奖励
        // this.openOnlineReward();
        // Panel.init(this.giftBox, GiftBoxPanel);
    }

    restartGame(level: number, preLevel: number) {
    }

    onAMoneyChange() {
        let label = this.withdrawTips.getComponentInChildren(Label);
        let withdrawInfo = WithdrawSystem.I.getWithdrawInfo();
        let infoItem = withdrawInfo.find((value) => {
            return AMoney.value() < value.price;
        })
        if (infoItem) {
            this.withdrawTips.active = true;
            let num = infoItem.price - AMoney.value();
            label.string = Language.getWord("l_withdrawTips", Language.getCurrSym(), AMoney.string(num), Language.getCurrSym(), AMoney.string(infoItem.price));
        } else {
            this.withdrawTips.active = false;
        }
    }

    onBMoneyChange() {
        if (PlayerSystem.I.isNewUser()) {
            return;
        }

        let current = BMoney.value1();
        let target = 0;
        switch (Language.currency) {
            case CurrencyType.US:
                target = 0.2;
                break;
            case CurrencyType.BR:
                target = 0.3;
                break;
            case CurrencyType.ID:
                target = 50;
                break;
        }

        let currTime = Clock.zero(new Date()).getTime();
        let time = parseInt(StorageBox.load("WITHDRAW_GUIDE", "0"));

        if (time != currTime && current >= target) {
            PanelCreator.pushWithdrawGuide();
            StorageBox.save("WITHDRAW_GUIDE", currTime.toString())
        }
    }

    // openOnlineReward() {
    //     switch (Language.currency) {
    //         case CurrencyType.US:
    //             this.onlineReward.getComponentInChildren(SpriteSwitcher).index(0);
    //             break;
    //         case CurrencyType.BR:
    //             this.onlineReward.getComponentInChildren(SpriteSwitcher).index(1);
    //             break;
    //         case CurrencyType.ID:
    //             this.onlineReward.getComponentInChildren(SpriteSwitcher).index(2);
    //             break;
    //     }
    //     this.onlineTime = 60;
    //     let callback = (dt: number) => {
    //         this.onlineTime -= dt;
    //         let time = find("Time", this.onlineReward);
    //         let num = find("NumBg", this.onlineReward);
    //         let mask = find("Mask", this.onlineReward);
    //         let finger = find("Finger", this.onlineReward);
    //         if (this.onlineTime < 0) {
    //             this.onlineTime = 0;
    //         }
    //         if (this.onlineTime == 0) {
    //             num.active = true;
    //             time.active = false;
    //             finger.active = true;
    //             this.onlineReward.getComponent(Button).interactable = true;
    //             this.onlineRewardNum = UserSystem.I.getCashReward2();
    //             num.getComponentInChildren(Label).string = Language.getWordByCurrency("l_money", Language.getCurrSym(), AMoney.string(this.onlineRewardNum));
    //             this.unschedule(callback);
    //         } else {
    //             num.active = false;
    //             time.active = true;
    //             finger.active = false;
    //             this.onlineReward.getComponent(Button).interactable = false;
    //         }
    //         mask.getComponent(Sprite).fillRange = this.onlineTime / 60;
    //         time.getComponent(Label).string = `${Math.ceil(this.onlineTime)}s`;
    //     };
    //     this.schedule(callback, 0, macro.REPEAT_FOREVER, 0);
    // }

    // onOnlineRewardClick() {
    //     AMoney.add(this.onlineRewardNum);
    //     UserSystem.I.congratulationsMoney(this.onlineRewardNum, 0, 0);
    //     this.openOnlineReward();
    // }

    onRestartBtnClick() {
        LevelSystem.I.replay();
    }

    onSlotEntranceClick() {
        PanelCreator.slotGamePanel();
    }

    onSettingClick() {
        PanelCreator.settingPanel();
    }

    onBackBtnClick() {
        getEventEmiter().emit(SUBGAME.SCENE.MAIN);
    }

    onCheckinBtnClick() {
        PanelCreator.checkin();
    }

    onLevelWithdrawBtnClick() {
        PanelCreator.levelWithdraw();
    }

    onWithdrawTaskBtnClick() {
        PanelCreator.withdrawTask();
    }

    onAMoneyWithdraw() {
        PanelCreator.WithdrawA();
    }

    onBMoneyWithdraw() {
        PanelCreator.WithdrawB();
    }

    onLotteryClick() {
        PanelCreator.lottery();
    }

    toMainScene() {
        Game0Scene.showLoading();
        // 场景预加载
        director.preloadScene(SCENES_NAME.Main, () => {
            director.loadScene(SCENES_NAME.Main, () => {
                Game0Scene.hideLoading();
            });
        });
    }
}


