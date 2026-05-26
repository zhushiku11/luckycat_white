import { _decorator, Component, easing, find, instantiate, Label, Node, Prefab, sp, Sprite, tween, v3, Vec3 } from 'cc';
import { AMoney } from 'db://assets/doge/framework/common/Currency';
import { Language } from 'db://assets/doge/framework/language/Language';
import { SpinSystem } from '../system/SpinSystem';
import { WithdrawSystem } from '../system/WithdrawSystem';
import AudioTools from 'db://assets/doge/framework/common/AudioTools';
import { AUDIOS } from '../../constant/Constant';
const { ccclass, property } = _decorator;

@ccclass('GameTitle')
export class GameTitle extends Component {

    @property(Prefab)
    private jackpotPrefab: Prefab = null;

    @property(Node)
    private titleAnim: Node = null;
    @property(Node)
    private amount: Node = null;
    @property([Node])
    private jackpotSlot: Node[] = [];
    @property(Node)
    private jackpotFrame: Node = null;

    init() {
        let spine = this.titleAnim.getComponentInChildren(sp.Skeleton);
        spine.timeScale = 1000;
        spine.setCompleteListener(() => {
            spine.setCompleteListener(null);
            spine.timeScale = 1;
        });
        this.setAmount(0);
        for (let i = 0; i < this.jackpotSlot.length; i++) {
            const jackpot = this.jackpotSlot[i];
            if (i < SpinSystem.I.getJackpotTimes()) {
                let jackpotNode = instantiate(this.jackpotPrefab);
                jackpotNode.parent = jackpot;
                jackpotNode.position = v3(0, 0, 0);
                jackpotNode.scales = 0.4;
            }
        }
    }

    setAmount(num: number) {
        let amountTxt = find("Win", this.amount);
        let amountIcon = find("Icon", this.amount);
        let amountNum = find("Num", this.amount).getComponent(Label);
        if (num == 0) {
            amountTxt.active = false;
            amountIcon.active = false;
            amountNum.string = "";
        } else {
            amountTxt.active = true;
            amountIcon.active = true;
            // amountNum.string = Language.getWord("l_text2", Language.getCurrSym(), AMoney.string(num));
            amountNum.string = Language.getWord("l_text1", AMoney.string(num));
        }
    }

    winAnimtion() {
        let titleAnim = this.titleAnim.getComponentInChildren(sp.Skeleton);
        titleAnim.setAnimation(0, "yfk2_in", false);
        tween(this.amount)
            .to(0.1, { scales: 1.5 }, { easing: easing.quartIn })
            .to(0.15, { scales: 1 }, { easing: easing.quartOut })
            .start();
    }

    addJackpot(worldPos: Vec3) {
        this.scheduleOnce(() => {
            // jackpot动画
            console.log("Play jackpot anim");
            SpinSystem.I.addJackpotTimes();
            let jackpotNode = instantiate(this.jackpotPrefab);
            jackpotNode.parent = this.jackpotSlot[SpinSystem.I.getJackpotTimes() - 1];
            jackpotNode.worldPosition = v3(worldPos);
            tween(jackpotNode)
                .to(0.3, { position: v3(0, 0, 0), scales: 0.4 }, { easing: easing.quadIn })
                .call(() => {
                    AudioTools.sound(AUDIOS.onlyJackpot);
                    this.jackpotAll();
                })
                .start();
        }, 0.6)
    }

    jackpotAll() {
        if (SpinSystem.I.isDrawCard()) {
            this.jackpotFrame.active = true;
            this.jackpotFrame.alpha = 0;
            tween(this.jackpotFrame)
                .to(0.2, { alpha: 255 })
                .to(0.2, { alpha: 0 })
                .to(0.2, { alpha: 255 })
                .to(0.2, { alpha: 0 })
                .to(0.2, { alpha: 255 })
                .to(0.2, { alpha: 0 })
                .to(0.2, { alpha: 255 })
                .to(0.2, { alpha: 0 })
                .to(0.2, { alpha: 255 })
                .start();
        }
    }

    clearAllJackpot() {
        for (const slot of this.jackpotSlot) {
            slot.removeAllChildren();
        }
        this.jackpotFrame.active = false;
    }
}


