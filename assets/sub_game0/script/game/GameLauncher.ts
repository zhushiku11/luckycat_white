import { _decorator, Collider2D, Component, ERigidBody2DType, EventTouch, instantiate, macro, Node, PhysicsSystem2D, Prefab, RigidBody2D, Tween, tween, UIOpacity, UITransform, v2, v3, Vec3 } from 'cc';
import { GameLogic } from './GameLogic';
import GameBall from './GameBall';
import { Utils } from 'db://assets/doge/framework/common/Utils';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { AUDIOS, MAX_BALL_TYPE, STORAGE, SUBGAME } from '../../constant/Constant';
import GameDisplayBall from './GameDisplayBall';
import { StorageBox } from 'db://assets/doge/framework/common/StorageBox';
import { GuideSystem } from '../system/GuideSystem';
import AudioTools from 'db://assets/doge/framework/common/AudioTools';
const { ccclass, property } = _decorator;

@ccclass('GameLauncher')
export class GameLauncher extends Component {

    @property(Prefab)
    private ballPrefab: Prefab = null;
    @property(Prefab)
    private displayBallPrefab: Prefab = null;
    @property(Node)
    private deathLine: Node = null;

    private gameLogic: GameLogic = null;

    // 待发射的Ball
    private ball: Node = null;
    // 已发射的Ball列表
    private launchedBall: Node[] = [];
    // 预备发射的Ball类型
    private preparedType: number = -1;
    // 自动掉落开关
    private isAutoDrop: boolean = false;
    // 暂停自动掉落
    private autoDropPause: number = 0;
    // 死亡线闪烁状态
    private deathLineBlinkState: boolean = false;

    private continuousDeaths: number = 0;

    init(gameLogic: GameLogic, storageBallData: { posx: [], posy: [], type: [] }) {
        this.gameLogic = gameLogic;
        this.restoreBall(storageBallData);
        this.buildBall();
        this.closeAutoLaunch()
        this.autoDropPause = 0;
        this.schedule(this.onAutoLaunch, 1, macro.REPEAT_FOREVER, 0);
        this.schedule(this.saveBall, 1, macro.REPEAT_FOREVER, 0);
    }

    isCanTouch() {
        return this.ball && !this.gameLogic.isGameOver && !this.isAutoDrop;
    }

    onTouchStart(event: EventTouch, touchPos: Vec3) {
        if (!this.isCanTouch()) {
            return;
        }
        tween(this.node)
            .to(0.1, { position: v3(touchPos.x, this.node.position.y, 0) })
            .start();
    }

    onTouchMove(event: EventTouch, touchPos: Vec3) {
        if (!this.isCanTouch()) {
            return;
        }
        this.node.position = v3(touchPos.x, this.node.position.y, 0);
    }

    onTouchEnd(event: EventTouch, touchPos: Vec3) {
        if (!this.isCanTouch()) {
            return;
        }
        this.node.position = v3(touchPos.x, this.node.position.y, 0);
        this.launch();
    }

    createBall(gameLogic: GameLogic, type: number, pos: Vec3): Node {
        let launchBall = instantiate(this.ballPrefab);
        launchBall.getComponent(GameBall).init(type, gameLogic);
        launchBall.position = pos;
        launchBall.parent = gameLogic.node;
        let ballCollider: Collider2D = launchBall.getComponent(Collider2D);
        ballCollider.sensor = false;
        ballCollider.apply();
        this.launchedBall.push(launchBall);
        return launchBall;
    }

    launch() {
        let launchBall = this.createBall(this.gameLogic, this.ball.getComponent(GameDisplayBall).type, v3(this.node.position.x, this.node.position.y - 70, this.node.position.z));
        let ballRigidBody = launchBall.getComponent(RigidBody2D);
        ballRigidBody.type = ERigidBody2DType.Dynamic;
        ballRigidBody.linearVelocity = v2(0, -30);
        // ballRigidBody.angularVelocity = Math.random() * 20 - 10;
        AudioTools.sound(AUDIOS.ball_touch);

        this.scheduleOnce(() => {
            this.buildBall();
        }, 0);
        this.ball.destroy();
        this.ball = null;

        if (GuideSystem.I.getStep() == 0) {
            GuideSystem.I.nextShow();
        }
    }

    buildBall(type?: number) {
        let ball = instantiate(this.displayBallPrefab);
        let ballType = type ? type : this.buildBallType();
        ball.getComponent(GameDisplayBall).init(ballType);
        ball.position = v3(0, -70, 0);
        ball.parent = this.node;

        ball.scale = v3(0, 0, 1);
        tween(ball)
            .to(0.3, { scale: v3(1, 1, 1) }, { easing: 'backOut' })
            .call(() => {
                this.ball = ball;
            })
            .start();

        // let tagNode = this.buildBallTag(ball);
        // ball.position = v3(tagNode.position.x, ball.position.y, ball.position.z);
    }

    buildBallType(): number {
        let maxBall = this.getMaxLaunchedBall();
        let maxType = maxBall ? maxBall.type : 0;
        if (this.preparedType == -1) {
            this.preparedType = this.randomBallType(maxType);
        }
        let result = this.preparedType;
        // 预备新的ball类型
        this.preparedType = this.randomBallType(maxType);
        return result;
    }

    private randomBallType(maxType: number): number {
        if (maxType < 4) {
            return Utils.randomInt(0, maxType);
        }
        else if (maxType < 6) {
            let num = Utils.randomInt(0, 100);
            return Math.floor(num / 30);
        }

        let randInt = Utils.randomInt(0, 100);
        if (maxType == 6) {
            if (randInt < 15) {
                return 1;
            }
            else if (randInt < 45) {
                return 2;
            }
            else {
                return 3;
            }
        } else {
            if (randInt < 20) {
                return 2;
            }
            else if (randInt < 60) {
                return 3;
            }
            else {
                return 4;
            }
        }
    }

    getMaxLaunchedBall(): GameBall {
        let maxBall = null;
        let maxType = 0;
        for (const ball of this.launchedBall) {
            let gameBall = ball.getComponent(GameBall);
            if (gameBall.type > maxType) {
                maxBall = gameBall;
                maxType = gameBall.type;
            }
        }
        return maxBall;
    }

    remove(ball: Node) {
        let idx = this.launchedBall.indexOf(ball);
        if (idx != -1) {
            ball.destroy();
            this.launchedBall.splice(idx, 1);
        }
    }

    removeAll() {
        for (let i = 0; i < this.launchedBall.length; i++) {
            const ball = this.launchedBall[i];
            ball.destroy();
        }
        this.launchedBall.length = 0;
    }

    public getBallsByType(ballType: number) {
        let result = [];
        for (let i = 0; i < this.launchedBall.length; i++) {
            const ballNode = this.launchedBall[i];
            if (ballNode.getComponent(GameBall).type == ballType) {
                result.push(ballNode);
            }
        }
        return result;
    }

    onAutoDropClick() {
        if (this.gameLogic.isGameOver) {
            return;
        }
        if (this.isAutoDrop) {
            console.log("close auto drop");
            this.isAutoDrop = false;
            this.autoDropPause = 0;
        } else {
            console.log("open auto drop");
            this.isAutoDrop = true;
            this.autoDropPause = 0;
        }
    }

    private onAutoLaunch() {
        if (!this.ball) {
            return
        }
        if (this.gameLogic.isGameOver) {
            return;
        }
        if (!this.isAutoLaunchOpen()) {
            return;
        }
        if (this.isAutoLaunchPause()) {
            return;
        }
        let allBall = this.launchedBall.filter((ball: Node) => {
            return this.ball.getComponent(GameDisplayBall).type == ball.getComponent(GameBall).type;
        }).sort((a: Node, b: Node) => {
            return a.position.y - b.position.y;
        })
        let x = allBall[0] ? allBall[0].position.x : Utils.randomFloat(-350, 350);
        this.node.position = v3(x, this.node.position.y, this.node.position.z);
        this.launch();
    }

    openAutoLaunch() {
        this.isAutoDrop = true;
    }

    closeAutoLaunch() {
        this.isAutoDrop = false;
    }

    pauseAutoLaunch() {
        this.autoDropPause += 1;
    }

    resumeAutoLaunch() {
        this.autoDropPause -= 1;
    }

    isAutoLaunchOpen() {
        return this.isAutoDrop;
    }

    isAutoLaunchPause() {
        return this.autoDropPause > 0;
    }

    checkDeath() {
        let deathLinePos = this.gameLogic.getComponent(UITransform).convertToNodeSpaceAR(this.deathLine.worldPosition);
        let warningLinePos = v3(deathLinePos.x, deathLinePos.y - 90, deathLinePos.z);

        this.schedule(() => {
            let maxY = 0;
            for (let i = 0; i < this.launchedBall.length; i++) {
                const ball = this.launchedBall[i];
                const gameBall = ball.getComponent(GameBall);
                if (!gameBall.isNoCollision()) {
                    let ballY = ball.position.y + ball.getComponent(UITransform).height / 2;
                    if (ballY > maxY) {
                        maxY = ballY;
                    }
                }
            }

            if (maxY > deathLinePos.y) {
                console.log(maxY, deathLinePos.y);
                this.continuousDeaths += 1;
                console.log("death", this.continuousDeaths);
                if (this.continuousDeaths == 2) {
                    // 触发结束
                    if (this.isDeathLineBlink()) {
                        this.closeDeathLineBlink();
                    }
                    if (!this.gameLogic.isGameOver) {
                        this.gameLogic.gameOver();
                    }
                }
            } else if (maxY > warningLinePos.y) {
                // 触发预警
                console.log("death hint");
                if (!this.isDeathLineBlink()) {
                    this.openDeathLineBlink();
                }
            } else {
                // 无触发
                if (this.isDeathLineBlink()) {
                    this.closeDeathLineBlink();
                }
            }
            if (maxY <= deathLinePos.y) {
                this.continuousDeaths = 0;
            }
        }, 0.5, macro.REPEAT_FOREVER, 3);
    }

    isDeathLineBlink() {
        return this.deathLineBlinkState;
    }

    openDeathLineBlink() {
        if (this.deathLineBlinkState) {
            return;
        }
        this.deathLineBlinkState = true;
        tween(this.deathLine)
            .to(0.2, { alpha: 0 })
            .to(0.2, { alpha: 255 })
            .union()
            .repeatForever()
            .start();
    }

    closeDeathLineBlink() {
        if (!this.deathLineBlinkState) {
            return;
        }
        this.deathLineBlinkState = false;
        this.deathLine.alpha = 255;
        Tween.stopAllByTarget(this.deathLine);
    }

    refreshBall() {
        for (let i = 0; i < this.launchedBall.length; i++) {
            const ballNode = this.launchedBall[i];
            if (ballNode.position.x >= 0) {
                ballNode.getComponent(RigidBody2D).linearVelocity = v2(-40, 10);
            } else if (ballNode.position.x < 0) {
                ballNode.getComponent(RigidBody2D).linearVelocity = v2(40, 10);
            }
        }
        // this.isRefreshBall = true;
        // this.scheduleOnce(() => { this.isRefreshBall = false; }, 2.5);
    }

    changeAlmightyBall() {
        if (this.ball) {
            if (this.ball.getComponent(GameDisplayBall).type != 99) {
                // 切换球
                this.buildAlmightyBall();
            }
        }
    }

    buildAlmightyBall() {
        let ballType = 99;
        this.ball.destroy();
        this.ball = null;
        this.buildBall(ballType);
    }

    saveBall() {
        let data = { posx: [], posy: [], type: [] };
        for (let i = 0; i < this.launchedBall.length; i++) {
            const ballNode = this.launchedBall[i];
            data.posx.push(Math.floor(ballNode.x));
            data.posy.push(Math.floor(ballNode.y));
            data.type.push(ballNode.getComponent(GameBall).type);
        }
        StorageBox.save(STORAGE.CACHE_BALL, JSON.stringify(data));
    }

    restoreBall(storageBallData: { posx: [], posy: [], type: [] }) {
        if (!storageBallData.posx) {
            return;
        }
        let len = storageBallData.posx.length;
        for (let i = 0; i < len; i++) {
            const x = storageBallData.posx[i];
            const y = storageBallData.posy[i];
            const type = storageBallData.type[i];
            console.log("restoreBall", type);
            if (type < MAX_BALL_TYPE) {
                let launchBall = this.createBall(this.gameLogic, type, v3(x, y, 0));
                let ballRigidBody = launchBall.getComponent(RigidBody2D);
                ballRigidBody.type = ERigidBody2DType.Dynamic;
                ballRigidBody.linearVelocity = v2(0, 0);
                ballRigidBody.angularVelocity = 0;
            }
        }
    }
}


