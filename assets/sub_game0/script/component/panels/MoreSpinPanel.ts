import { _decorator, Component, Label, Node } from 'cc';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import AudioTools from 'db://assets/doge/framework/common/AudioTools';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { SpriteSwitcher } from 'db://assets/main/script/component/SpriteSwitcher';
import { AUDIOS, SUBGAME } from '../../../constant/Constant';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { Language } from 'db://assets/doge/framework/language/Language';
import { SpinSystem } from '../../system/SpinSystem';
import { Toast } from 'db://assets/doge/framework/init';
import { ACoins, AMoney, BMoney } from 'db://assets/doge/framework/common/Currency';
import { UserSystem } from '../../system/UserSystem';
import { AD_TYPE, REWARD_TYPE } from 'db://assets/native_interface/NI';
import { DrawcardRewardPanel } from './DrawcardRewardPanel';
const { ccclass, property } = _decorator;

const PRICE = [500, 800, 600, 600];

@ccclass('MoreSpinPanel')
export class MoreSpinPanel extends Component implements IPanel {

    @property(Node)
    private num: Node = null;


    onInit() {
        this.num.getComponent(Label).string = Language.getWord("l_text1", SpinSystem.I.getReplenishTimes().toString());
    }

    afterCloseEffect() {

    }

    onFreeBuyClick() {
        if (SpinSystem.I.getClaimTimes() >= SpinSystem.I.getClaimLimit()) {
            Toast.show(Language.getWord("l_timeUsedUp"));
            return;
        }
        SpinSystem.I.addClaimTimes();
        SpinSystem.I.addTimes(SpinSystem.I.getReplenishTimes());
    }

    onBuyClick() {
        let coins = 30;
        if (!ACoins.isEnough(coins)) {
            Toast.show(Language.getWord("l_coinsNotEnough"));
            return;
        }
        ACoins.use(coins);
        SpinSystem.I.addTimes(SpinSystem.I.getReplenishTimes());
        this.close();
    }

    onClaimClick() {
        let reward = UserSystem.I.getCashReward1();
        // 领取单倍奖励
        UserSystem.I.getAdReward(AD_TYPE.VIDEO, REWARD_TYPE.REWARD, reward, (isErr: boolean, rewardA: number, rewardB: number) => {
            if (isErr) {
                return;
            }
            // 广告奖励
            if (rewardA > 0 || rewardB > 0) {
                // 广告奖励
                UserSystem.I.congratulationsMoney(rewardA, rewardB);
            }
            // if (rewardA > 0) {
            //     AMoney.refresh();
            // }
            // if (rewardB > 0) {
            //     BMoney.refresh();
            // }
            SpinSystem.I.addTimes(SpinSystem.I.getReplenishTimes());
        })
        this.node && PanelFactory.close(MoreSpinPanel);
    }

    close() {
        this.node && PanelFactory.close(MoreSpinPanel);
    }

    onCloseClick() {
        this.close();
    }
}


