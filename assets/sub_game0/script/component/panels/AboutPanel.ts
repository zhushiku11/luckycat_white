import { _decorator, Component } from 'cc';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
const { ccclass, property } = _decorator;

const PRICE = [500, 800, 600, 600];

@ccclass('AboutPanel')
export class AboutPanel extends Component implements IPanel {

    onInit() {

    }
    afterCloseEffect() {

    }

    close() {
        this.node && PanelFactory.close(AboutPanel);
    }

    onCloseClick() {
        this.close();
    }
}