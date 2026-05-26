import { StorageBox } from "db://assets/doge/framework/common/StorageBox";
import { STORAGE } from "../../constant/Constant";
import { Language } from "db://assets/doge/framework/language/Language";
import { Clock } from "db://assets/doge/framework/common/Clock";

export enum PropType {
    PROP0 = 0,
    PROP1 = 1,
    PROP2 = 2,
    PROP3 = 3,
}

export class PropSystem {

    private static _instance = null;
    public static get I(): PropSystem {
        if (!PropSystem._instance) {
            PropSystem._instance = new PropSystem();
        }
        return PropSystem._instance;
    }

    private vo: PropSystemVO = new PropSystemVO();

    public init() {
        this.vo.prop0Count = parseInt(StorageBox.load(STORAGE.PROP0_COUNT, "1"));
        this.vo.prop1Count = parseInt(StorageBox.load(STORAGE.PROP1_COUNT, "1"));
        this.vo.prop2Count = parseInt(StorageBox.load(STORAGE.PROP2_COUNT, "1"));
        this.vo.prop3Count = parseInt(StorageBox.load(STORAGE.PROP3_COUNT, "1"));
        Language.updVariable("prop0price", this.vo.prop0Price.toString());
        Language.updVariable("prop1price", this.vo.prop1Price.toString());
        Language.updVariable("prop2price", this.vo.prop2Price.toString());
        Language.updVariable("prop3price", this.vo.prop3Price.toString());
        let time = parseInt(StorageBox.load("PROP_TIME", "0"));
        let currTime = Clock.zero(new Date()).getTime();
        if (time != currTime) {
            this.vo.prop0ClaimCount = 0;
            this.vo.prop1ClaimCount = 0;
            this.vo.prop2ClaimCount = 0;
            this.vo.prop3ClaimCount = 0;
            StorageBox.save("PROP_TIME", currTime.toString());
        } else {
            this.vo.prop0ClaimCount = parseInt(StorageBox.load(STORAGE.PROP0_CLAIM_COUNT, "0"));
            this.vo.prop1ClaimCount = parseInt(StorageBox.load(STORAGE.PROP1_CLAIM_COUNT, "0"));
            this.vo.prop2ClaimCount = parseInt(StorageBox.load(STORAGE.PROP2_CLAIM_COUNT, "0"));
            this.vo.prop3ClaimCount = parseInt(StorageBox.load(STORAGE.PROP3_CLAIM_COUNT, "0"));
        }
    }

    // 根据类型补充道具
    public give(type: PropType) {
        switch (type) {
            case PropType.PROP0:
                this.add(type, this.vo.prop0GiveNum);
                break;
            case PropType.PROP1:
                this.add(type, this.vo.prop1GiveNum);
                break;
            case PropType.PROP2:
                this.add(type, this.vo.prop2GiveNum);
                break;
            case PropType.PROP3:
                this.add(type, this.vo.prop3GiveNum);
                break;
        }
    }

    // 根据类型使用道具
    public use(type: PropType) {
        this.add(type, -1);
        // 增加道具使用次数
        // TaskSystem.I.addCompleteCount(TaskType.USE_PROP, 1);
    }

    // 根据类型判断 道具是否足够
    public isEnough(type: PropType) {
        switch (type) {
            case PropType.PROP0:
                return this.vo.prop0Count > 0;
            case PropType.PROP1:
                return this.vo.prop1Count > 0;
            case PropType.PROP2:
                return this.vo.prop2Count > 0;
            case PropType.PROP3:
                return this.vo.prop3Count > 0;
        }
    }

    // 根据类型判断 道具是否已达上限
    public isFull(type: PropType) {
        switch (type) {
            case PropType.PROP0:
                return this.vo.prop0Count >= this.vo.prop0Limit;
            case PropType.PROP1:
                return this.vo.prop1Count >= this.vo.prop1Limit;
            case PropType.PROP2:
                return this.vo.prop2Count >= this.vo.prop2Limit;
            case PropType.PROP3:
                return this.vo.prop3Count >= this.vo.prop3Limit;
        }
    }

    // 根据类型 增加道具数量 负值则减少
    public add(type: PropType, num: number) {
        let count = 0;
        switch (type) {
            case PropType.PROP0:
                count = this.vo.prop0Count + num;
                if (count < 0) {
                    count = 0;
                }
                if (count > this.vo.prop0Limit) {
                    count = this.vo.prop0Limit;
                }
                this.vo.prop0Count = count;
                break;
            case PropType.PROP1:
                count = this.vo.prop1Count + num;
                if (count < 0) {
                    count = 0;
                }
                if (count > this.vo.prop1Limit) {
                    count = this.vo.prop1Limit;
                }
                this.vo.prop1Count = count;
                break;
            case PropType.PROP2:
                count = this.vo.prop2Count + num;
                if (count < 0) {
                    count = 0;
                }
                if (count > this.vo.prop2Limit) {
                    count = this.vo.prop2Limit;
                }
                this.vo.prop2Count = count;
                break;
            case PropType.PROP3:
                count = this.vo.prop3Count + num;
                if (count < 0) {
                    count = 0;
                }
                if (count > this.vo.prop3Limit) {
                    count = this.vo.prop3Limit;
                }
                this.vo.prop3Count = count;
                break;
        }
    }

    // 根据类型 获取道具价格
    public getPrice(type: PropType): number {
        switch (type) {
            case PropType.PROP0:
                return this.vo.prop0Price;
            case PropType.PROP1:
                return this.vo.prop1Price;
            case PropType.PROP2:
                return this.vo.prop2Price;
            case PropType.PROP3:
                return this.vo.prop3Price;
        }
    }

    public getClaimCount(type: PropType): number {
        switch (type) {
            case PropType.PROP0:
                return this.vo.prop0ClaimCount;
            case PropType.PROP1:
                return this.vo.prop1ClaimCount;
            case PropType.PROP2:
                return this.vo.prop2ClaimCount;
            case PropType.PROP3:
                return this.vo.prop3ClaimCount;
        }
    }

    public addClaimCount(type: PropType) {
        switch (type) {
            case PropType.PROP0:
                this.vo.prop0ClaimCount++;
                break;
            case PropType.PROP1:
                this.vo.prop1ClaimCount++;
                break;
            case PropType.PROP2:
                this.vo.prop2ClaimCount++;
                break;
            case PropType.PROP3:
                this.vo.prop3ClaimCount++;
                break;
        }
    }
}

export class PropSystemVO {
    // 道具0数量
    private _prop0Count: number = 0;
    // 道具1数量
    private _prop1Count: number = 0;
    // 道具2数量
    private _prop2Count: number = 0;
    // 道具3数量
    private _prop3Count: number = 0;

    // 道具0价格
    private _prop0Price: number = 500;
    // 道具1价格
    private _prop1Price: number = 500;
    // 道具2价格
    private _prop2Price: number = 600;
    // 道具3价格
    private _prop3Price: number = 700;

    // 道具0补充数量
    private _prop0GiveNum: number = 1;
    // 道具1补充数量
    private _prop1GiveNum: number = 1;
    // 道具2补充数量
    private _prop2GiveNum: number = 1;
    // 道具3补充数量
    private _prop3GiveNum: number = 1;

    // 道具0数量上限
    private _prop0Limit: number = 999999;
    // 道具1数量上限
    private _prop1Limit: number = 999999;
    // 道具2数量上限
    private _prop2Limit: number = 999999;
    // 道具3数量上限
    private _prop3Limit: number = 999999;

    // 道具0领取次数
    private _prop0ClaimCount: number = 0;
    // 道具0领取次数
    private _prop1ClaimCount: number = 0;
    // 道具0领取次数
    private _prop2ClaimCount: number = 0;
    // 道具0领取次数
    private _prop3ClaimCount: number = 0;

    public get prop0Count(): number {
        return this._prop0Count;
    }
    public set prop0Count(value: number) {
        this._prop0Count = value;
        Language.updVariable("prop0Num", this._prop0Count.toString());
        StorageBox.save(STORAGE.PROP0_COUNT, this._prop0Count.toString());
    }
    public get prop1Count(): number {
        return this._prop1Count;
    }
    public set prop1Count(value: number) {
        this._prop1Count = value;
        Language.updVariable("prop1Num", this._prop1Count.toString());
        StorageBox.save(STORAGE.PROP1_COUNT, this._prop1Count.toString());
    }
    public get prop2Count(): number {
        return this._prop2Count;
    }
    public set prop2Count(value: number) {
        this._prop2Count = value;
        Language.updVariable("prop2Num", this._prop2Count.toString());
        StorageBox.save(STORAGE.PROP2_COUNT, this._prop2Count.toString());
    }
    public get prop3Count(): number {
        return this._prop3Count;
    }
    public set prop3Count(value: number) {
        this._prop3Count = value;
        Language.updVariable("prop3Num", this._prop3Count.toString());
        StorageBox.save(STORAGE.PROP3_COUNT, this._prop3Count.toString());
    }
    public get prop0Price(): number {
        return this._prop0Price;
    }
    public set prop0Price(value: number) {
        this._prop0Price = value;
    }
    public get prop1Price(): number {
        return this._prop1Price;
    }
    public set prop1Price(value: number) {
        this._prop1Price = value;
    }
    public get prop2Price(): number {
        return this._prop2Price;
    }
    public set prop2Price(value: number) {
        this._prop2Price = value;
    }
    public get prop3Price(): number {
        return this._prop3Price;
    }
    public set prop3Price(value: number) {
        this._prop3Price = value;
    }

    public get prop0GiveNum(): number {
        return this._prop0GiveNum;
    }
    public set prop0GiveNum(value: number) {
        this._prop0GiveNum = value;
    }
    public get prop1GiveNum(): number {
        return this._prop1GiveNum;
    }
    public set prop1GiveNum(value: number) {
        this._prop1GiveNum = value;
    }
    public get prop2GiveNum(): number {
        return this._prop2GiveNum;
    }
    public set prop2GiveNum(value: number) {
        this._prop2GiveNum = value;
    }
    public get prop3GiveNum(): number {
        return this._prop3GiveNum;
    }
    public set prop3GiveNum(value: number) {
        this._prop3GiveNum = value;
    }

    public get prop0Limit(): number {
        return this._prop0Limit;
    }
    public set prop0Limit(value: number) {
        this._prop0Limit = value;
    }
    public get prop1Limit(): number {
        return this._prop1Limit;
    }
    public set prop1Limit(value: number) {
        this._prop1Limit = value;
    }
    public get prop2Limit(): number {
        return this._prop2Limit;
    }
    public set prop2Limit(value: number) {
        this._prop2Limit = value;
    }
    public get prop3Limit(): number {
        return this._prop3Limit;
    }
    public set prop3Limit(value: number) {
        this._prop3Limit = value;
    }

    public get prop0ClaimCount(): number {
        return this._prop0ClaimCount;
    }
    public set prop0ClaimCount(value: number) {
        this._prop0ClaimCount = value;
        StorageBox.save(STORAGE.PROP0_CLAIM_COUNT, this._prop0ClaimCount.toString());
    }

    public get prop1ClaimCount(): number {
        return this._prop1ClaimCount;
    }
    public set prop1ClaimCount(value: number) {
        this._prop1ClaimCount = value;
        StorageBox.save(STORAGE.PROP1_CLAIM_COUNT, this._prop1ClaimCount.toString());
    }

    public get prop2ClaimCount(): number {
        return this._prop2ClaimCount;
    }
    public set prop2ClaimCount(value: number) {
        this._prop2ClaimCount = value;
        StorageBox.save(STORAGE.PROP2_CLAIM_COUNT, this._prop2ClaimCount.toString());
    }

    public get prop3ClaimCount(): number {
        return this._prop3ClaimCount;
    }
    public set prop3ClaimCount(value: number) {
        this._prop3ClaimCount = value;
        StorageBox.save(STORAGE.PROP3_CLAIM_COUNT, this._prop3ClaimCount.toString());
    }
}


