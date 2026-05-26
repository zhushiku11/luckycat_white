import { Component, Sprite, _decorator, Node, v3, UIOpacity, tween, easing } from "cc";
import AudioTools from "db://assets/doge/framework/common/AudioTools";
import { AUDIOS } from "../../constant/Constant";
import { SpriteSwitcher } from "db://assets/main/script/component/SpriteSwitcher";

const { ccclass, property } = _decorator;

@ccclass("BingoAnim")
export class BingoAnim extends Component {

    @property(SpriteSwitcher)
    private bingoTitle: SpriteSwitcher = null;
    @property(SpriteSwitcher)
    private bingoNum: SpriteSwitcher = null;
    @property(Sprite)
    private bingoCombo: Sprite = null;

    start() {

    }

    update(deltaTime: number) {

    }

    show(parent: Node, count: number) {
        let txtIndex = count;
        let numIndex = count;
        if (txtIndex > 5) {
            txtIndex--;
        }
        if (txtIndex > 6) {
            txtIndex--;
        }

        if (txtIndex > 6) {
            txtIndex = 6;
        }
        // this.bingoTxt.spriteFrame = AssetsDB.get<SpriteFrame>(PRELOAD.SPFRAME_FRAMES[`combo${txtIndex - 2}`]);
        this.bingoTitle.index(txtIndex);

        if (numIndex > 8) {
            numIndex = 8;
        }

        if (numIndex <= 2) {
            this.bingoNum.node.active = false;
            this.bingoCombo.node.active = false;
        } else {
            // this.bingoNum.spriteFrame = AssetsDB.get<SpriteFrame>(PRELOAD_SPF[`comboNum${numIndex}`]);
            this.bingoNum.index(numIndex);
            this.bingoCombo.node.active = true;
        }

        switch (txtIndex - 2) {
            case 0:
                AudioTools.sound(AUDIOS.bingo);
                break;
            case 1:
                AudioTools.sound(AUDIOS.bingo_cool);
                break;
            case 2:
                AudioTools.sound(AUDIOS.bingo_nice);
                break;
            case 3:
                AudioTools.sound(AUDIOS.bingo_bang);
                break;
            case 4:
                AudioTools.sound(AUDIOS.bingo_super);
                break;
        }
        this.node.parent = parent;

        return this;
    }

    runAnim() {
        this.bingoTitle.node.scale = v3(0, 0, 1);
        this.bingoNum.node.scale = v3(0, 0, 1);
        this.bingoCombo.node.scale = v3(1.5, 1.5, 1);
        this.bingoNum.getComponent(UIOpacity).opacity = 0;

        let frameTime = 1 / 60;
        let waitTime = 0;

        tween(this.bingoTitle.node)
            .delay(3 * frameTime)
            .to(30 * frameTime, { scale: v3(1, 1, 1) }, { easing: easing.backOut })
            .delay(3 * frameTime)
            .delay(waitTime)
            .delay(4 * frameTime)
            .to(27 * frameTime, { scale: v3(1, 1, 1) })
            .start()
        tween(this.bingoTitle.node)
            .delay(36 * frameTime)
            .delay(waitTime)
            .delay(4 * frameTime)
            .call(() => {
                tween(this.bingoTitle.getComponent(UIOpacity)).to(27 * frameTime, { opacity: 0 }).start();
            })

            .start()


        tween(this.bingoCombo.node)
            .to(30 * frameTime, { scale: v3(1, 1, 1) }, { easing: easing.backOut })
        tween(this.bingoCombo.node)
            .delay(36 * frameTime)
            .delay(waitTime)
            .delay(17 * frameTime)
            .call(() => {
                tween(this.bingoCombo.getComponent(UIOpacity)).to(16 * frameTime, { opacity: 0 }).call(() => {
                    this.node.destroy();
                }).start();
            })

            .start()
        tween(this.bingoNum.node)
            .delay(14 * frameTime)
            .to(2 * frameTime, { scale: v3(2, 2, 1) })
            .to(20 * frameTime, { scale: v3(1, 0.7, 1) })
            .delay(waitTime)
            .to(17 * frameTime, { scale: v3(1, 1, 1) })
            .start()
        tween(this.bingoNum.getComponent(UIOpacity))
            .delay(12 * frameTime)
            .to(2 * frameTime, { opacity: 100 })
            .to(2 * frameTime, { opacity: 255 })
            .delay(20 * frameTime)
            .delay(waitTime)
            .to(29 * frameTime, { opacity: 0 })
            .start()
    }
}


