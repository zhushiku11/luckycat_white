import { _decorator, Component, find, Label, Node, Sprite } from 'cc';
import { AMoney, BMoney } from 'db://assets/doge/framework/common/Currency';
import { Language } from 'db://assets/doge/framework/language/Language';
import { UserSystem } from '../../system/UserSystem';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import UIHelper from 'db://assets/main/script/common/UIHelper';
import { SpriteSwitcher } from 'db://assets/main/script/component/SpriteSwitcher';
import { AD_TYPE, REWARD_TYPE } from 'db://assets/native_interface/NI';
import { RES_NAME } from '../../../constant/Constant';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
const { ccclass, property } = _decorator;

const REWARD_TITLE = ["l_doubleRewardT", "l_lotsofT", "l_lotsofT", "l_smallAmountT", "l_surpriseT", "l_smallAmountT",];
const REWARD_ICON = [4, 0, 3, 1, 2, 5];

@ccclass('SlotRewardPanel')
export class SlotRewardPanel extends Component implements IPanel {

    @property(Node)
    private title: Node = null;
    @property(Node)
    private amoney: Node = null;
    @property(Node)
    private bmoney: Node = null;
    @property(Node)
    private icon: Node = null;
    @property(Node)
    private rewardBtn: Node = null;
    @property(Node)
    private okBtn: Node = null;

    private rewardA: number = 0;
    private rewardB: number = 0;
    private slotgameNode: Node = null;

    async onInit(slotgameNode: Node, rewardType: number, rewardA: number, rewardB: number) {
        this.slotgameNode = slotgameNode;
        if (REWARD_ICON[rewardType] > 2) {
            this.rewardBtn.active = true;
            this.okBtn.active = false;
            // this.batchId = await ADSystem.I.getBatchIdObj();
            this.rewardB = rewardB;
        } else {
            this.rewardBtn.active = false;
            this.okBtn.active = true;
        }

        this.rewardA = rewardA;

        this.title.getComponent(Label).string = Language.getWord(REWARD_TITLE[rewardType]);
        // this.icon.getComponent(Sprite).index(REWARD_ICON[reward]);
        this.icon.getComponent(Sprite).spriteFrame = await Language.getImageByCurrency(`rewardIcon${REWARD_ICON[rewardType]}`, RES_NAME);
        this.amoney.getComponentInChildren(Label).string = Language.getWordByCurrency("l_money", Language.getCurrSym(), AMoney.string(this.rewardA));
        if (this.rewardB > 0) {
            this.bmoney.getComponentInChildren(Label).string = Language.getWordByCurrency("l_text", BMoney.string(this.rewardB));
        } else {
            this.bmoney.active = false;
        }
    };

    activate(isNew: boolean) {
        if (isNew) {
            console.log("SlotReward activate new");
        } else {
            console.log("SlotReward deactivate unObscured");
        }
    };

    deactivate(isRemove: boolean) {
        if (isRemove) {
            console.log("SlotReward deactivate remove");
        } else {
            console.log("SlotReward deactivate obscured");
        }
    };

    onOKBtnClick() {
        if (this.rewardA > 0) {
            let target = find("Content/Game/MoneyTitle/AMoney", this.slotgameNode);
            let icon = find("Icon", target);
            // 飞钱动画
            UIHelper.showAMoneyFly(find("Canvas/Popup"), this.icon.worldPosition, icon, (idx: number, last: number) => {
                if (idx == last) {
                    AMoney.refresh();
                }
            });
        }
        // 广告奖励
        if (this.rewardB > 0) {
            let target = find("Content/Game/MoneyTitle/BMoney", this.slotgameNode);
            let icon = find("Icon", target);
            // 飞钱动画
            UIHelper.showBMoneyFly(find("Canvas/Popup"), this.icon.worldPosition, icon, (idx: number, last: number) => {
                if (idx == last) {
                    BMoney.refresh();
                }
            });
        }
        this.node && PanelFactory.close(SlotRewardPanel);
    }

    async onRewardBtnClick() {
        UserSystem.I.getAdReward(AD_TYPE.VIDEO, REWARD_TYPE.DELAY_REWARD, this.rewardA, (isErr: boolean, rewardA: number, rewardB: number) => {
            this.node && PanelFactory.close(SlotRewardPanel);
            if (isErr) {
                return;
            }
            if (rewardA > 0) {
                let target = find("Content/Game/MoneyTitle/AMoney", this.slotgameNode);
                let icon = find("Icon", target);
                // 飞钱动画
                UIHelper.showAMoneyFly(find("Canvas/Popup"), this.icon.worldPosition, icon, (idx: number, last: number) => {
                    if (idx == last) {
                        AMoney.refresh();
                    }
                });
            }
            // 广告奖励
            if (rewardB > 0) {
                let target = find("Content/Game/MoneyTitle/BMoney", this.slotgameNode);
                let icon = find("Icon", target);
                // 飞钱动画
                UIHelper.showBMoneyFly(find("Canvas/Popup"), this.icon.worldPosition, icon, (idx: number, last: number) => {
                    if (idx == last) {
                        BMoney.refresh();
                    }
                });
            }
        })
    }

    onRejectBtnClick() {
        this.node && PanelFactory.close(SlotRewardPanel);
    }
}


