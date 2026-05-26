import { _decorator, Component, easing, find, instantiate, Label, Node, sp, Sprite, SpriteFrame, tween, v3, v4 } from 'cc';
import { AssetsDB } from 'db://assets/doge/framework/common/AssetsDB';
import { PRELOAD, RES_NAME } from '../../constant/Constant';
import { Utils } from 'db://assets/doge/framework/common/Utils';
import UIHelper from 'db://assets/main/script/common/UIHelper';
import { Language } from 'db://assets/doge/framework/language/Language';
import { AMoney } from 'db://assets/doge/framework/common/Currency';
const { ccclass, property } = _decorator;

export enum SymbolType {
    S0 = 0,
    S1 = 1,
    S2 = 2,
    S3 = 3,
    S4 = 4,
    S5 = 5,
    S6 = 6,
    S7 = 7,
    S8 = 8,
    STreasure = 999,
    SUniversal = 1000,
    None = 99999
}

export enum SymbolState {
    idle = 0,
    win = 1,
    blur = 2,
    win_idle = 3,
}

const ANIMS_OFFSET = {
    "0": [-1, -1],
    "1": [-1, 3],
    "2": [7, -1],
    "3": [0, 0.5],
    "4": [0, 3.5],
    "5": [0, 0],
    "6": [0, 0],
    "7": [0, 0],
    "8": [0, 0],
    "999": [0, 0],
    "1000": [0, 0],
}

@ccclass('GameSymbol')
export class GameSymbol extends Component {

    public static readonly ALL_TYPE: SymbolType[] = [
        SymbolType.S0,
        SymbolType.S1,
        SymbolType.S2,
        SymbolType.S3,
        SymbolType.S4,
        SymbolType.S5,
        SymbolType.S6,
        SymbolType.S7,
        SymbolType.S8,
        SymbolType.STreasure,
        SymbolType.SUniversal,
    ];

    @property(Node)
    private cashFrame: Node = null;
    @property(Node)
    private icon: Node = null;
    @property(Node)
    private animation: Node = null;
    @property(Node)
    private blur: Node = null;
    @property(sp.Skeleton)
    private frame: sp.Skeleton = null;
    @property(sp.Skeleton)
    private boom: sp.Skeleton = null;
    @property([sp.SkeletonData])
    private normalSymbolsModel: sp.SkeletonData[] = [];
    @property([sp.SkeletonData])
    private specialSymbolsModel: sp.SkeletonData[] = [];

    private symbolType: SymbolType = SymbolType.None;
    private symbolState: SymbolState = SymbolState.idle;

    private changeStateEnd: Function = null;
    private cash: number = 0;

    public static randomType() {
        return GameSymbol.ALL_TYPE[Utils.randomInt(0, GameSymbol.ALL_TYPE.length - 1)];
    }

    protected start(): void {
        console.log(this.getNormalSymbolModel(SymbolType.S0).name);
    }

    init(type: SymbolType, state: SymbolState) {
        this.setType(type);
        this.changeState(state);
        this.removeCash();
    }

    setCash(num: number) {
        this.cash = num;
        this.cashFrame.active = true;
        // 设置现金奖励值
        this.getComponentInChildren(Label).string = Language.getWord("l_text2", Language.getCurrSym(), AMoney.string(this.cash));
        // AMoney.add(num);
    }

    removeCash() {
        this.cash = 0;
        this.cashFrame.active = false;
    }

    isCash() {
        return this.cash != 0;
    }

    cashAnimation() {
        tween(this.cashFrame)
            .delay(0.6)
            .by(0.05, { y: 10 })
            .by(0.1, { y: -20 })
            .by(0.05, { y: 10 })
            .call(() => {
                let target = find("Canvas/Scene/Topbar/AMoney");
                let icon = find("Icon", target);
                UIHelper.showCashAnim(this.cashFrame.getComponentInChildren(Sprite).node.worldPosition, icon, (idx: number, last: number) => {
                    if (idx == last) {
                        AMoney.refresh();
                    }
                    // if (idx == 0) {
                    //     let num = find("Num", target);
                    //     let anim = instantiate(this.moneyAnim);
                    //     anim.parent = target;
                    //     anim.position = v3(num.position);
                    //     anim.getComponentInChildren(Sprite).spriteFrame = icon.getComponent(Sprite).spriteFrame;
                    //     tween(anim)
                    //         .by(1.0, { position: v3(0, 50, 0) }, { easing: easing.cubicOut })
                    //         .to(0.2, { alpha: 0 })
                    //         .removeSelf()
                    //         .start();
                    //     anim.getComponentInChildren(Label).string = Language.getWordByCurrency("l_money", "+", AMoney.string(this.cash))
                    // }
                });
            })
            .start();
    }

    setType(type: SymbolType) {
        this.symbolType = type;
    }

    getType() {
        return this.symbolType
    }

    changeState(state: SymbolState) {
        this.symbolState = state;
        switch (this.symbolState) {
            case SymbolState.idle:
                this._toStateIdle();
                break;
            case SymbolState.win:
                this._toStateWin();
                break;
            case SymbolState.blur:
                this._toStateBlur();
                break;
            case SymbolState.win_idle:
                this._toStateWinIdle();
                break;
        }
    }

    getState() {
        return this.symbolState;
    }

    isSpecialSymbol() {
        return this.symbolType > 100;
    }

    _toStateIdle() {
        this.icon.active = true;
        this.animation.active = false;
        this.blur.active = false;
        this.frame.node.active = false;

        let img = find("Img", this.icon);
        let model = find("Model", this.icon);
        if (this.isSpecialSymbol()) {
            img.active = false;
            model.active = true;
            let spine = model.getComponent(sp.Skeleton);
            Utils.resetSkeletonData(spine, this.getSpecialSymbolModel(this.symbolType));
            this.scheduleOnce(() => {
                spine.setAnimation(0, "idle", true);
            }, 0);
        } else {
            img.active = true;
            model.active = false;
            img.getComponent(Sprite).spriteFrame = AssetsDB.get<SpriteFrame>(PRELOAD.SPFRAME_FRAMES.COMMON[`s${this.symbolType}`], RES_NAME);
        }

        this.changeStateEnd && this.changeStateEnd(this.symbolState);
    }

    _toStateWinIdle() {
        this.icon.active = false;
        this.animation.active = true;
        this.blur.active = false;
        this.frame.node.active = false;

        let anims = find("Anims0", this.animation);
        let animsSpine = anims.getComponent(sp.Skeleton)
        // let specialAnims = find("Anims1", this.animation);
        if (this.isSpecialSymbol()) {
            anims.scales = 0.35;
            Utils.resetSkeletonData(animsSpine, this.getSpecialSymbolModel(this.symbolType));
            animsSpine.premultipliedAlpha = false;
            this.scheduleOnce(() => {
                animsSpine.setAnimation(0, "win", true);
            }, 0);
        } else {
            anims.scales = 1;
            Utils.resetSkeletonData(animsSpine, this.getNormalSymbolModel(this.symbolType));
            animsSpine.premultipliedAlpha = false;
            this.scheduleOnce(() => {
                animsSpine.setAnimation(0, `${animsSpine.skeletonData.name}_win`, true);
            }, 0);
        }
        anims.position = v3(ANIMS_OFFSET[this.symbolType][0], ANIMS_OFFSET[this.symbolType][1], 0);
        tween(this.frame.node).delay(1.7).call(() => {
            this._toStateIdle();
        }).start();
    }

    _toStateWin() {
        this.icon.active = false;
        this.animation.active = true;
        this.blur.active = false;
        this.frame.node.active = true;

        let anims = find("Anims0", this.animation);
        let animsSpine = anims.getComponent(sp.Skeleton)
        // let specialAnims = find("Anims1", this.animation);
        if (this.isSpecialSymbol()) {
            anims.scales = 0.35;
            Utils.resetSkeletonData(animsSpine, this.getSpecialSymbolModel(this.symbolType));
            animsSpine.premultipliedAlpha = false;
            this.scheduleOnce(() => {
                animsSpine.setAnimation(0, "win", false);
            }, 0);

        } else {
            anims.scales = 1;
            Utils.resetSkeletonData(animsSpine, this.getNormalSymbolModel(this.symbolType));
            animsSpine.premultipliedAlpha = false;
            this.scheduleOnce(() => {
                animsSpine.setAnimation(0, `${animsSpine.skeletonData.name}_win`, false);
            }, 0);
        }
        anims.position = v3(ANIMS_OFFSET[this.symbolType][0], ANIMS_OFFSET[this.symbolType][1], 0);
        this.frame.setToSetupPose();
        this.frame.setAnimation(0, "animation", false);
        tween(this.frame.node).delay(0.6).call(() => {
            this.boom.node.active = true;
            this.boom.setToSetupPose();
            this.boom.setAnimation(0, "animation", false);
            console.log("boom fire");

            this.animation.fadeOut(0.1, 0, () => { console.log("icon fadeout"); });
            this.boom.setCompleteListener(() => {
                this.boom.setCompleteListener(null);
                // EventCenter.getInstance().fire(GameEvent.game_axis_roll_move_ele, this.parentCom.idx, this);
                this.animation.alpha = 255;
                this.animation.active = false;
                this.boom.node.active = false;
                this.frame.node.active = false;
                this.changeStateEnd && this.changeStateEnd(this.symbolState);
            });
        }).start()
    }

    _toStateBlur() {
        this.icon.active = false;
        this.animation.active = false;
        this.blur.active = true;
        this.frame.node.active = false;

        let img = find("Img", this.blur);
        if (this.isSpecialSymbol()) {
            switch (this.symbolType) {
                case SymbolType.STreasure:
                    img.getComponent(Sprite).spriteFrame = AssetsDB.get<SpriteFrame>(PRELOAD.SPFRAME_FRAMES.COMMON[`s999_blur`], RES_NAME);
                case SymbolType.SUniversal:
                    img.getComponent(Sprite).spriteFrame = AssetsDB.get<SpriteFrame>(PRELOAD.SPFRAME_FRAMES.COMMON[`s1000_blur`], RES_NAME);
            }
        } else {
            img.getComponent(Sprite).spriteFrame = AssetsDB.get<SpriteFrame>(PRELOAD.SPFRAME_FRAMES.COMMON[`s${this.symbolType}_blur`], RES_NAME);
        }

        this.changeStateEnd && this.changeStateEnd(this.symbolState);
    }

    getSpecialSymbolModel(type: SymbolType) {
        switch (type) {
            case SymbolType.STreasure:
                return this.specialSymbolsModel[0];
            case SymbolType.SUniversal:
                return this.specialSymbolsModel[1];
        }
    }
    getNormalSymbolModel(type: SymbolType) {
        return this.normalSymbolsModel[type];
    }

    getSpecialSymbolBlur(type: SymbolType) {
        switch (type) {
            case SymbolType.STreasure:
                return this.specialSymbolsModel[0];
            case SymbolType.SUniversal:
                return this.specialSymbolsModel[1];
        }
    }

    onChangeStateEnd(callback: Function) {
        this.changeStateEnd = callback;
    }
}


