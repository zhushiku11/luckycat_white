import { _decorator, Component, find, Label, Node, RichText, Sprite, tween } from 'cc';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { CurrencyType, Language } from 'db://assets/doge/framework/language/Language';
import AudioTools from 'db://assets/doge/framework/common/AudioTools';
import { LevelSystem } from '../../system/LevelSystem';
import { UserSystem } from '../../system/UserSystem';
import { AMoney } from 'db://assets/doge/framework/common/Currency';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { AD_TYPE, REWARD_TYPE } from 'db://assets/native_interface/NI';
import { SUBGAME, AUDIOS } from '../../../constant/Constant';
import { WithdrawSystem } from '../../system/WithdrawSystem';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { ADInfoSystem } from '../../system/ADInfoSystem';
import { SpriteSwitcher } from 'db://assets/main/script/component/SpriteSwitcher';
const { ccclass, property } = _decorator;

@ccclass('PassRewardPanel')
export class PassRewardPanel extends Component implements IPanel {

    @property(Node)
    private level: Node = null;

    @property(Node)
    private rewardA: Node = null;
    @property(Node)
    private singleReward: Node = null;
    @property(Node)
    private highest: Node = null;
    @property(Node)
    private claim: Node = null;
    @property(Node)
    private doubleClaimBtn: Node = null;
    @property(Node)
    private upItem: Node = null;
    @property(Node)
    private withdrawTips: Node = null;

    private rewardANum: number = 0;
    private lock: boolean = false;

    onInit(level: number, rewardA: number) {
        this.rewardANum = rewardA;
        this.level.getComponent(Label).string = Language.getWord("l_levelNum", level.toString());
        if (this.rewardANum) {
            this.rewardA.getComponentInChildren(Label).string = Language.getWordByCurrency("l_money", Language.getCurrSym(), AMoney.string(this.rewardANum * 2));
        } else {
            this.rewardA.active = false;
        }
        switch (Language.currency) {
            case CurrencyType.US:
                this.highest.active = true;
                break;
            case CurrencyType.BR:
                this.highest.active = false;
                break;
        }
        this.singleReward.getComponentInChildren(Label).string = Language.getWordByCurrency("l_money", Language.getCurrSym(), AMoney.string(this.rewardANum));

        let info = WithdrawSystem.I.getRewardRateInfo();
        let adCount = WithdrawSystem.I.getAdCount();
        let startRate = UserSystem.I.getRate();
        let endRate = 0;
        let limit = 0;
        if (startRate == info.sm_one_rate / 100) {
            endRate = info.sm_two_rate / 100;
            limit = info.sm_two;
        } else if (startRate == info.sm_two_rate / 100) {
            endRate = info.sm_three_rate / 100;
            limit = info.sm_three;
        } else if (startRate == info.sm_three_rate / 100) {
            endRate = info.sm_three_rate / 100;
            limit = info.sm_three;
        } else {
            endRate = info.sm_one_rate / 100;
            limit = info.sm_one;
        }
        find("Title", this.upItem).getComponent(Label).string = Language.getWord("l_upTips");
        find("Progress/Fg", this.upItem).getComponent(Sprite).fillRange = adCount / limit;
        find("Progress/Txt", this.upItem).getComponent(Label).string = Language.getWord("l_text5", `${adCount}`, `${limit}`);
        find("LeftTxt", this.upItem).getComponent(Label).string = Language.getWord("l_extrasNum", `${startRate * 100}`);
        find("RightTxt", this.upItem).getComponent(Label).string = Language.getWord("l_extrasNum", `${endRate * 100}`);

        this.claim.active = false;
        tween(this.claim)
            .delay(2.0)
            .call(() => {
                this.claim.active = true;
            })
            .set({ alpha: 0 })
            .to(0.2, { alpha: 255 })
            .start();

        tween(this.doubleClaimBtn)
            .to(1, { scales: 1.2 })
            .to(1, { scales: 1.0 })
            .union()
            .repeatForever()
            .start();

        limit = 0;
        let data = [WithdrawSystem.I.getWithdrawInfo()[1]];
        let cmoney = AMoney.value();
        switch (Language.currency) {
            case CurrencyType.US:
                find("Platform", this.withdrawTips).getComponent(SpriteSwitcher).index(0);
                limit = data.find((value) => {
                    return cmoney < value.price;
                })?.price;
                break;
            case CurrencyType.ID:
                find("Platform", this.withdrawTips).getComponent(SpriteSwitcher).index(2);
                limit = data.find((value) => {
                    return cmoney < value.price;
                })?.price;
                break;
            case CurrencyType.BR:
            default:
                find("Platform", this.withdrawTips).getComponent(SpriteSwitcher).index(1);
                limit = data.find((value) => {
                    return cmoney < value.price;
                })?.price;
                break;
        }

        if (limit) {
            find("Progress/Fg", this.withdrawTips).getComponent(Sprite).fillRange = cmoney / limit;
            find("Progress/Txt", this.withdrawTips).getComponent(RichText).string = Language.getWord("l_withdrawPercentTips", Language.getCurrSym(), AMoney.string(limit - cmoney), Language.getCurrSym(), AMoney.string(limit));
        } else {
            this.withdrawTips.active = false;
        }
    };

    async onDoubleClaimBtnClick() {
        if (this.lock) {
            return;
        }
        this.lock = true;
        // 领取双倍奖励
        UserSystem.I.getAdReward(AD_TYPE.VIDEO, REWARD_TYPE.REWARD, this.rewardANum * 2, (isErr: boolean, rewardA: number, rewardB: number) => {
            this.node && PanelFactory.close(PassRewardPanel);
            // 下一关
            LevelSystem.I.passed();
            LevelSystem.I.nextLevel();
            if (isErr) {
                return;
            }
            if (rewardA > 0 || rewardB > 0) {
                // 广告奖励
                UserSystem.I.congratulationsMoney(rewardA, rewardB, 0);
            }
        })
    }

    async onClaimBtnClick() {
        if (this.lock) {
            return;
        }
        this.lock = true;
        if (ADInfoSystem.I.isPassedAd()) {
            // 领取单倍奖励
            UserSystem.I.getAdReward(AD_TYPE.INTER, REWARD_TYPE.REWARD, this.rewardANum, (isErr: boolean, rewardA: number, rewardB: number) => {
                this.node && PanelFactory.close(PassRewardPanel);
                // 下一关
                LevelSystem.I.passed();
                LevelSystem.I.nextLevel();
                if (isErr) {
                    return;
                }
                // 广告奖励
                if (rewardA > 0 || rewardB > 0) {
                    // 广告奖励
                    UserSystem.I.congratulationsMoney(rewardA, rewardB, 0);
                }
            })
        } else {
            // 领取单倍奖励
            this.node && PanelFactory.close(PassRewardPanel);
            // 下一关
            LevelSystem.I.passed();
            LevelSystem.I.nextLevel();
            let rewardA = this.rewardANum;
            if (rewardA > 0) {
                // 成功有奖励 更新货币
                AMoney.add(rewardA);
                // 广告奖励
                UserSystem.I.congratulationsMoney(rewardA, 0, 0);
            }
        }
    }

    async onNoNeedBtnClick() {
        if (this.lock) {
            return;
        }
        this.lock = true;
        if (ADInfoSystem.I.isPassedAd()) {
            // 领取单倍奖励
            UserSystem.I.getAdReward(AD_TYPE.INTER, REWARD_TYPE.REWARD, this.rewardANum, (isErr: boolean, rewardA: number, rewardB: number) => {
                this.node && PanelFactory.close(PassRewardPanel);
                // 下一关
                LevelSystem.I.passed();
                LevelSystem.I.nextLevel();
                if (isErr) {
                    return;
                }
                // 广告奖励
                if (rewardA > 0 || rewardB > 0) {
                    // 广告奖励
                    UserSystem.I.congratulationsMoney(rewardA, rewardB, 0);
                }
            })
        } else {
            this.node && PanelFactory.close(PassRewardPanel);
            // 下一关
            LevelSystem.I.passed();
            LevelSystem.I.nextLevel();
        }
    }
}


