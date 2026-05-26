import { _decorator, Component, Label, Node } from 'cc';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import AudioTools from 'db://assets/doge/framework/common/AudioTools';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { SpriteSwitcher } from 'db://assets/main/script/component/SpriteSwitcher';
import { AUDIOS, SUBGAME } from '../../../constant/Constant';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
const { ccclass, property } = _decorator;

const PRICE = [500, 800, 600, 600];

@ccclass('SettingPanel')
export class SettingPanel extends Component implements IPanel {

    @property(Node)
    private musicBtn: Node = null;
    @property(Node)
    private soundBtn: Node = null;

    onInit() {
        this.musicBtn.getComponent(SpriteSwitcher).index(AudioTools.isOpen() ? 1 : 0);
        this.soundBtn.getComponent(SpriteSwitcher).index(AudioTools.isSoundOpen() ? 1 : 0);
    }

    afterCloseEffect() {
    }

    close() {
        this.node && PanelFactory.close(SettingPanel);
    }

    onCloseClick() {
        this.close();
    }

    onMusicBtnClick() {
        if (AudioTools.isOpen()) {
            // 关闭
            AudioTools.closeMusic();
        } else {
            // 开启
            AudioTools.openMusic(AUDIOS.bgm);
        }
        this.musicBtn.getComponent(SpriteSwitcher).index(AudioTools.isOpen() ? 1 : 0);
    }

    onSoundBtnClick() {
        if (AudioTools.isSoundOpen()) {
            // 关闭
            AudioTools.closeSound();
        } else {
            // 开启
            AudioTools.openSound();
        }
        this.soundBtn.getComponent(SpriteSwitcher).index(AudioTools.isSoundOpen() ? 1 : 0);
    }
}


