import { _decorator, Component, Label, tween, Node, easing, math, v3, Vec3, Prefab, Sprite, Tween, Button, AudioSource, EPhysics2DDrawFlags, PhysicsSystem2D, Vec2, find, RigidBody, RigidBody2D, v2 } from 'cc';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { LotterySystem } from '../../system/LotterySystem';
import { Language } from 'db://assets/doge/framework/language/Language';
import { PanelCreator } from '../creator/PanelCreator';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { NetworkSystem } from '../../system/NetworkSystem';
import { Toast } from 'db://assets/doge/framework/init';
const { ccclass, property } = _decorator;

const SPEED = 20000;

@ccclass('LotteryPanel')
export class LotteryPanel extends Component implements IPanel {
    @property(Node)
    private wall: Node = null;

    @property(Node)
    private progress: Node = null;
    @property(Node)
    private percent: Node = null;
    @property(Node)
    private tips: Node = null;

    private reward: number = 0;
    private isPlaying: boolean = false;

    onOpenEffect(target: Node, next: () => void) {
        next();
    };

    onCloseEffect(target: Node, next: () => void) {
        next();
    };

    protected start(): void {
        // PhysicsSystem2D.instance.gravity = new Vec2(0, -2200);
        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
        //     EPhysics2DDrawFlags.Pair |
        //     EPhysics2DDrawFlags.CenterOfMass |
        //     EPhysics2DDrawFlags.Joint |
        //     EPhysics2DDrawFlags.Shape;
    }

    onInit() {
        let num = LotterySystem.I.getSpin();
        let limit = LotterySystem.I.getLimit();
        console.log("Limit", num, limit);
        this.progress.getComponent(Sprite).fillRange = num / limit;
        this.percent.getComponent(Label).string = Language.getWord("l_text5", `${num}`, `${limit}`);

        if (num >= limit) {
            this.tips.getComponent(Label).string = Language.getWord("l_lotteryTips1");
        } else {
            this.tips.getComponent(Label).string = Language.getWord("l_lotteryTips0", (limit - num).toString());
        }
    };

    activate(isNew: boolean) {

    };

    deactivate(isRemove: boolean) {
    };

    async onPlayClick() {
        if (!LotterySystem.I.isComplete()) {
            Toast.show(Language.getWord("l_timesNotEnough"));
            this.onCloseClick();
            return;
        }

        if (this.isPlaying) {
            return;
        }
        this.isPlaying = true;

        let result = await NetworkSystem.getLotteryResult();
        if (result.error) {
            return;
        }
        this.reward = result.data.reward;
        LotterySystem.I.setSpin(0);

        this.runAnim();
    }

    runAnim() {
        tween(this.wall)
            .to(0.1, { position: v3(150, 210, 0) })
            .to(0.1, { position: v3(-150, 80, 0) })
            .to(0.1, { position: v3(-150, 210, 0) })
            .to(0.1, { position: v3(150, 80, 0) })
            // .to(0.1, { position: v3(0, 145 + 150, 0) })
            // .to(0.1, { position: v3(0, 145, 0) })
            .union()
            .repeat(5)
            .to(0.1, { position: v3(0, 145, 0) })
            .call(() => {
                this.onAnimEnd();
            })
            .start()
    }

    onAnimEnd() {
        this.isPlaying = false;
        PanelCreator.lotteryReward(this.reward);
    }

    onCloseClick() {
        this.node && PanelFactory.close(LotteryPanel);
    }
}


