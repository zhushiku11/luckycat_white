import { CurrencyType, Language } from "../language/Language";
import { getEventEmiter } from "./EventEmitter";
import FloatCalc from "./FloatCalc";
import { StorageBox } from "./StorageBox";

type CurrencyFormatOpt = {
    separator?: string,
    decimal?: number
    decimalSymbol?: string,
}

// 货币初始化
export class Currency {
    public static init(amoney: number, bmoney: number, bmoney1: number, cmoney: number) {
        AMoney.init(amoney);
        BMoney.init(bmoney, bmoney1);
        ACoins.init();
    }

    public static format(num: number, opt: CurrencyFormatOpt = { separator: "," }): string {
        opt.separator = (opt.separator || opt.separator == "") ? opt.separator : ",";
        opt.decimalSymbol = opt.decimalSymbol || ".";
        let decimal = opt.decimal || 0;
        // let numStr = num.toFixed(decimal);
        let exponent = Math.pow(10, decimal);
        let numStr = (FloatCalc.div(Math.floor(FloatCalc.mul(num, exponent)), exponent)).toString();
        let numArr = numStr.split(".");
        let integerNum = numArr[0];
        let decimalNum = numArr[1];

        if (integerNum) {
            integerNum = `${integerNum}.`.replace(/\d(?=(\d{3})+\.)/g, `$&${opt.separator}`).slice(0, -1);
        }

        if (decimalNum) {
            return `${integerNum}${opt.decimalSymbol}${decimalNum}`;
        } else {
            return integerNum;
        }
    }

    public static integer(moneyNum: number) {
        switch (Language.currency) {
            case CurrencyType.JP:
            case CurrencyType.KR:
            case CurrencyType.NG:
            case CurrencyType.PH:
            case CurrencyType.IN:
            case CurrencyType.US:
            case CurrencyType.GB:
            case CurrencyType.ZA:
            case CurrencyType.MX:
            case CurrencyType.CA:
            case CurrencyType.AU:
            case CurrencyType.ID:
            case CurrencyType.AR:
            case CurrencyType.CO:
            case CurrencyType.DE:
            case CurrencyType.RU:
            case CurrencyType.FR:
            case CurrencyType.VN:
            case CurrencyType.BR:
                return Currency.format(moneyNum, { separator: "", decimal: 2 });
        }
    }

    public static decimalMoney(moneyNum: number) {
        switch (Language.currency) {
            case CurrencyType.JP:
            case CurrencyType.KR:
            case CurrencyType.NG:
                return Currency.format(moneyNum, { separator: ",", decimal: 0 });
            case CurrencyType.PH:
            case CurrencyType.IN:
                return Currency.format(moneyNum, { separator: ",", decimal: 1 });
            case CurrencyType.US:
            case CurrencyType.GB:
            case CurrencyType.ZA:
            case CurrencyType.MX:
            case CurrencyType.CA:
            case CurrencyType.AU:
                return Currency.format(moneyNum, { separator: ",", decimal: 2 });
            case CurrencyType.ID:
            case CurrencyType.AR:
            case CurrencyType.CO:
            case CurrencyType.VN:
                return Currency.format(moneyNum, { separator: ".", decimalSymbol: ",", decimal: 0, });
            case CurrencyType.BR:
            case CurrencyType.DE:
                return Currency.format(moneyNum, { separator: ".", decimalSymbol: ",", decimal: 2 });
            case CurrencyType.RU:
            case CurrencyType.FR:
                return Currency.format(moneyNum, { separator: " ", decimalSymbol: ",", decimal: 2 });
        }
    }

    public static integerMoney(moneyNum: number) {
        switch (Language.currency) {
            case CurrencyType.JP:
            case CurrencyType.KR:
            case CurrencyType.NG:
                return Currency.format(moneyNum, { separator: ",", decimal: 0 });
            case CurrencyType.PH:
            case CurrencyType.IN:
                return Currency.format(moneyNum, { separator: ",", decimal: 0 });
            case CurrencyType.US:
            case CurrencyType.GB:
            case CurrencyType.ZA:
            case CurrencyType.MX:
            case CurrencyType.CA:
            case CurrencyType.AU:
                return Currency.format(moneyNum, { separator: ",", decimal: 0 });
            case CurrencyType.ID:
            case CurrencyType.AR:
            case CurrencyType.CO:
            case CurrencyType.VN:
                return Currency.format(moneyNum, { separator: ".", decimalSymbol: ",", decimal: 0, });
            case CurrencyType.BR:
            case CurrencyType.DE:
                return Currency.format(moneyNum, { separator: ".", decimalSymbol: ",", decimal: 0 });
            case CurrencyType.RU:
            case CurrencyType.FR:
                return Currency.format(moneyNum, { separator: " ", decimalSymbol: ",", decimal: 0 });
        }
    }
}

// 提现货币1（现金）
export class AMoney {
    public static readonly KEY: string = "AMoney";

    private static _Value: number = 0;

    public static init(amoney: number) {
        AMoney.set(amoney);
        AMoney.refresh();
    }

    // 设置值
    public static set(num: number) {
        let count = num;
        if (count < 0) {
            count = 0;
        }
        AMoney._Value = count;
        AMoney.save();
    }

    // 增加数量 负数减少
    public static add(num: number) {
        let curr = AMoney._Value;
        let count = AMoney._Value + num;
        if (count < 0) {
            count = 0;
        }
        this.set(count);
        if (num >= 0) {
            getEventEmiter().emit("AddAMoney", curr, count);
        }
    }

    // 使用
    public static use(num: number) {
        this.add(-Math.abs(num));
        this.refresh();
    }

    // 给予
    public static give(num: number) {
        this.add(Math.abs(num));
        this.refresh();
    }

    // 刷新显示
    public static refresh() {
        Language.updVariable("AMoney", AMoney.string());
    }

    // 保存
    public static save() {
        StorageBox.save(AMoney.KEY, `${AMoney.value()}`);
    }

    // 字符串值
    public static string(num?: number): string {
        let moneyNum = (num || num == 0) ? num : AMoney.value();
        return Currency.decimalMoney(moneyNum);
    }

    // 原始值
    public static value(): number {
        return AMoney._Value;
    }

    // 是否足够
    public static isEnough(num: number = 0) {
        return AMoney.value() >= num;
    }
}

// 提现货币2（金币）
export class BMoney {

    private static _Value: number = 0;
    private static _Value1: number = 0;

    public static init(bmoney: number, bmoney1: number) {
        BMoney.set(bmoney, bmoney1);
        BMoney.refresh();
    }

    // 设置值
    public static set(num: number, num1: number) {
        let count = num;
        if (count < 0) {
            count = 0;
        }
        BMoney._Value = count;
        BMoney._Value1 = num1;
    }

    // 增加数量 负数减少
    public static add(num: number) {
        let count = BMoney._Value + num;
        if (count < 0) {
            count = 0;
        }
        BMoney._Value = count;
    }

    // 使用
    public static use(num: number) {
        this.add(-Math.abs(num));
        this.refresh();
    }

    // 给予
    public static give(num: number) {
        this.add(Math.abs(num));
        this.refresh();
    }

    // 刷新显示
    public static refresh() {
        Language.updVariable("BMoney", BMoney.string());
        Language.updVariable("BMoney1", AMoney.string(BMoney._Value1));
    }

    public static string(num?: number): string {
        let moneyNum = num || num == 0 ? num : BMoney.value();
        switch (Language.currency) {
            case CurrencyType.BR:
                return Currency.decimalMoney(moneyNum);
            case CurrencyType.US:
                return Currency.integerMoney(moneyNum);
        }
    }

    // 原始值
    public static value(): number {
        return BMoney._Value;
    }

    public static value1(): number {
        return BMoney._Value1;
    }

    // 是否足够
    public static isEnough(num: number = 0) {
        return BMoney.value() >= num;
    }
}

// 游戏货币1（游戏金币）
export class ACoins {

    public static readonly KEY: string = "ACoins";

    private static _Value: number = 0;

    public static init() {
        ACoins.set(parseInt(StorageBox.load(ACoins.KEY, "0")));
        ACoins.refresh();
    }

    public static format(num: number): string {
        return Math.floor(num).toFixed(0);
    }

    // 设置值
    public static set(num: number) {
        let count = num;
        if (count < 0) {
            count = 0;
        }
        ACoins._Value = count;
        ACoins.save();
    }

    // 增加数量 负数减少
    public static add(num: number) {
        let count = ACoins._Value + num;
        if (count < 0) {
            count = 0;
        }
        ACoins.set(count);
    }

    // 使用
    public static use(num: number) {
        this.add(-Math.abs(num));
        this.refresh();
    }

    // 给予
    public static give(num: number) {
        this.add(Math.abs(num));
        this.refresh();
    }

    // 刷新显示
    public static refresh() {
        Language.updVariable("ACoins", ACoins.string());
    }

    // 保存
    public static save() {
        StorageBox.save(ACoins.KEY, `${ACoins.value()}`);
    }

    public static string(num?: number): string {
        let moneyNum = num || num == 0 ? num : ACoins.value();
        return Currency.decimalMoney(moneyNum);
    }

    // 原始值
    public static value(): number {
        return ACoins._Value;
    }

    // 是否足够
    public static isEnough(num: number = 0) {
        return ACoins.value() >= num;
    }
}