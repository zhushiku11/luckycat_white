import { _decorator, Component, Node } from 'cc';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { UserSystem } from '../../system/UserSystem';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { GuideSystem } from '../../system/GuideSystem';
import { PanelCreator } from '../creator/PanelCreator';
import { NI } from 'db://assets/native_interface/NI';
import { BMoney } from 'db://assets/doge/framework/common/Currency';
const { ccclass, property } = _decorator;

@ccclass('WithdrawBPanel')
export class WithdrawBPanel extends Component implements IPanel {

    onOpenEffect(target: Node, next: () => void) {
        next();
    };

    onCloseEffect(target: Node, next: () => void) {
        next();
    };

    onInit() {
    }

    activate(isNew: boolean) {
        if (isNew) {
            NI.playWithdraw((isWithdraw: number, bal: number, bal1: number) => {
                this.node && PanelFactory.close(WithdrawBPanel);
                BMoney.init(bal, bal1);
            });
        }
    }

    afterOpenEffect() {
        if (GuideSystem.I.getStep() == 5) {
            GuideSystem.I.nextShow();
        }
    }

    afterCloseEffect() {
        if (GuideSystem.I.getStep() == 6) {
            GuideSystem.I.nextShow();
        }
    }
}


