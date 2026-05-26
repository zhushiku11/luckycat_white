import { _decorator, Component, easing, find, instantiate, Label, Node, Prefab, Sprite, tween, v3 } from 'cc';
import UIHelper from '../../common/UIHelper';
import { ACoins, AMoney, BMoney } from 'db://assets/doge/framework/common/Currency';
import { CurrencyType, Language } from 'db://assets/doge/framework/language/Language';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
const { ccclass, property } = _decorator;

@ccclass('CongratulationsPanel')
export class CongratulationsPanel extends Component implements IPanel {

    @property(Prefab)
    private moneyAnim: Prefab = null;

    @property(Node)
    private amoney: Node = null;
    @property(Node)
    private bmoney: Node = null;
    @property(Node)
    private cmoney: Node = null;
    @property(Node)
    private acoins: Node = null;
    /**
     * @param {number} amoneyReward
     * @param {number} cmoneyReward
     * @param {number} acoinsReward
     * @memberof CongratulationsPanel
     */
    onInit(amoneyReward: number, bmoneyReward: number, acoinsReward: number) {
        let all = [];

        if (bmoneyReward > 0) {
            this.bmoney.active = true;
            this.bmoney.getComponentInChildren(Label).string = Language.getWordByCurrency("l_money", "+", BMoney.string(bmoneyReward));
            this.scheduleOnce(() => {
                let target = find("Canvas/Scene/Topbar/BMoney");
                let icon = find("Icon", target);
                // 飞钱动画
                UIHelper.showBMoneyFly(find("Canvas/Popup"), this.bmoney.worldPosition, icon, (idx: number, last: number) => {
                    if (idx == last) {
                        BMoney.refresh();
                    }
                    if (idx == 0) {
                        let num = find("Num", target);
                        let anim = instantiate(this.moneyAnim);
                        anim.parent = target;
                        anim.position = v3(num.position);
                        anim.getComponentInChildren(Sprite).spriteFrame = icon.getComponent(Sprite).spriteFrame;
                        tween(anim)
                            .by(1.0, { position: v3(0, 50, 0) }, { easing: easing.cubicOut })
                            .to(0.2, { alpha: 0 })
                            .removeSelf()
                            .start();
                        anim.getComponentInChildren(Label).string = Language.getWordByCurrency("l_money", "+", BMoney.string(bmoneyReward))
                    }
                });
            }, 0.2)
            all.push(this.bmoney);
        } else {
            this.bmoney.active = false;
        }

        if (amoneyReward > 0) {
            this.amoney.active = true;
            this.amoney.getComponentInChildren(Label).string = Language.getWordByCurrency("l_money1", "+", Language.getCurrSym(), AMoney.string(amoneyReward));
            this.scheduleOnce(() => {
                let target = find("Canvas/Scene/Topbar/AMoney");
                let icon = find("Icon", target);
                // 飞钱动画
                UIHelper.showAMoneyFly(find("Canvas/Popup"), this.amoney.worldPosition, icon, (idx: number, last: number) => {
                    if (idx == last) {
                        AMoney.refresh();
                    }
                    if (idx == 0) {
                        let num = find("Num", target);
                        let anim = instantiate(this.moneyAnim);
                        anim.parent = target;
                        anim.position = v3(num.position);
                        anim.getComponentInChildren(Sprite).spriteFrame = icon.getComponent(Sprite).spriteFrame;
                        tween(anim)
                            .by(1.0, { position: v3(0, 50, 0) }, { easing: easing.cubicOut })
                            .to(0.2, { alpha: 0 })
                            .removeSelf()
                            .start();
                        anim.getComponentInChildren(Label).string = Language.getWordByCurrency("l_money1", "+", Language.getCurrSym(), AMoney.string(amoneyReward))
                    }
                });
            }, 0.2)
            all.push(this.amoney);
        } else {
            this.amoney.active = false;
        }

        if (acoinsReward > 0) {
            this.acoins.active = true;
            this.acoins.getComponentInChildren(Label).string = Language.getWordByCurrency("l_money", "+", ACoins.string(acoinsReward));

            this.scheduleOnce(() => {
                let target = find("Canvas/Scene/Topbar/ACoins");
                let icon = find("Icon", target);
                // 飞钱动画
                UIHelper.showFlyACoins(find("Canvas/Popup"), this.acoins.worldPosition, icon, (idx: number, last: number) => {
                    if (idx == last) {
                        ACoins.refresh();
                    }
                    if (idx == 0) {
                        let num = find("Num", target);
                        let anim = instantiate(this.moneyAnim);
                        anim.parent = target;
                        anim.position = v3(num.position);
                        anim.getComponentInChildren(Sprite).spriteFrame = icon.getComponent(Sprite).spriteFrame;
                        tween(anim)
                            .by(1.0, { position: v3(0, 50, 0) }, { easing: easing.cubicOut })
                            .to(0.2, { alpha: 0 })
                            .removeSelf()
                            .start();
                        anim.getComponentInChildren(Label).string = Language.getWordByCurrency("l_money", "+", ACoins.string(acoinsReward))
                    }
                });
            }, 0.2)
            all.push(this.acoins);
        } else {
            this.acoins.active = false;
        }

        for (let i = 0; i < all.length; i++) {
            all[i].position = v3(i * 280 - (all.length - 1) * 280 * 0.5, 0, 0);
        }
    };


    onCloseBtnClick() {
        PanelFactory.I.removePanel(this.node, CongratulationsPanel);
    }

    afterOpenEffect(target: Node) {
        this.scheduleOnce(() => {
            this.onCloseBtnClick();
        }, 1.0);
    }
}