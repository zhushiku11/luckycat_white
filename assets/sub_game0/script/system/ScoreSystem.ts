import { StorageBox } from "db://assets/doge/framework/common/StorageBox";
import { Language } from "db://assets/doge/framework/language/Language";
import { MAX_BALL_TYPE } from "../../constant/Constant";
import { UploadSystem } from "./UploadSystem";

export const STORAGE = {
    GAME_TARGET: "GAME_TARGET",
    GAME_1024: "GAME_1024",
    GAME_2048: "GAME_2048",
    SCORE: "SCORE",
    HIGHER_SCORE: "HIGHER_SCORE",
}

export class ScoreSystem {

    private static _instance = null;
    public static get I(): ScoreSystem {
        if (!ScoreSystem._instance) {
            ScoreSystem._instance = new ScoreSystem();
        }
        return ScoreSystem._instance;
    }

    private vo: ScoreSystemVO = new ScoreSystemVO();

    init(game2048: number = -1) {
        if (game2048 != -1) {
            this.vo.game2048 = game2048;
        } else {
            this.vo.game2048 = parseInt(StorageBox.load(STORAGE.GAME_2048, "0"));
        }
        if (this.vo.game2048 > 0) {
            this.vo.gameTarget = MAX_BALL_TYPE;
        } else {
            this.vo.gameTarget = parseInt(StorageBox.load(STORAGE.GAME_TARGET, "1"));
        }

        this.vo.game1024 = parseInt(StorageBox.load(STORAGE.GAME_1024, "0"));
        this.refreshGame2048();
        this.refreshGame1024();
        this.vo.score = parseInt(StorageBox.loadGlobal(STORAGE.SCORE, "0"));
        this.vo.higherScore = parseInt(StorageBox.loadGlobal(STORAGE.HIGHER_SCORE, "0"));
    }

    public setTarget(type: number) {
        this.vo.gameTarget = type;
    }

    public upgradeTarget(type: number) {
        if (type >= this.vo.gameTarget && type < MAX_BALL_TYPE) {
            this.setTarget(type + 1);
        }
    }

    public getTarget() {
        return this.vo.gameTarget;
    }

    public isSameWithTarget(newType: number) {
        if (newType > MAX_BALL_TYPE) {
            newType = MAX_BALL_TYPE;
        }
        return this.vo.gameTarget == newType;
    }

    public addGame2048() {
        this.vo.game2048 += 1;
        UploadSystem.I.level();
    }

    public refreshGame2048() {
        Language.updVariable("game2048", this.vo.game2048.toString());
    }

    public addGame1024() {
        this.vo.game1024 += 1;
    }

    public refreshGame1024() {
        Language.updVariable("game1024", this.vo.game1024.toString());
    }

    public getGame2048() {
        return this.vo.game2048;
    }

    public getGame1024() {
        return this.vo.game1024;
    }

    public addScore(score: number) {
        this.vo.score += score;
        if (this.vo.score > this.vo.higherScore) {
            this.vo.higherScore = this.vo.score;
        }
    }

    public getScore() {
        return this.vo.score;
    }

    public getHigherScore() {
        return this.vo.higherScore;
    }

    public clearScore() {
        this.vo.score = 0;
    }
}

class ScoreSystemVO {
    // 游戏目标
    private _gameTarget: number = 0;
    public get gameTarget(): number {
        return this._gameTarget;
    }
    public set gameTarget(value: number) {
        this._gameTarget = value;
        StorageBox.save(STORAGE.GAME_TARGET, this._gameTarget.toString());
        Language.updVariable("gameTarget", this._gameTarget.toString());
    }

    // 2048数量
    private _game2048: number = 0;
    public get game2048(): number {
        return this._game2048;
    }
    public set game2048(value: number) {
        this._game2048 = value;
        StorageBox.save(STORAGE.GAME_2048, this._game2048.toString());
    }

    // 1024数量
    private _game1024: number = 0;
    public get game1024(): number {
        return this._game1024;
    }
    public set game1024(value: number) {
        this._game1024 = value;
        StorageBox.save(STORAGE.GAME_1024, this._game1024.toString());
    }

    // 分数
    private _score: number = 0;
    public get score(): number {
        return this._score;
    }
    public set score(value: number) {
        this._score = value;
        StorageBox.save(STORAGE.SCORE, this._score.toString());
        Language.updVariable("score", this._score.toString());
    }

    // 最高分
    private _higherScore: number = 0;
    public get higherScore(): number {
        return this._higherScore;
    }
    public set higherScore(value: number) {
        this._higherScore = value;
        StorageBox.save(STORAGE.HIGHER_SCORE, this._higherScore.toString());
        Language.updVariable("higherScore", this._higherScore.toString());
    }
}


