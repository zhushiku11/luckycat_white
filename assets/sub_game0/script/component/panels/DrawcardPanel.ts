import { _decorator, Button, Component, easing, EventTouch, find, Node, tween, v3 } from 'cc';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { NetworkSystem } from '../../system/NetworkSystem';
import { SpriteSwitcher } from 'db://assets/main/script/component/SpriteSwitcher';
import { PanelCreator } from '../creator/PanelCreator';
import AudioTools from 'db://assets/doge/framework/common/AudioTools';
import { AUDIOS } from '../../../constant/Constant';
const { ccclass, property } = _decorator;

@ccclass('DrawcardPanel')
export class DrawcardPanel extends Component implements IPanel {

    @property([Node])
    private dots: Node[] = [];
    @property([Node])
    private items: Node[] = [];

    private types: number[] = null;
    private rewards: number[] = null;
    private typesNum: number[] = null;

    async onInit() {
        // for (const dot of this.dots) {
        //     const dot0 = find("0", dot);
        //     const dot1 = find("0", dot);
        //     const dot2 = find("0", dot);
        // }
        let result = await NetworkSystem.getDrawcardResult();
        if (result.error) {
            return;
        }
        this.types = result.data.result;
        this.rewards = result.data.reward;
        this.typesNum = [0, 0, 0];
    }

    onRefresh() {
        for (let i = 0; i < this.dots.length; i++) {
            const dot = this.dots[i];
            const num = this.typesNum[i];
            for (let j = 0; j < 3; j++) {
                const node = find(`${j}`, dot);
                if (j < num) {
                    node.getComponent(SpriteSwitcher).index(1);
                } else {
                    node.getComponent(SpriteSwitcher).index(0);
                }
            }
        }
    }

    afterCloseEffect() {

    }

    close() {
        this.node && PanelFactory.close(DrawcardPanel);
    }

    onCloseClick() {
        this.close();
    }

    onItemClick(event: EventTouch, custom: string) {
        AudioTools.sound(AUDIOS.drawcardItem);

        let index = parseInt(custom);
        let type = this.types[index];
        let item = this.items[index];

        item.getComponent(Button).interactable = false;

        let isShowResult = false;
        this.typesNum[type] += 1;
        if (this.typesNum[type] == 3) {
            // 可以弹出结算
            isShowResult = true;
            for (const element of this.items) {
                element.getComponent(Button).interactable = false;
            }
        }

        item.scales = 1;
        tween(item)
            .to(0.2, { scale: v3(0, 1, 1) }, { easing: easing.quadOut })
            .call(() => {
                item.getComponent(SpriteSwitcher).index(type);
            })
            .to(0.2, { scale: v3(1, 1, 1) }, { easing: easing.quadOut })
            .call(() => {
                if (isShowResult) {
                    this.onRefresh();
                    // 直接弹出结算
                    // this.node && PanelFactory.close(DrawcardPanel);
                    PanelCreator.drawcardReward(type, this.rewards[type]);
                }
            })
            .start()
    }
}


