import { _decorator, Component, easing, EventTouch, find, instantiate, Label, Node, Prefab, Sprite, tween, v3 } from 'cc';
import { WithdrawSystem } from '../../system/WithdrawSystem';
import {  AMoney } from 'db://assets/doge/framework/common/Currency';
import { CurrencyType, Language } from 'db://assets/doge/framework/language/Language';
import { Toast } from 'db://assets/doge/framework/init';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { PlayerSystem } from 'db://assets/main/script/system/PlayerSystem';
import UIHelper from 'db://assets/main/script/common/UIHelper';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { MAIN } from 'db://assets/main/constant/Constant';
import { NI } from 'db://assets/native_interface/NI';
import { SUBGAME } from '../../../constant/Constant';
import { LevelSystem } from '../../system/LevelSystem';
import { PanelCreator } from '../creator/PanelCreator';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { ADInfoSystem } from '../../system/ADInfoSystem';
import { ScoreSystem } from '../../system/ScoreSystem';
const { ccclass, property } = _decorator;

@ccclass('LevelWithdrawPanel')
export class LevelWithdrawPanel extends Component implements IPanel {

    @property(Prefab)
    private moneyAnim: Prefab = null;

    @property([Node])
    private taskItemList: Node[] = [];
    @property(Sprite)
    private progress: Sprite = null;
    @property(Label)
    private percent: Label = null;
    @property(Label)
    private tips: Label = null;

    protected onEnable(): void {
        getEventEmiter().on(MAIN.FUNC.MOBILE_BACK, this.onSystemBack, this);
    }

    protected onDisable(): void {
        getEventEmiter().off(MAIN.FUNC.MOBILE_BACK, this.onSystemBack, this);
    }

    onSystemBack() {
        this.onBackBtnClick();
    }

    afterCloseEffect() {
        NI.currentPage(0);
    }

    onInit() {
        NI.currentPage(2);
        this.refreshTips();
        let info = WithdrawSystem.I.getLevelWithdrawInfo();
        let state = WithdrawSystem.I.getLevelWithdrawState();
        for (let i = 0; i < this.taskItemList.length; i++) {
            const item = this.taskItemList[i];
            let progress = this.getLevelCondition() / info[i].condition;

            find("Title", item).getComponent(Label).string = Language.getWord("l_taskTitle", info[i].condition.toString());
            find("Progress", item).getComponentInChildren(Sprite).fillRange = progress;
            find("Progress", item).getComponentInChildren(Label).string = `${this.getLevelCondition()}/${info[i].condition}`;
            find("Price", item).getComponent(Label).string = Language.getWordByCurrency("l_money", Language.getCurrSym(), AMoney.string(info[i].reward));
            let claimBtn = find("ClaimBtn", item);
            let claimedBtn = find("ClaimedBtn", item);
            let inprogressBtn = find("Inprogress", item);
            claimBtn.active = false;
            claimedBtn.active = false;
            inprogressBtn.active = false;
            if (!!state[i].isClaim) {
                claimedBtn.active = true;
            } else if (progress >= 1) {
                claimBtn.active = true;
            } else {
                inprogressBtn.active = true;
            }
        }
    };

    refreshTips() {
        let percent = 0;
        let price = 0;
        let level = 300;
        let loginDay = 50;
        let loginDayLevel = 10;
        let ad = 200000;
        switch (Language.currency) {
            case CurrencyType.ID:
                price = 100000;
                break;
            case CurrencyType.BR:
            case CurrencyType.US:
                price = 2000;
                break;
        }

        if (!AMoney.isEnough(price)) {
            // 金额未达标
            percent = AMoney.value() / price;
            this.tips.string = Language.getWord("l_amountCondition", Language.getCurrSym(), AMoney.string(price), Language.getCurrSym(), AMoney.string(price - AMoney.value()));
        } else if (this.getLevelCondition() < level) {
            // 关卡未达标
            let count2048 = this.getLevelCondition();
            percent = count2048 / level;
            this.tips.string = Language.getWord("l_levelCondition", `${level}`, `${level - count2048}`);
        } else if (PlayerSystem.I.getLoginDay(loginDayLevel).length < loginDay) {
            let dayInfo = PlayerSystem.I.getLoginDay(loginDayLevel);
            // 累计登录天数未达标
            percent = dayInfo.length / loginDay;
            this.tips.string = Language.getWord("l_loginCondition", `${loginDay - dayInfo.length}`, `${loginDayLevel}`);
        } else if (ADInfoSystem.I.getTotalAdCount() < ad) {
            // 视频数量未达标
            percent = ADInfoSystem.I.getTotalAdCount() / ad;
            this.tips.string = Language.getWord("l_adCondition", `${ad}`, `${ad - ADInfoSystem.I.getTotalAdCount()}`);
        } else {
            percent = 1;
            this.tips.string = Language.getWord("l_completeCondition");
        }
        this.progress.fillRange = percent;
        this.percent.string = Language.getWord("l_text2", (percent * 100).toFixed(2), "%");
    }

    onOpenEffect(target: Node, next: () => void) {
        next();
    }

    onCloseEffect(target: Node, next: () => void) {
        next();
    }

    onClaimBtnClick(event: EventTouch, arg0: string) {
        let index = parseInt(arg0);
        let info = WithdrawSystem.I.getLevelWithdrawInfo()[index];

        AMoney.add(info.reward);

        let target = find("Content/Amount", this.node);
        let icon = find("Icon", target);
        let num = find("Num", target);
        let moneyAnim = this.moneyAnim;
        UIHelper.showAMoneyFly(find("Canvas/Popup"), event.target.worldPosition, icon, (idx: number, last: number) => {
            if (idx == last) {
                AMoney.refresh();
                this.node && this.refreshTips();
            }
            if (idx == 0) {
                if (num && num.parent) {
                    let anim = instantiate(moneyAnim);
                    anim.parent = target;
                    anim.position = v3(num.position);
                    anim.getComponentInChildren(Sprite).spriteFrame = icon.getComponent(Sprite).spriteFrame;
                    tween(anim)
                        .by(1.0, { position: v3(0, 50, 0) }, { easing: easing.cubicOut })
                        .to(0.2, { alpha: 0 })
                        .removeSelf()
                        .start();
                    anim.getComponentInChildren(Label).string = Language.getWordByCurrency("l_money1", "+", Language.getCurrSym(), AMoney.string(info.reward));
                }
            }
        })

        WithdrawSystem.I.claimLevelWithdraw(index);
        let claimBtn = find("ClaimBtn", this.taskItemList[index]);
        let claimedBtn = find("ClaimedBtn", this.taskItemList[index]);
        let inprogressBtn = find("Inprogress", this.taskItemList[index]);
        claimBtn.active = false;
        claimedBtn.active = true;
        inprogressBtn.active = false;
    }

    onClaimedBtnClick() {
        Toast.show(Language.getWord("l_claimedTips"));
    }

    onInprogressBtnClick(event: EventTouch, arg0: string) {
        let count2048 = this.getLevelCondition();
        let info = WithdrawSystem.I.getLevelWithdrawInfo()[parseInt(arg0)];
        Toast.show(Language.getWord("l_inprogressTips", (info.condition - count2048).toString()));
    }

    onWithdrawBtnClick() {
        let str = null;
        if (this.progress.fillRange >= 1) {
            str = Language.getWord("l_completeWithdraw");
        } else {
            str = Language.getWord("l_notWithdraw");
        }
        Toast.show(str);
    }

    onBackBtnClick() {
        this.node && PanelFactory.close(LevelWithdrawPanel);
    }

    onRecordBtnClick() {
        PanelCreator.withdrawRecord();
    }

    onFAQBtnClick() {
        PanelCreator.withdrawFAQ();
    }

    private getLevelCondition() {
        return ScoreSystem.I.getGame2048();
        // return LevelSystem.I.getCurrLevel();
    }
}


