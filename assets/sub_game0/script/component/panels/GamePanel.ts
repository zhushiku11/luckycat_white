import { _decorator, Component, Node } from 'cc';
import { IPanel } from 'db://assets/doge/framework/panel/Panel';
import { GameLogic } from '../../game/GameLogic';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { SUBGAME } from '../../../constant/Constant';
const { ccclass, property } = _decorator;

@ccclass('GamePanel')
export class GamePanel extends Component implements IPanel {

    @property(GameLogic)
    private gameLogic: GameLogic = null;

    onOpenEffect(target: Node, next: () => void) {
        next();
    };

    onCloseEffect(target: Node, next: () => void) {
        next();
    };

    onInit() {
        this.gameLogic.init();
    }

    activate(isNew: boolean) {
        if (!isNew) {
            getEventEmiter().emit(SUBGAME.FUNC.GAME_RESUME);
        }
    };

    deactivate(isRemove: boolean) {
        if (!isRemove) {
            getEventEmiter().emit(SUBGAME.FUNC.GAME_PAUSE);
        }
    };
}