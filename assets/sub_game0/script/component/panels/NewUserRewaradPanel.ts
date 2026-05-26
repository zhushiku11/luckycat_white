import { _decorator, Button, Component, director, easing, find, instantiate, Label, Node, Prefab, RichText, sp, Sprite, tween, v3 } from 'cc';
import { AMoney } from 'db://assets/doge/framework/common/Currency';
import { IPanel } from 'db://assets/doge/framework/panel/Panel';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { Language } from 'db://assets/doge/framework/language/Language';
import AudioTools from 'db://assets/doge/framework/common/AudioTools';
import { AUDIOS } from '../../../constant/Constant';
import { GuideSystem } from '../../system/GuideSystem';
const { ccclass, property } = _decorator;

@ccclass('NewUserRewaradPanel')
export class NewUserRewaradPanel extends Component implements IPanel {

    @property(Node)
    private animation: Node = null;
    @property(Node)
    private title: Node = null;
    @property(Node)
    private light: Node = null;
    @property(Node)
    private fireworks: Node = null;
    @property(Node)
    private amount: Node = null;

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
        if (GuideSystem.I.getStep() == 1) {
            GuideSystem.I.nextShow();
        }
    };

    afterCloseEffect(target: Node) {
        if (GuideSystem.I.getStep() == 2) {
            GuideSystem.I.nextShow();
        }
    };

    onKill() {
        AudioTools.playBgm(AUDIOS.bgm);
    };

    onInit(rewardA: number) {
        this.rewardValue = rewardA;
        let spine = this.animation.getComponent(sp.Skeleton);
        spine.setToSetupPose();
        if (rewardA < 10) {
            spine.setAnimation(0, "win_big_in2", false);
            this.title.getComponent(Label).string = Language.getWord("l_bigRewards");
        } else if (rewardA < 20) {
            spine.setAnimation(0, "win_huge_in2", false);
            this.title.getComponent(Label).string = Language.getWord("l_greatRewards");
        } else {
            spine.setAnimation(0, "win_super_in2", false);
            this.title.getComponent(Label).string = Language.getWord("l_superRewards");
        }

        this.light.active = true;
        this.light.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
        this.fireworks.active = true;

        tween<NewUserRewaradPanel>(this)
            .to(0.8, { reward: rewardA })
            .call(() => {
                AudioTools.playBgm(AUDIOS.rewardEnd);
            })
            .start();
    };

    async onClaimBtnClick() {
        if (this.lock) {
            return;
        }
        this.lock = true;
        let rewardA = this.rewardValue;
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
        this.node && PanelFactory.close(NewUserRewaradPanel);
    }

    setAmount(num: number) {
        this.amount.getComponent(Label).string = Language.getWord("l_text1", AMoney.string(num));
    }
}


