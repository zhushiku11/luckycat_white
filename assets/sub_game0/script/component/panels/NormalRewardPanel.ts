import { _decorator, Button, Component, find, Label, Node, RichText, sp, Sprite, tween } from 'cc';
import { CurrencyType, Language } from 'db://assets/doge/framework/language/Language';
import { UserSystem } from '../../system/UserSystem';
import { AMoney, BMoney } from 'db://assets/doge/framework/common/Currency';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { AD_TYPE, REWARD_TYPE } from 'db://assets/native_interface/NI';
import { WithdrawSystem } from '../../system/WithdrawSystem';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { ADInfoSystem } from '../../system/ADInfoSystem';
import { SpriteSwitcher } from 'db://assets/main/script/component/SpriteSwitcher';
import AudioTools from 'db://assets/doge/framework/common/AudioTools';
import { AUDIOS } from '../../../constant/Constant';
const { ccclass, property } = _decorator;

export enum RewardType {
    BigReward = 0,
    GreatReward = 0,
    SuperReward = 0,
}

@ccclass('NormalRewardPanel')
export class NormalRewardPanel extends Component implements IPanel {

    @property(Node)
    private animation: Node = null;
    @property(Node)
    private goldanimation: Node = null;
    @property(Node)
    private WinUititle: Node = null;
    @property(Node)
    private MegaUititle: Node = null;
    @property(Node)
    private SuperUititle: Node = null;
    @property(Node)
    private light: Node = null;
    @property(Node)
    private fireworks: Node = null;
    @property(Node)
    private amount: Node = null;
    @property(Node)
    private upItem: Node = null;
    @property(Node)
    private withdrawTips: Node = null;
    @property(Node)
    private closeBtn: Node = null;
    @property(Node)
    private claimBtn: Node = null;

    private lock: boolean = false;

    private rewardValue: number = 0;

    private _reward: number = 0;
    public get reward(): number {
        return this._reward;
    }
    public set reward(value: number) {
        this._reward = value;
        this.setAmount(this._reward);
    }

    afterOpenEffect(target: Node) {
        AudioTools.playBgm(AUDIOS.reward);
    };

    onKill() {
        AudioTools.playBgm(AUDIOS.bgm);
    };

    onInit(rewardA: number) {
        this.rewardValue = rewardA;
        let spine = this.animation.getComponent(sp.Skeleton);
        spine.setToSetupPose();
        if (rewardA < 10) {
            this.WinUititle.active = true;
            this.MegaUititle.active = false;
            this.SuperUititle.active = false;
            spine.setAnimation(0, "win_vfx_bigwin", false);
            this.light.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
            // this.title.getComponent(Label).string = Language.getWord("l_bigRewards");
        } else if (rewardA < 20) {
            this.WinUititle.active = false;
            this.MegaUititle.active = true;
            this.SuperUititle.active = false;
            spine.setAnimation(0, "win_vfx_megawin", false);
            this.light.getComponent(sp.Skeleton).setAnimation(0, "animation1", false);
            // this.title.getComponent(Label).string = Language.getWord("l_greatRewards");
        } else {
            this.WinUititle.active = false;
            this.MegaUititle.active = false;
            this.SuperUititle.active = true;
            spine.setAnimation(0, "win_vfx_supermegawin", false);
            this.light.getComponent(sp.Skeleton).setAnimation(0, "animation2", false);
            // this.title.getComponent(Label).string = Language.getWord("l_superRewards");
        }

        // goldanimation 动画播放完后自动关闭
        if (this.goldanimation) {
            let goldSpine = this.goldanimation.getComponent(sp.Skeleton);
            goldSpine.setToSetupPose();
            goldSpine.setCompleteListener(() => {
                this.goldanimation.active = false;
                goldSpine.setCompleteListener(null);
            });
            goldSpine.setAnimation(0, "animation", false);
        }

        //
        switch (Language.currency) {
            case CurrencyType.US:
                this.WinUititle.getComponent(SpriteSwitcher).index(0);
                this.MegaUititle.getComponent(SpriteSwitcher).index(0);
                this.SuperUititle.getComponent(SpriteSwitcher).index(0);
                break;
            case CurrencyType.BR:
                this.WinUititle.getComponent(SpriteSwitcher).index(1);
                this.MegaUititle.getComponent(SpriteSwitcher).index(1);
                this.SuperUititle.getComponent(SpriteSwitcher).index(1);
                break;
            case CurrencyType.ID:
                this.WinUititle.getComponent(SpriteSwitcher).index(2);
                this.MegaUititle.getComponent(SpriteSwitcher).index(2);
                this.SuperUititle.getComponent(SpriteSwitcher).index(2);
                break;
        }

        // this.light.active = true;
        // this.light.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
        this.fireworks.active = false;

        tween<NormalRewardPanel>(this)
            .to(0.8, { reward: rewardA })
            .call(() => {
                this.closeBtn.getComponent(Button).interactable = true;
                AudioTools.playBgm(AUDIOS.rewardEnd);
            })
            .start();

        this.closeBtn.getComponent(Button).interactable = false;

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
        find("LeftRate", this.upItem).getComponentInChildren(Label).string = Language.getWord("l_text1", `${startRate * 100}%`);
        find("RightRate", this.upItem).getComponentInChildren(Label).string = Language.getWord("l_text1", `${endRate * 100}%`);

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

        tween(this.claimBtn)
            .to(1, { scales: 1.1 })
            .to(1, { scales: 1.0 })
            .union()
            .repeatForever()
            .start();
    };

    async onDoubleClaimBtnClick() {
        if (this.lock) {
            return;
        }
        this.lock = true;
        // 领取双倍奖励
        UserSystem.I.getAdReward(AD_TYPE.VIDEO, REWARD_TYPE.REWARD, this.rewardValue, (isErr: boolean, rewardA: number, rewardB: number) => {
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
        })
        this.node && PanelFactory.close(NormalRewardPanel);
    }

    async onClaimBtnClick() {
        if (this.lock) {
            return;
        }
        this.lock = true;
        ADInfoSystem.I.skipAdTimesUp();
        if (ADInfoSystem.I.isCompulsoryAd()) {
            // 领取单倍奖励
            UserSystem.I.getAdReward(AD_TYPE.INTER, REWARD_TYPE.REWARD, this.rewardValue, (isErr: boolean, rewardA: number, rewardB: number) => {
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
            })
            this.node && PanelFactory.close(NormalRewardPanel);
        } else {
            let rewardA = this.rewardValue;
            if (rewardA > 0) {
                // 成功有奖励 更新货币
                AMoney.add(rewardA);
                // 广告奖励
                UserSystem.I.congratulationsMoney(rewardA, 0);
            }
            // if (rewardA > 0) {
            //     // 成功有奖励 更新货币
            //     AMoney.give(rewardA);
            // }
            // 领取单倍奖励
            this.node && PanelFactory.close(NormalRewardPanel);
        }
    }

    setAmount(num: number) {
        this.amount.getComponent(Label).string = Language.getWord("l_text1", AMoney.string(num));
    }

    onCloseBtnClick() {
        this.closeBtn.getComponent(Button).interactable = false;
        PanelFactory.close(NormalRewardPanel);
    }
}


