import { _decorator, Component, Label, Node, Tween, tween, TweenSystem, v3 } from 'cc';
import { UserSystem } from '../../system/UserSystem';
import { Language } from 'db://assets/doge/framework/language/Language';
import { AMoney } from 'db://assets/doge/framework/common/Currency';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { AD_TYPE, REWARD_TYPE } from 'db://assets/native_interface/NI';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
const { ccclass, property } = _decorator;

const PRICE = [500, 800, 600, 600];

@ccclass('GiftBoxPanel')
export class GiftBoxPanel extends Component implements IPanel {

    @property(Node)
    private box: Node = null;
    @property(Node)
    private wingsLeft: Node = null;
    @property(Node)
    private wingsRight: Node = null;
    @property(Node)
    private num: Node = null;

    private delay: number = null;
    private interval: number = null;
    private reward: number = 0;

    onInit() {
        // this.delay = 1;
        // this.interval = 2;
        this.delay = 30;
        this.interval = 30;
        this.loop(this.delay);
    }

    onOpenEffect(target: Node, next: () => void) {
        next();
    }

    onCloseEffect(target: Node, next: () => void) {
        next();
    }

    private loop(delay: number) {
        this.reward = UserSystem.I.getCashReward1();
        this.num.getComponent(Label).string = Language.getWordByCurrency("l_money", Language.getCurrSym(), AMoney.string(this.reward));
        let callback = () => {
            this.go(callback);
        };
        if (delay) {
            this.scheduleOnce(() => {
                this.go(callback);
            }, delay);
        } else {
            this.go(callback);
        }
    }

    private go(endCb?: Function) {
        this.reset();
        this.move(endCb);
        this.fly();
    }

    public reset() {
        this.box.position = v3(-428, 0, 0);
        Tween.stopAllByTarget(this.box);
        Tween.stopAllByTarget(this.wingsLeft);
        Tween.stopAllByTarget(this.wingsRight);
    }

    private move(endCb?: Function) {
        let time = 1.5;
        let x = 165;
        let y = 30;
        tween(this.box)
            .repeat(
                3,
                tween()
                    .by(time, { position: v3(x, y, 0) })
                    .by(time, { position: v3(x, -y, 0) })
            )
            .delay(this.interval)
            .call(() => {
                endCb && endCb();
            })
            .start()
    }

    private fly() {
        this.wingsLeft.angle = -20;
        this.wingsRight.angle = 20;
        tween(this.wingsLeft)
            .repeatForever(tween().to(1, { angle: 20 }).to(1, { angle: -20 }))
            .start()
        tween(this.wingsRight)
            .repeatForever(tween().to(1, { angle: -20 }).to(1, { angle: 20 }))
            .start()
    }

    public pause() {
        TweenSystem.instance.ActionManager.pauseTargets([this.box, this.wingsLeft, this.wingsRight]);
    }

    public resume() {
        TweenSystem.instance.ActionManager.resumeTargets([this.box, this.wingsLeft, this.wingsRight]);
    }

    close() {
        this.node && PanelFactory.close(GiftBoxPanel);
    }

    async onBoxClick() {
        this.pause();

        // 领取单倍奖励
        UserSystem.I.getAdReward(AD_TYPE.VIDEO, REWARD_TYPE.REWARD, this.reward, (isErr: boolean, rewardA: number, rewardB: number) => {
            if (isErr) {
                return;
            }
            if (rewardA > 0 || rewardB > 0) {
                // 广告奖励
                UserSystem.I.congratulationsMoney(rewardA, rewardB);
            }
            this.reset();
            this.loop(this.interval);
        })
    }
}


