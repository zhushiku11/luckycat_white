import { StorageBox } from "db://assets/doge/framework/common/StorageBox";
import { Language } from "db://assets/doge/framework/language/Language";
import { SLOT_CONDITION } from "../../constant/Constant";


export class SlotGameSystem {
    private static _instance = null;
    public static get I(): SlotGameSystem {
        if (!SlotGameSystem._instance) {
            SlotGameSystem._instance = new SlotGameSystem();
        }
        return SlotGameSystem._instance;
    }

    private vo: SlotGameSystemVO = new SlotGameSystemVO();

    init() {
        this.vo.slotGameTimes = parseInt(StorageBox.load("SLOT_GAME_TIEMS", "0"));
    }

    getSlotGameTimes() {
        return this.vo.slotGameTimes;
    }

    addSlotGameTimes(times: number = 1) {
        if (this.vo.slotGameTimes >= SLOT_CONDITION) {
            return;
        }
        let value = this.vo.slotGameTimes + times;
        if (value >= SLOT_CONDITION) {
            value = SLOT_CONDITION;
        }
        this.vo.slotGameTimes = value;
    }

    clearSlotGameTimes() {
        this.vo.slotGameTimes = 0;
    }
}

class SlotGameSystemVO {
    // slot游戏次数
    private _slotGameTimes: number = 0;

    public get slotGameTimes(): number {
        return this._slotGameTimes;
    }

    public set slotGameTimes(value: number) {
        this._slotGameTimes = value;
        Language.updVariable("slotgame", this._slotGameTimes.toString());
        StorageBox.save("SLOT_GAME_TIEMS", this._slotGameTimes.toString());
    }
}
