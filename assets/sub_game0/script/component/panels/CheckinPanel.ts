import { _decorator, Button, color, Component, find, Label, Node, RichText, Sprite } from 'cc';
import { Language } from 'db://assets/doge/framework/language/Language';
import { CheckinSystem } from '../../system/CheckinSystem';
import { UserSystem } from '../../system/UserSystem';
import { AMoney, BMoney } from 'db://assets/doge/framework/common/Currency';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { AD_TYPE, REWARD_TYPE } from 'db://assets/native_interface/NI';
import { SUBGAME } from '../../../constant/Constant';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
const { ccclass, property } = _decorator;

@ccclass('CheckinPanel')
export class CheckinPanel extends Component implements IPanel {

    @property(Node)
    private tips: Node = null;
    @property([Node])
    private items: Node[] = [];
    @property(Node)
    private claimBtn: Node = null;

    onInit() {
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            const info = CheckinSystem.I.getInfoByDay(i);
            let num = find("Num", item).getComponent(Label);
            let maxLabel = find("Max", item);
            if (info.type == "amoney") {
                maxLabel.active = false;
                num.string = Language.getWordByCurrency("l_money", Language.getCurrSym(), AMoney.string(info.count));
            } else if (info.type == "bmoney") {
                maxLabel.active = true;
                num.string = Language.getWordByCurrency("l_text", BMoney.string(info.count));
            }
        }
        this.onRefresh();
    }

    onRefresh() {
        this.tips.getComponent(RichText).string = Language.getWord("l_checkinTips", Language.getCurrSym(), "1000", CheckinSystem.I.getCheckinDays().toString());
        let lastCheckedIndex = CheckinSystem.I.getLastCheckedIndex();
        if (CheckinSystem.I.todayCanCheckin() && lastCheckedIndex == 6) {
            for (let i = 0; i < this.items.length; i++) {
                const item = this.items[i];
                let check = find("check", item);
                check.active = false;
            }
        } else {
            for (let i = 0; i < this.items.length; i++) {
                const item = this.items[i];
                let check = find("check", item);
                check.active = false;
                if (i <= lastCheckedIndex) {
                    check.active = true;
                }
            }
        }
        this.claimBtn.getComponent(Sprite).grayscale = !CheckinSystem.I.todayCanCheckin();
        this.claimBtn.getComponent(Button).interactable = CheckinSystem.I.todayCanCheckin();
        this.claimBtn.getComponentInChildren(Label).outlineColor = CheckinSystem.I.todayCanCheckin() ? color(0, 114, 0, 255) : color(53, 52, 58, 255);
        this.claimBtn.getComponentInChildren(Sprite).node.active = CheckinSystem.I.todayCanCheckin();
    }

    async onClaimBtnClick() {
        let info = CheckinSystem.I.getCurrInfo();
        let reward = 0;
        if (info.type == "amoney") {
            reward = info.count;
        }
        UserSystem.I.getAdReward(AD_TYPE.VIDEO, REWARD_TYPE.REWARD, reward, (isErr: boolean, rewardA: number, rewardB: number) => {
            if (isErr) {
                return;
            }
            if (rewardA > 0 || rewardB > 0) {
                // 广告奖励
                UserSystem.I.congratulationsMoney(rewardA, rewardB, 0);
            }
            CheckinSystem.I.checkIn();
            this.onRefresh();
        })
        this.node && PanelFactory.close(CheckinPanel);
    }

    onCloseBtnClick() {
        this.node && PanelFactory.close(CheckinPanel);
    }
}


