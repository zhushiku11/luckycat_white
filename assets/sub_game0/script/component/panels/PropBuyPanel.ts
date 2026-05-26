import { _decorator, Button, Component, Label, Node } from 'cc';
import { ACoins, AMoney } from 'db://assets/doge/framework/common/Currency';
import { Language } from 'db://assets/doge/framework/language/Language';
import { PropSystem, PropType } from '../../system/PropSystem';
import { Toast } from 'db://assets/doge/framework/init';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { SpriteSwitcher } from 'db://assets/main/script/component/SpriteSwitcher';
import { UserSystem } from '../../system/UserSystem';
import { SUBGAME } from '../../../constant/Constant';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { AD_TYPE, REWARD_TYPE } from 'db://assets/native_interface/NI';
import { PanelCreator } from '../creator/PanelCreator';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
const { ccclass, property } = _decorator;

const PRICE = [500, 800, 600, 600];

@ccclass('PropBuyPanel')
export class PropBuyPanel extends Component implements IPanel {

    @property(Node)
    private title: Node = null;
    @property(Node)
    private img: Node = null;
    @property(Node)
    private tips: Node = null;
    @property(Node)
    private claimBtn: Node = null;
    @property(Node)
    private claimTips: Node = null;

    private type: PropType = 0;

    onInit(type: PropType) {
        this.type = type;
        console.log("Prop buy type", this.type);
        this.title.getComponent(Label).string = Language.getWord(`l_propName${type}`);
        this.img.getComponent(SpriteSwitcher).index(this.type);
        this.tips.getComponent(Label).string = Language.getWord(`l_propDesc${type}`);
        this.onRefresh();
    }

    async onFreeBtnClick() {
        let count = PropSystem.I.getClaimCount(this.type);
        if (count >= 2) {
            return;
        }

        console.log("witch the video");
        let rewardA = UserSystem.I.getCashReward1();
        UserSystem.I.getAdReward(AD_TYPE.VIDEO, REWARD_TYPE.REWARD, rewardA, (isErr: boolean, rewardA: number, rewardB: number) => {
            if (isErr) {
                return;
            }
            if (rewardA > 0 || rewardB > 0) {
                // 广告奖励
                UserSystem.I.congratulationsMoney(rewardA, rewardB, 0);
            }
            // 增加
            PropSystem.I.add(this.type, 1);
            PropSystem.I.addClaimCount(this.type);
        });
        this.node && PanelFactory.close(PropBuyPanel);
    }

    onClaimBtnClick() {
        // let count = PropSystem.I.getClaimCount(this.type);
        // if (count < 2) {
        //     PropSystem.I.add(this.type, 1);
        //     // PropSystem.I.addClaimCount(this.type);
        //     this.onRefresh();
        //     this.node && PanelFactory.close();
        // }
        if (ACoins.isEnough(100)) {
            ACoins.use(100);
            PropSystem.I.add(this.type, 1);
            this.onRefresh();
            this.node && PanelFactory.close(PropBuyPanel);
        } else {
            Toast.show(Language.getWord("l_coinsNotEnough"));
        }
    }

    onCloseBtnClick() {
        this.node && PanelFactory.close(PropBuyPanel);
    }

    onRefresh() {
        let count = PropSystem.I.getClaimCount(this.type);
        this.claimTips.getComponent(Label).string = Language.getWord("l_dailyClaimLimit", count.toString(), "2");
        if (count >= 2) {
            this.claimBtn.setGray(true);
            this.claimBtn.getComponent(Button).interactable = false;
        }
    }
}


