import { _decorator, Component, Node } from 'cc';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { LevelSystem } from '../../system/LevelSystem';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { SUBGAME } from '../../../constant/Constant';
const { ccclass, property } = _decorator;

@ccclass('FailedPanel')
export class FailedPanel extends Component implements IPanel {

    @property(Node)
    private playerName: Node = null;
    @property(Node)
    private currScore: Node = null;

    onInit() {

    }

    onRestartBtnClick() {
        // LevelSystem.I.replay();
        getEventEmiter().emit(SUBGAME.FUNC.RESTART_GAME);
        this.node && PanelFactory.close(FailedPanel);
    }
}