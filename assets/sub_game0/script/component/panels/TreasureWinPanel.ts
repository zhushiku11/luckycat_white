import { _decorator, Button, Component, find, Label, Node, RichText, sp, Sprite, tween } from 'cc';
import { CurrencyType, Language } from 'db://assets/doge/framework/language/Language';
import { UserSystem } from '../../system/UserSystem';
import { ACoins, AMoney, BMoney } from 'db://assets/doge/framework/common/Currency';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { AD_TYPE, REWARD_TYPE } from 'db://assets/native_interface/NI';
import { WithdrawSystem } from '../../system/WithdrawSystem';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { ADInfoSystem } from '../../system/ADInfoSystem';
import { SpriteSwitcher } from 'db://assets/main/script/component/SpriteSwitcher';
import { SpinSystem } from '../../system/SpinSystem';
import AudioTools from 'db://assets/doge/framework/common/AudioTools';
import { AUDIOS } from '../../../constant/Constant';
import { DrawcardRewardPanel } from './DrawcardRewardPanel';
const { ccclass, property } = _decorator;

@ccclass('TreasureWinPanel')
export class TreasureWinPanel extends Component implements IPanel {

    @property(Node)
    private animation: Node = null;
    @property(Node)
    private light: Node = null;
    @property(Node)
    private tips: Node = null;
    @property(Node)
    private upItem: Node = null;
    @property(Node)
    private withdrawTips: Node = null;
    @property(Node)
    private claimBtn: Node = null;

    private lock: boolean = false;
    private claimedCallback: Function = null;

    private reward: number = 0;

    private _amount: number = 0;
    public get amount(): number {
        return this._amount;
    }
    public set amount(value: number) {
        this._amount = value;
        this.setAmount(this._amount);
    }

    afterOpenEffect(target: Node) {
        AudioTools.playBgm(AUDIOS.treasureWinShow);
    };

    onKill() {
        AudioTools.sound(AUDIOS.treasureWinClose);
        AudioTools.playBgm(AUDIOS.bgm);
    };

    onInit(win: number, claimedCallback?: Function) {
        this.reward = win;
        this.claimedCallback = claimedCallback;

        this.tips.scales = 0;
        this.animation.alpha = 0;
        let bgSp = this.light.getComponent(sp.Skeleton);
        bgSp.setAnimation(0, "end_in", false);
        let spS = this.animation.getComponent(sp.Skeleton);
        spS.setAnimation(0, "end_idle", true);

        this.setAmount(0);

        tween(this.animation).to(0.5, { alpha: 255 }).call(() => {
            tween(this.tips).to(0.2, { scales: 1 }).start();
            tween<TreasureWinPanel>(this)
                .to(0.8, { amount: win })
                .call(() => {
                    AudioTools.playBgm(AUDIOS.treasureWinShowEnd);
                    bgSp.setAnimation(0, "end_end", false);
                    tween(find("Amount/Num", this.tips)).to(0.1, { scales: 1.2 }).to(0.1, { scales: 1 }).call(() => {
                        // this.claimBtn.setScale(1, 1, 1);
                        // let spS = this.claimBtn.getComponent(sp.Skeleton);
                        // spS.setToSetupPose();
                        // spS.setAnimation(0, "button_in", false);
                        // spS.setCompleteListener(() => {
                        //     spS.setAnimation(0, "button_idle", true);
                        //     spS.setCompleteListener(null);
                        // })
                    }).start();
                })
                .start()
        }).start();

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

    setAmount(num: number) {
        find("Amount/Num", this.tips).getComponent(Label).string = Language.getWord("l_text1", AMoney.string(num));
    }

    onClaimClick() {
        PanelFactory.close(TreasureWinPanel);
        this.claimedCallback && this.claimedCallback();
    }

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
        this.node && PanelFactory.close(TreasureWinPanel);
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
        this.node && PanelFactory.close(TreasureWinPanel);
    }

    onCloseBtnClick() {

    }
}


