import { _decorator, Component, find, Label, Node } from 'cc';
import { WithdrawSystem } from '../../system/WithdrawSystem';
import { IPanel } from 'db://assets/doge/framework/panel/Panel';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import FloatCalc from 'db://assets/doge/framework/common/FloatCalc';
import { PanelCreator } from '../creator/PanelCreator';
const { ccclass, property } = _decorator;

@ccclass('WithdrawRatePanel')
export class WithdrawRatePanel extends Component implements IPanel {

    @property(Node)
    private before: Node = null;
    @property(Node)
    private now: Node = null;

    onInit(count: number) {
        let data = WithdrawSystem.I.getRateInfo();
        let index = data.findIndex((value: any) => {
            return count >= value.SbmBen && count <= value.SbmEnd;
        })
        let lastIndex = index - 1;
        console.log("count", count);
        console.log("lastindex", lastIndex);
        console.log("index", index);

        let frist = data[0];
        let beforeRate = find("BeforeRate", this.before);
        if (lastIndex >= 0) {
            this.before.active = true;
            beforeRate.active = true;

            let item = data[lastIndex];
            find("Rate/Txt", beforeRate).getComponent(Label).string = `${FloatCalc.div(item.SbmWro, frist.SbmWro)}X`;
        } else {
            this.before.active = false;
            beforeRate.active = false;
        }

        let nowRate = find("NowRate", this.now);
        if (index >= 0) {
            this.now.active = true;
            nowRate.active = true;
            let item = data[index];
            find("Rate/Txt", nowRate).getComponent(Label).string = `${FloatCalc.div(item.SbmWro, frist.SbmWro)}X`;
        } else {
            this.now.active = false;
            nowRate.active = false;
        }
    };

    onCheckBtnClick() {
        this.node && PanelFactory.close(WithdrawRatePanel);
    }

    onWithdrawBtnClick() {
        this.node && PanelFactory.close(WithdrawRatePanel);
        PanelCreator.WithdrawB();
    }
}


