import { _decorator, Component, Label, Sprite } from 'cc';
import { Language } from 'db://assets/doge/framework/language/Language';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { UserSystem } from '../../system/UserSystem';
import { LevelSystem } from '../../system/LevelSystem';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { AD_TYPE, REWARD_TYPE } from 'db://assets/native_interface/NI';
import { SUBGAME } from '../../../constant/Constant';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
const { ccclass, property } = _decorator;

@ccclass('TimeoutPanel')
export class TimeoutPanel extends Component implements IPanel {


    @property(Label)
    private tips: Label = null;
    @property(Label)
    private percent: Label = null;
    @property(Sprite)
    private progress: Sprite = null;
    @property(Label)
    private time: Label = null;

    onInit(percent: number) {
        this.tips.string = Language.getWord("l_timeoutTips", ((1 - percent) * 100).toFixed(2));
        this.percent.string = `${(percent * 100).toFixed(2)}%`;
        this.progress.fillRange = percent;
        this.time.string = `${LevelSystem.I.getReviveTime()}s`;
    };

    async onFreeBtnClick() {
        // 广告购买
        UserSystem.I.getAdReward(AD_TYPE.VIDEO, REWARD_TYPE.NONE, 0, (isErr: boolean, rewardA: number, rewardB: number) => {
            if (isErr) {
                return;
            }
            this.node && PanelFactory.close(TimeoutPanel);
            if (rewardA > 0 || rewardB > 0) {
                // 广告奖励
                UserSystem.I.congratulationsMoney(rewardA, rewardB, 0);
            }
            // 增加时间
            getEventEmiter().emit(SUBGAME.FUNC.GAME_ADD_TIME);
        })
    }

    onReplayBtnClick() {
        this.node && PanelFactory.close(TimeoutPanel);
        LevelSystem.I.replay();
    }
}


