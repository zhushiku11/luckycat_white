import { _decorator, Button, Component, easing, find, Label, Node, RichText, sp, Sprite, tween } from 'cc';
import { CurrencyType, Language } from 'db://assets/doge/framework/language/Language';
import { UserSystem } from '../../system/UserSystem';
import { ACoins, AMoney } from 'db://assets/doge/framework/common/Currency';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { AD_TYPE, REWARD_TYPE } from 'db://assets/native_interface/NI';
import { WithdrawSystem } from '../../system/WithdrawSystem';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { ADInfoSystem } from '../../system/ADInfoSystem';
import { SpriteSwitcher } from 'db://assets/main/script/component/SpriteSwitcher';
import { SpinSystem } from '../../system/SpinSystem';
import AudioTools from 'db://assets/doge/framework/common/AudioTools';
import { AUDIOS } from '../../../constant/Constant';
const { ccclass, property } = _decorator;

@ccclass('TreasurePanel')
export class TreasurePanel extends Component implements IPanel {
    @property(Node)
    private bg: Node = null;
    @property(Node)
    private num: Node = null;
    @property(Node)
    private getFreeUi: Node = null;
    @property(Node)
    private startBtn: Node = null;

    private startedCallback: Function = null;

    afterOpenEffect(target: Node) {
        AudioTools.sound(AUDIOS.treasureShow);
    };

    onKill() {
        AudioTools.sound(AUDIOS.treasureClose);
    };

    onInit(startedCallback: Function) {
        this.startedCallback = startedCallback;
        this.bg.alpha = 0;
        this.bg.scales = 1.2;
        this.startBtn.active = false;
        this.startBtn.scales = 0;
        this.num.getComponent(Label).string = SpinSystem.I.getTreasureSpinTimes().toString();
        tween(this.bg).to(0.5, { alpha: 255 }).call(() => {
            this.startBtn.active = true;
            tween(this.bg).to(6, { scales: 1 }).call(() => {

            }).start();
        }).start();

        //
        switch (Language.currency) {
            case CurrencyType.US:
                this.getFreeUi.getComponent(SpriteSwitcher).index(0);
                break;
            case CurrencyType.BR:
                this.getFreeUi.getComponent(SpriteSwitcher).index(1);
                break;
            case CurrencyType.ID:
                this.getFreeUi.getComponent(SpriteSwitcher).index(2);
                break;
        }

        tween(this.startBtn)
            .to(0.4, { scales: 1.0 }, { easing: easing.backOut })
            .start();
    };

    onStartClick() {
        PanelFactory.close(TreasurePanel);
        this.startedCallback && this.startedCallback();
    }

    onCloseBtnClick() {
    }
}


