import { _decorator, Component, director, find, Node } from 'cc';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { SCENES_NAME, SUBGAME } from '../../constant/Constant';
import { LoadingPanel } from '../component/panels/LoadingPanel';
import { LevelSystem } from '../system/LevelSystem';
;
const { ccclass, property } = _decorator;

@ccclass('Main0Scene')
export class Main0Scene extends Component {

    public static showLoading() {
        find("Canvas/Loading").getComponent(LoadingPanel).showLoading();
    }

    public static hideLoading() {
        find("Canvas/Loading").getComponent(LoadingPanel).hideLoading();
    }

    protected onEnable(): void {
        getEventEmiter().on(SUBGAME.SCENE.GAME, this.toGameScene, this);
    }

    protected onDisable(): void {
        getEventEmiter().off(SUBGAME.SCENE.GAME, this.toGameScene, this);
    }

    protected onLoad(): void {

    }

    onPassBtnClick() {
        LevelSystem.I.runLevel(LevelSystem.I.getCurrLevel());
    }

    toGameScene() {
        Main0Scene.showLoading()
        // 场景预加载
        director.preloadScene(SCENES_NAME.Game, () => {
            director.loadScene(SCENES_NAME.Game, () => {
                Main0Scene.hideLoading();
            });
        });
    }
}


