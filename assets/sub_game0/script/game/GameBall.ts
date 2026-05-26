import { Component, Vec3, _decorator, Node, v3, tween, UITransform, Sprite, CircleCollider2D, SpriteFrame, Collider2D, Contact2DType, IPhysics2DContact, Tween, find } from "cc";
import { AssetsDB } from "db://assets/doge/framework/common/AssetsDB";
import { MAX_BALL_TYPE, PRELOAD, RES_NAME, SUBGAME } from "../../constant/Constant";
import { GameLogic } from "./GameLogic";
import { getEventEmiter } from "db://assets/doge/framework/common/EventEmitter";
import { PropType } from "../system/PropSystem";
import { PropInput } from "./PropInput";

const { ccclass, property } = _decorator;

const BALL_NUM = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 20481];

enum COLLIDER_TAG {
    FLOOR = 1,
    BALL = 2,
    GAME_OVER = 3,
    REMOVE = 4,
}

@ccclass("GameBall")
export default class GameBall extends Component {

    public static isAnim: number = 0;

    @property(Sprite)
    private img: Sprite = null;

    public type: number = 0;
    private gameLogic: GameLogic = null;

    private levelUpAnim: Tween<Node> = null;
    public shutDown: boolean = false;
    public collisionsCount: number = 0;

    init(ballType: number, gameLogic: GameLogic) {
        this.gameLogic = gameLogic;
        this.setType(ballType);

        let collider = this.getComponent(CircleCollider2D);
        collider.radius = this.getComponent(UITransform).width / 2;
        collider.apply();
    }

    private setType(ballType: number) {
        console.log("init BallType", ballType);
        this.type = ballType;
        // 设置球的spriteFrame
        this.img.spriteFrame = AssetsDB.get<SpriteFrame>(PRELOAD.SPFRAME_FRAMES.COMMON[`item${ballType}`], RES_NAME);
        // 设置球的大小
        let imgTrans = this.img.getComponent(UITransform);
        this.getComponent(UITransform).width = imgTrans.width;
        this.getComponent(UITransform).height = imgTrans.height;
    }

    protected onEnable(): void {
        getEventEmiter().on(SUBGAME.FUNC.OPEN_BALL_TOUCH, this.onTouchOpen, this);
        getEventEmiter().on(SUBGAME.FUNC.CLOSE_BALL_TOUCH, this.onTouchClose, this);
    }

    protected onDisable(): void {
        getEventEmiter().off(SUBGAME.FUNC.OPEN_BALL_TOUCH, this.onTouchOpen, this);
        getEventEmiter().off(SUBGAME.FUNC.CLOSE_BALL_TOUCH, this.onTouchClose, this);
    }

    onLoad() {
    }

    start() {
        this.addColliderListener();
    }

    protected update(dt: number): void {
        let y = this.node.position.y;
        if (y < -1400) {
            this.remove();
        }
    }

    addColliderListener() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.beginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.endContact, this);
            collider.on(Contact2DType.POST_SOLVE, this.postSolve, this);
        }
    }

    removeColliderListener() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.beginContact, this);
            collider.off(Contact2DType.END_CONTACT, this.endContact, this);
            collider.off(Contact2DType.POST_SOLVE, this.postSolve, this);
        }
    }

    public static isSame(type1: number, type2: number) {
        if (type1 == 99 && type2 == 99) {
            // 两球同为万能球 不相同
            return false;
        }
        if (type1 == 99) {
            return true;
        }
        if (type2 == 99) {
            return true;
        }

        if (type1 >= MAX_BALL_TYPE || type2 >= MAX_BALL_TYPE) {
            return false
        }
        return type1 == type2;
    }

    public static formatType(ball: GameBall, defaultType: number) {
        if (ball.type == 99) {
            ball.type = defaultType;
        }
        return ball.type;
    }

    public static up(type: number) {
        if (type >= MAX_BALL_TYPE) {
            return MAX_BALL_TYPE;
        } else {
            return type + 1;
        }
    }

    beginContact(selfConllider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // let gameLogic: GameLogic = this.getGameLogic();
        switch (otherCollider.tag) {
            case COLLIDER_TAG.FLOOR:
                // 球 -> 地板
                this.collisionsCount += 1;
                this.gameLogic.onBallContactFloor(selfConllider, otherCollider, contact);
                break;
            case COLLIDER_TAG.BALL:
                // 球 -> 球
                this.collisionsCount += 1;
                if (selfConllider.node.position.y >= otherCollider.node.position.y) {
                    this.gameLogic.onBallContactBall(selfConllider, otherCollider, contact);
                }
                break;
        }
    }

    endContact(selfConllider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {

    }

    postSolve(selfConllider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

    }

    levelUp(pos: Vec3) {
        let type = GameBall.up(this.type);
        tween(this.node)
            .to(0.1, { position: pos })
            .call(() => {
                this.reset(type);
            })
            .start();
    }

    kill(pos: Vec3) {
        tween(this.node)
            .to(0.1, { position: pos, scale: v3(0, 0, 1) })
            .call(() => {
                this.remove();
            })
            .start();
    }

    private remove() {
        this.gameLogic.removeBall(this.node);
    }

    private reset(type: number) {
        let trans = this.getComponent(UITransform);

        let oldWidth = trans.width;
        this.setType(type);
        let width = trans.width;
        this.node.scale = v3(oldWidth * 1.0 / width, oldWidth * 1.0 / width, 1);

        if (this.levelUpAnim) {
            this.levelUpAnim.stop();
        }

        this.levelUpAnim = tween(this.node)
            .parallel(
                tween()
                    .delay(0.1)
                    .call(() => {
                        let collider = this.getComponent(CircleCollider2D);
                        collider.radius = width / 2;
                        collider.apply();
                        this.shutDown = false;
                    }),
                tween(this.node)
                    .to(0.15, { scale: v3(1.15, 1.15, 1) })
                    .to(0.3, { scale: v3(1, 1, 1) })
            )
            .start()
    }

    isNoCollision() {
        return this.collisionsCount == 0;
    }

    private endCallback: Function = null;
    private propType: PropType = null;
    public onTouchOpen(callback: Function, type: PropType) {
        this.endCallback = callback;
        this.propType = type;
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    public onTouchClose() {
        this.endCallback = null;
        this.propType = null;
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    public onTouchEnd() {
        switch (this.propType) {
            case PropType.PROP0:
                this.removeSingleBall(this.endCallback);
                break;
            case PropType.PROP1:
                this.removeSameBall(this.endCallback);
                break;
        }
    }

    removeSingleBall(endFunc: Function) {
        if (GameBall.isAnim) {
            return;
        }
        GameBall.isAnim += 1;
        let propInput = find("Canvas/Scene/PropInput").getComponent(PropInput);
        if (propInput.node.active) {
            // 锤子渐现
            // 砸击动画
            propInput.runSmashAnim(this.node, () => {
                console.log("球消除", GameBall.isAnim);
                // 球消除
                tween(this.node)
                    .to(0.1, { scale: v3(0, 0, 0) })
                    .call(() => {
                        this.gameLogic.removeBall(this.node);
                    })
                    .start();
                propInput.scheduleOnce(() => {
                    endFunc && endFunc();
                    GameBall.isAnim -= 1;
                }, 0.5);
            });
        }
    }

    removeSameBall(endFunc: Function) {
        if (GameBall.isAnim) {
            return;
        }
        GameBall.isAnim += 1;
        let propInput = find("Canvas/Scene/PropInput").getComponent(PropInput);
        if (propInput.node.active) {
            let nodes = this.gameLogic.getBallsByType(this.type);
            // 魔法棒渐现
            // 魔法动画
            propInput.runMagicAnim(nodes, (node: Node, index: number) => {
                tween(node)
                    .to(0.1, { scale: v3(0, 0, 0) })
                    .call(() => {
                        // 球消除
                        this.gameLogic.removeBall(node);
                    })
                    .start();
                if (index == nodes.length - 1) {
                    propInput.scheduleOnce(() => {
                        endFunc && endFunc();
                        GameBall.isAnim -= 1;
                    }, 0.5);
                }
            });
        }
    }
}
