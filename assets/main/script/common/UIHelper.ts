import { UITransform, Vec3, Node, UIOpacity, v2, instantiate, tween, v3, Size, Sprite, find } from "cc";
import { AUDIOS } from "../../constant/Constant";
import { getEventEmiter } from "db://assets/doge/framework/common/EventEmitter";
import AudioTools from "db://assets/doge/framework/common/AudioTools";
import { LanguageSprite } from "db://assets/doge/framework/language/LanguageSprite";


export default class UIHelper {

    public static open(event: string, data?: any) {
        getEventEmiter().emit(event, data);
    }

    public static showAMoneyFly(parent: Node, currPos: Vec3, targetNode: Node, callback?: Function) {
        this.showFlyAnim(parent, { name: "amoney", pos: currPos }, targetNode, (idx: number, last: number) => {
            if (idx == 0) {
                AudioTools.sound(AUDIOS.reward);
            }
            if (idx % 4 == 3 && targetNode && targetNode.parent) {
                tween(targetNode.parent.getChildByName("Num"))
                    .to(0.06, { scale: v3(1.2, 1.2, 1) })
                    .to(0.04, { scale: v3(1, 1, 1) })
                    .start();
            }
            callback(idx, last);
        });
    }

    public static showBMoneyFly(parent: Node, currPos: Vec3, targetNode: Node, callback?: Function) {
        this.showFlyAnim(parent, { name: "bmoney", pos: currPos }, targetNode, (idx: number, last: number) => {
            if (idx == 0) {
                AudioTools.sound(AUDIOS.reward);
            }
            if (idx % 4 == 3 && targetNode && targetNode.parent) {
                tween(targetNode.parent.getChildByName("Num"))
                    .to(0.06, { scale: v3(1.2, 1.2, 1) })
                    .to(0.04, { scale: v3(1, 1, 1) })
                    .start();
            }
            callback(idx, last);
        });
    }

    public static showFlyACoins(parent: Node, currPos: Vec3, targetNode: Node, callback?: Function) {
        this.showFlyAnim(parent, { name: "acoins", pos: currPos }, targetNode, (idx: number, last: number) => {
            if (idx == 0) {
                AudioTools.sound(AUDIOS.reward);
            }
            if (idx % 4 == 3 && targetNode && targetNode.parent) {
                tween(targetNode.parent.getChildByName("Num"))
                    .to(0.06, { scale: v3(1.2, 1.2, 1) })
                    .to(0.04, { scale: v3(1, 1, 1) })
                    .start();
            }
            callback(idx, last);
        });
    }

    public static showCashAnim(currPos: Vec3, targetNode: Node, callback?: Function) {
        this.showCashSymbolAnim(find("Canvas/Popup"), { name: "amoney", pos: currPos }, targetNode, (idx: number, last: number) => {
            if (idx == 0) {
                AudioTools.sound(AUDIOS.reward);
            }
            if (idx % 4 == 3 && targetNode && targetNode.parent) {
                tween(targetNode.parent.getChildByName("Num"))
                    .to(0.06, { scale: v3(1.2, 1.2, 1) })
                    .to(0.04, { scale: v3(1, 1, 1) })
                    .start();
            }
            callback(idx, last);
        });
    }

    public static showFlyAnim(parent: Node, opt: { name: string, bundle?: string, pos?: Vec3 }, targetNode: Node, callback?: Function) {
        let from = parent;
        let moneyIcon = targetNode;
        let worldPos = moneyIcon.worldPosition;

        let target = from.getComponent(UITransform).convertToNodeSpaceAR(worldPos);

        let templateNode = new Node();
        let sp = templateNode.addComponent(Sprite);
        sp.sizeMode = Sprite.SizeMode.TRIMMED;
        sp.type = Sprite.Type.SIMPLE;
        let lsp = templateNode.addComponent(LanguageSprite);
        lsp.forCurrency();
        lsp.config(opt.name, opt.bundle ? opt.bundle : undefined);
        templateNode.addComponent(UIOpacity);
        templateNode.position = from.getComponent(UITransform).convertToNodeSpaceAR(opt.pos || v3(0, 0, 0));
        templateNode.scale = new Vec3(1.6, 1.6, 1);

        let array = [v2(0.6, 0.9), v2(0.75, 0.5), v2(-0.9, -1.0), v2(1.0, 0.1), v2(-0.8, -0.7), v2(0.5, 0.2), v2(-0.4, -0.5), v2(0.2, 0.1), v2(-0.2, 0.3), v2(-0.75, -0.3), v2(-0.1, -0.1)];
        for (let i = 0; i < array.length; i++) {
            let node = instantiate(templateNode);
            from.addChild(node);
            let pos = array[i];

            tween(node)
                .delay(0.03 * (i + 1))
                .by(0.17, { position: v3(pos.x * 150, Math.abs(pos.y * 150) * Math.random(), 0) })
                // .delay(0.13)
                // .by(0.17, { position: v3(30, -(target.y - node.position.y) * 30 / (-node.position.x - target.x), 0) })
                .by(0.17, { position: v3(30, 71, 0) })
                .parallel(
                    tween(node).to(0.25, { position: v3(target.x, target.y, 0) }),
                    tween(node).to(0.25, { scale: v3(1, 1, 1) })
                )
                .call(() => {
                    tween(node.getComponent(UIOpacity))
                        .to(0.2, { opacity: 0 })
                        .call(() => {
                            node.destroy();
                        })
                        .start();

                    callback && callback(i, array.length - 1);
                })
                .start();
        }
        templateNode.destroy();
    }

    public static showCashSymbolAnim(parent: Node, opt: { name: string, bundle?: string, pos?: Vec3 }, targetNode: Node, callback?: Function) {
        let from = parent;
        let moneyIcon = targetNode;
        let worldPos = moneyIcon.worldPosition;

        let target = from.getComponent(UITransform).convertToNodeSpaceAR(worldPos);

        let templateNode = new Node();
        let sp = templateNode.addComponent(Sprite);
        sp.sizeMode = Sprite.SizeMode.TRIMMED;
        sp.type = Sprite.Type.SIMPLE;
        let lsp = templateNode.addComponent(LanguageSprite);
        lsp.forCurrency();
        lsp.config(opt.name, opt.bundle ? opt.bundle : undefined);
        templateNode.addComponent(UIOpacity);
        templateNode.position = from.getComponent(UITransform).convertToNodeSpaceAR(opt.pos || v3(0, 0, 0));
        templateNode.scale = new Vec3(1.6, 1.6, 1);

        for (let i = 0; i < 8; i++) {
            let node = instantiate(templateNode);
            from.addChild(node);
            tween(node)
                .delay(0.03 * (i + 1))
                // .delay(0.13)
                // .by(0.17, { position: v3(30, -(target.y - node.position.y) * 30 / (-node.position.x - target.x), 0) })
                .parallel(
                    tween(node).to(0.25, { position: v3(target.x, target.y, 0) }),
                    tween(node).to(0.25, { scale: v3(1, 1, 1) })
                )
                .call(() => {
                    tween(node.getComponent(UIOpacity))
                        .to(0.2, { opacity: 0 })
                        .call(() => {
                            node.destroy();
                        })
                        .start();

                    callback && callback(i, 8 - 1);
                })
                .start();
        }
        templateNode.destroy();
    }
}
