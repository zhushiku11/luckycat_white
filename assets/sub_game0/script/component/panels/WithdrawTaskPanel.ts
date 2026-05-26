import { _decorator, Component, Label, Node, RichText } from 'cc';
import { Clock } from 'db://assets/doge/framework/common/Clock';
import { AMoney } from 'db://assets/doge/framework/common/Currency';
import { Language } from 'db://assets/doge/framework/language/Language';
import { UserSystem } from '../../system/UserSystem';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { WithdrawTaskSystem } from '../../system/WithdrawTaskSystem';
import { AD_TYPE, REWARD_TYPE } from 'db://assets/native_interface/NI';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { PanelCreator } from '../creator/PanelCreator';
const { ccclass, property } = _decorator;

@ccclass('WithdrawTaskPanel')
export class WithdrawTaskPanel extends Component implements IPanel {

    @property(Node)
    private progressTips: Node = null;
    @property(Node)
    private progressNum: Node = null;
    @property(Node)
    private refrehsTime: Node = null;
    @property(Node)
    private goBtn: Node = null;
    @property(Node)
    private withdrawBtn: Node = null;
    @property(Node)
    private withdrawedBtn: Node = null;

    private endCb: Function = null;
    private btnLock: boolean = false;

    onInit(endCb?: Function) {
        this.endCb = endCb;
        WithdrawTaskSystem.I.sync(() => {
            this.showTips();
            this.showBtn();
        })
        this.showTips();
        this.showBtn();
    };

    afterCloseEffect() {
        this.endCb && this.endCb();
    }

    showTips() {
        let complete = WithdrawTaskSystem.I.getCompleteCount();
        let condition = WithdrawTaskSystem.I.getCondition();
        let reward = WithdrawTaskSystem.I.getReward();
        let refreshTimeSec = WithdrawTaskSystem.I.getRefreshTime();
        let rate = WithdrawTaskSystem.I.getRate();
        this.progressTips.getComponent(RichText).string = Language.getWord("l_withdrawTaskTips", condition.toString(), Language.getCurrSym(), AMoney.string(reward));
        this.progressNum.getComponent(Label).string = Language.getWord("l_text5", complete.toString(), condition.toString());
        this.refrehsTime.getComponent(Label).string = Language.getWord("l_withdrawTaskRefresh", Clock.getClock(refreshTimeSec, "hHmMIN").toLowerCase());
    }
    showBtn() {
        let state = WithdrawTaskSystem.I.getReceiveState();
        this.goBtn.active = false;
        this.withdrawBtn.active = false;
        this.withdrawedBtn.active = false;
        switch (state) {
            case 1:
                this.goBtn.active = true;
                this.refrehsTime.y = -140;
                break;
            case 2:
                this.withdrawBtn.active = true;
                this.refrehsTime.y = -140;
                break;
            case 3:
                this.withdrawedBtn.active = true;
                this.refrehsTime.y = -190;
                break;
            default:
                this.goBtn.active = true;
                this.refrehsTime.y = -140;
                break;
        }
    }

    async onGoBtnClick() {
        if (this.btnLock) {
            return;
        }
        this.btnLock = true;
        //打开广告 领取每日任务奖励
        UserSystem.I.getAdReward(AD_TYPE.VIDEO, REWARD_TYPE.TASK, WithdrawTaskSystem.I.getTaskId(), (isErr: boolean, rewardB: number) => {
            this.btnLock = false;
            if (isErr) {
                return;
            }
            // 更新奖励数值
            WithdrawTaskSystem.I.sync(() => {
                // 更新文本
                this.showTips();
                this.showBtn();
            });
        });
    }

    onWithdrawBtnClick() {
        if (this.btnLock) {
            return;
        }
        this.btnLock = true;
        // 打开任务提现页面
        PanelCreator.withdrawInfoTask(WithdrawTaskSystem.I.getReward(), WithdrawTaskSystem.I.getTaskId(), (isWithdraw: number) => {
            this.btnLock = false;
            if (isWithdraw) {
                WithdrawTaskSystem.I.sync(() => {
                    // 更新文本
                    this.showTips();
                    this.showBtn();
                });
            }
        })
    }

    onCloseBtnClick() {
        this.node && PanelFactory.close(WithdrawTaskPanel);
    }
}


