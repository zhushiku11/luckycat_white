import { _decorator, Button, Component, find, Label, Node, RichText, sp, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
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
import { AUDIOS, RES_NAME } from '../../../constant/Constant';
import { DrawcardPanel } from './DrawcardPanel';
const { ccclass, property } = _decorator;

export enum RewardType {
    BigReward = 0,
    GreatReward = 0,
    SuperReward = 0,
}

@ccclass('DrawcardRewardPanel')
export class DrawcardRewardPanel extends Component implements IPanel {

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
    private light: Node = null;
    @property(Node)
    private claimBtn: Node = null;
    private lock: boolean = false;

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

    onInit(type: number, rewardA: number) {
        this.reward = rewardA;

        this.fireworks.active = false;

        this.reward = rewardA;
        tween<DrawcardRewardPanel>(this)
            .to(0.8, { reward: rewardA })
            .call(() => {
                this.closeBtn.getComponent(Button).interactable = true;
                AudioTools.playBgm(AUDIOS.rewardEnd);
            })
            .start();

        this.amount.getComponent(SpriteSwitcher).index(type);
        Language.getImage(`drawcard_title${type}`, RES_NAME).then((spf: SpriteFrame) => {
            this.amount.getComponentInChildren(Sprite).spriteFrame = spf;
        })

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
        UserSystem.I.getAdReward(AD_TYPE.VIDEO, REWARD_TYPE.REWARD, this.reward, (isErr: boolean, rewardA: number, rewardB: number) => {
            if (isErr) {
                return;
            }
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
        this.onCloseBtnClick();
    }

    async onClaimBtnClick() {
        if (this.lock) {
            return;
        }
        this.lock = true;
        ADInfoSystem.I.skipAdTimesUp();
        if (ADInfoSystem.I.isCompulsoryAd()) {
            // 领取单倍奖励
            UserSystem.I.getAdReward(AD_TYPE.VIDEO, REWARD_TYPE.REWARD, this.reward, (isErr: boolean, rewardA: number, rewardB: number) => {
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
            this.onCloseBtnClick();
        } else {
            let rewardA = this.reward;
            // if (rewardA > 0) {
            //     // 成功有奖励 更新货币
            //     AMoney.set(AMoney.value() + rewardA);
            //     // 广告奖励
            //     UserSystem.I.congratulationsMoney(rewardA, 0);
            // }
            if (rewardA > 0) {
                // 成功有奖励 更新货币
                AMoney.give(rewardA);
            }
            // 领取单倍奖励
            this.onCloseBtnClick();
        }
    }

    async onNoNeedClick() {
        if (this.lock) {
            return;
        }
        this.lock = true;
        // 领取单倍奖励
        UserSystem.I.getAdReward(AD_TYPE.INTER, REWARD_TYPE.NONE, 0, (isErr: boolean, rewardA: number, rewardB: number) => {
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
        this.onCloseBtnClick();
    }

    setAmount(num: number) {
        this.amount.getComponentInChildren(Label).string = Language.getWord("l_text2", Language.getCurrSym(), AMoney.string(num));
    }

    onCloseBtnClick() {
        this.closeBtn.getComponent(Button).interactable = false;
        PanelFactory.close(DrawcardRewardPanel);
        PanelFactory.close(DrawcardPanel)
    }
}


