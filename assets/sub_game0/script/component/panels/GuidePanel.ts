import { _decorator, Button, Component, director, EventTouch, find, Node, tween, v3 } from 'cc';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { GuideSystem } from '../../system/GuideSystem';
import { Utils } from 'db://assets/doge/framework/common/Utils';
import { SUBGAME } from '../../../constant/Constant';
import { CheckinSystem } from '../../system/CheckinSystem';
import { PanelCreator } from '../creator/PanelCreator';
import { GameLauncher } from '../../game/GameLauncher';
import { UserSystem } from '../../system/UserSystem';
const { ccclass, property } = _decorator;

@ccclass('GuidePanel')
export class GuidePanel extends Component implements IPanel {
    @property([Node])
    private steps: Node[] = [];
    @property(Node)
    private mask: Node = null;
    @property(Node)
    private amoney: Node = null;
    @property(Node)
    private bmoney: Node = null;

    private tmpParent: Node = null;

    protected onEnable(): void {
        getEventEmiter().on("GuideShow", this.show, this);
        getEventEmiter().on("GuideHide", this.hide, this);

    }

    protected onDisable(): void {
        getEventEmiter().off("GuideShow", this.show, this);
        getEventEmiter().off("GuideHide", this.hide, this);
    }

    onOpenEffect(target: Node, next: () => void) {
        next();
    };

    onCloseEffect(target: Node, next: () => void) {
        next();
    };

    onInit() {
    }

    show() {
        this.hide();
        let step = GuideSystem.I.getStep();
        let slot = null;
        let finger = null;
        let stepItem = null;
        switch (step) {
            case 0:
                this.mask.active = true;
                stepItem = this.steps[step];
                stepItem.active = true;
                this.getComponent(Button).enabled = true;
                break;
            case 1:
                this.mask.active = false;
                stepItem = this.steps[step];
                stepItem.active = true;
                this.getComponent(Button).enabled = true;
                // UserSystem.I.getNewUserReward((rewardA: number, rewardB: number) => {
                //     console.log("getNewUserReward", rewardA, rewardB);
                //     if (rewardA > 0 || rewardB > 0) {
                //         PanelFactory.open(NewUserRewaradPanel, rewardA, rewardB);
                //     } else {
                //         PlayerSystem.I.notNewUser();
                //     }
                // })
                break;
            case 2:
                this.mask.active = false;
                stepItem = this.steps[step];
                stepItem.active = true;
                this.getComponent(Button).enabled = false;
                break;
            case 3:
                this.mask.active = true;
                stepItem = this.steps[step];
                stepItem.active = true;
                slot = find("Slot", stepItem);
                finger = find("Finger", stepItem);
                tween(finger)
                    .delay(0.15)
                    .set({ angle: 30 })
                    .delay(0.15)
                    .set({ angle: 0 })
                    .delay(0.15)
                    .set({ angle: 30 })
                    .delay(0.15)
                    .set({ angle: 0 })
                    .delay(0.8)
                    .union()
                    .repeatForever()
                    .start();
                this.tmpParent = this.amoney.parent;
                Utils.changeParent(this.amoney, slot);
                this.getComponent(Button).enabled = true;
                break;
            case 4:
                Utils.changeParent(this.amoney, this.tmpParent);

                this.mask.active = false;
                stepItem = this.steps[step];
                stepItem.active = true;
                this.getComponent(Button).enabled = false;
                break;
            case 5:
                this.mask.active = true;
                stepItem = this.steps[step];
                stepItem.active = true;
                slot = find("Slot", stepItem);
                finger = find("Finger", stepItem);
                tween(finger)
                    .delay(0.15)
                    .set({ angle: 30 })
                    .delay(0.15)
                    .set({ angle: 0 })
                    .delay(0.15)
                    .set({ angle: 30 })
                    .delay(0.15)
                    .set({ angle: 0 })
                    .delay(0.8)
                    .union()
                    .repeatForever()
                    .start();
                this.tmpParent = this.bmoney.parent;
                Utils.changeParent(this.bmoney, slot);
                this.getComponent(Button).enabled = true;
                break;
            case 6:
                Utils.changeParent(this.bmoney, this.tmpParent);

                this.mask.active = false;
                stepItem = this.steps[step];
                stepItem.active = true;
                this.getComponent(Button).enabled = false;
                break;
            case 7:
                this.getComponent(Button).enabled = false;
                director.getScheduler().schedule(() => {
                    PanelCreator.checkin();
                    CheckinSystem.I.setPopupTime(new Date());
                }, director.getScheduler(), 0, 0, 0.5, false);
                break;
        }
    }

    hide() {
        this.mask.active = false;
        this.getComponent(Button).enabled = false;
        for (let i = 0; i < this.steps.length; i++) {
            const step = this.steps[i];
            step.active = false;
        }
    }


    onNextBtnClick(event: EventTouch) {
        let step = GuideSystem.I.getStep();
        switch (step) {
            case 3:
                // GuideSystem.I.nextStep();
                // this.show();
                // GuideSystem.I.nextStep();
                // this.show();
                break;
            case 5:
                // GuideSystem.I.nextStep();
                // this.show();
                // GuideSystem.I.nextStep();
                // this.show();
                break;
        }
    }

}