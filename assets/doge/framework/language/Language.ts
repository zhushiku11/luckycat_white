import { assetManager, EventTarget, SpriteFrame } from 'cc';
import { AssetsDB } from '../common/AssetsDB';
import { currencyNameImagesTable, currencyNameWordsTable, langImagesTable, langWordsTable } from './LanguageConfig';
import { RES_PATH } from 'db://assets/sub_game0/constant/Constant';
import { EDITOR } from 'cc/env';

const EventEmitter: EventTarget = new EventTarget();

// 语言类型枚举
export enum LanguageType {
    NONE = 0, // 无
    EN = 1, // 英语
    ID = 2, // 印尼语
    PT = 3, // 葡萄牙语（巴西）
    RU = 4, // 俄语
    KO = 5, // 韩语
    ES = 6, // 西班牙语（美国）
    IN = 7, // 印地语（印度）
    JP = 8, // 日语（日本）
    DE = 9, // 德语（德国）
    FR = 10, // 法语（法国）
    VN = 11, // 越南语
}
// 货币类型枚举
export enum CurrencyType {
    NONE = 0, // 无
    ID = 1, // 印度尼西亚
    BR = 2, // 巴西
    PH = 3, // 菲律宾
    US = 4, // 美国
    GB = 5, // 英国
    ZA = 6, // 南非
    NG = 7, // 尼日利亚
    IN = 8, // 印度
    MX = 9, // 墨西哥
    AR = 10, // 阿根廷
    CO = 11, // 哥伦比亚
    RU = 12, // 俄罗斯
    JP = 13, // 日本  
    KR = 14, // 韩国
    CA = 15, // 加拿大
    DE = 16, // 德国
    FR = 17, // 法国
    AU = 18, // 澳大利亚
    VN = 19, // 越南
}
// 替换模式（0语言类型 1货币类型）
export enum ReplaceModel {
    CURRENCY = 0,
    LANGUAGE = 1
}

// 语言支持列表
const LanguageSupportList = [LanguageType.PT, LanguageType.EN, LanguageType.ES];
// 货币支持列表
const CurrencySupportList = [CurrencyType.BR, CurrencyType.US];

type Table = { [key: string]: { [key: string]: string } };

export const EVENT_RESET_LANGUAGE = "__reset_language__";

export class Language {
    // 动态变量池
    private static variablePool = new Map<string, string>();
    // 当前语言类型
    public static language: LanguageType = LanguageSupportList[0];
    // 当前货币类型
    public static currency: CurrencyType = CurrencySupportList[0];
    // 是否初始化
    public static isInit: boolean = false;
    // 默认配置
    private static words: { [key: string]: { [key: string]: string } } = langWordsTable;
    private static images: { [key: string]: { [key: string]: string } } = langImagesTable;
    private static currencyWords: { [key: string]: { [key: string]: string } } = currencyNameWordsTable;
    private static currencyImages: { [key: string]: { [key: string]: string } } = currencyNameImagesTable;

    /**
     * 初始化
     *
     * @static
     * @param {string} clientLanguage 语言
     * @param {number} clientCurrency 货币
     * @memberof Language
     */
    public static init(clientLanguage: string, clientCurrency: number) {
        this.language = Language.toLanguage(clientLanguage);
        this.currency = Language.toCurrency(clientCurrency);
        Language.updVariable("currSym", Language.getCurrSym());
        console.warn(`Language is ${LanguageType[this.language]} = ${this.language}`);
        console.warn(`Currency is ${CurrencyType[this.currency]} = ${this.currency}`);
        this.isInit = true;
    }

    // 配置
    public static config(wordsTable: Table, imagesTable: Table, wordsTable1: Table, imagesTable1: Table) {
        Language.words = wordsTable;
        Language.images = imagesTable;
        Language.currencyWords = wordsTable1;
        Language.currencyImages = imagesTable1;
    }

    /**
     * 重置语言&货币
     *
     * @static
     * @param {string} clientLanguage
     * @param {number} clientCurrency
     * @memberof Language
     */
    public static resetLanguage(clientLanguage: string, clientCurrency: number) {
        this.init(clientLanguage, clientCurrency);
        Language.emit(EVENT_RESET_LANGUAGE);
    }

    public static getLanguage() {
        return this.language;
    }

    public static getCurrency() {
        return this.currency;
    }

    public static getLanguageName() {
        return LanguageType[this.language];
    }

    public static getCurrencyName() {
        return CurrencyType[this.currency];
    }

    public static getLanguageWord(key: string) {
        return Language.words[Language.getLanguageName()][key];
    }

    public static getCurrencyWord(key: string) {
        return Language.currencyWords[Language.getCurrencyName()][key];
    }

    public static getLanguageImage(key: string) {
        return Language.images[Language.getLanguageName()][key];
    }

    public static getCurrencyImage(key: string) {
        return Language.currencyImages[Language.getCurrencyName()][key];
    }

    /**
     * 定义动态变量
     *
     * @static
     * @param {string} varName
     * @param {string} value
     * @memberof Language
     */
    public static defVariable(varName: string, value: string) {
        let variable = `@${varName}`;
        Language.variablePool.set(variable, value);
    }

    /**
     * 更新动态变量
     *
     * @static
     * @param {string} varName
     * @param {string} value
     * @memberof Language
     */
    public static updVariable(varName: string, value: string) {
        let variable = `@${varName}`;
        Language.variablePool.set(variable, value);
        Language.emit(variable, value);
    }

    public static getWord(key: string, ...args: string[]): string {
        if (!key || key == "") {
            return "";
        }

        let word = Language.getLanguageWord(key);

        if (!word) {
            return "NULL";
        }

        if (args.length <= 0) {
            return word;
        }

        for (let i = 0; i < args.length; i++) {
            word = Language.replace(word, i, args[i]);
        }
        return word;
    }

    public static getWordByCurrency(key: string, ...args: string[]): string {
        if (!key || key == "") {
            return "";
        }

        let word = Language.getCurrencyWord(key);

        if (!word) {
            return "NULL";
        }

        if (args.length <= 0) {
            return word;
        }

        for (let i = 0; i < args.length; i++) {
            word = Language.replace(word, i, args[i]);
        }
        return word;
    }

    public static async getImage(key: string, bundle: string = undefined): Promise<SpriteFrame> {
        if (!key || key == "") {
            return null;
        }

        if (EDITOR) {
            return this.getImageForLocal(key, bundle);
        } else {
            let path = Language.getLanguageImage(key);

            if (!path) {
                return null;
            }

            let sp = AssetsDB.get<SpriteFrame>(path, bundle);

            if (!sp) {
                await AssetsDB.load([path], SpriteFrame, () => { }, bundle);
            }

            return AssetsDB.get<SpriteFrame>(path, bundle);
        }
    }

    public static async getImageByCurrency(key: string, bundle: string = undefined): Promise<SpriteFrame> {
        if (!key || key == "") {
            return null;
        }

        if (EDITOR) {
            return this.getImageByCurrencyForLocal(key, bundle);
        } else {
            let path = Language.getCurrencyImage(key);

            if (!path) {
                return null;
            }

            let sp = AssetsDB.get<SpriteFrame>(path, bundle);

            if (!sp) {
                await AssetsDB.load([path], SpriteFrame, () => { }, bundle);
            }

            return AssetsDB.get<SpriteFrame>(path, bundle);
        }
    }

    private static async getImageForLocal(key: string, bundle: string): Promise<SpriteFrame> {
        if (!EDITOR) {
            return;
        }

        let bundlePath = null;
        if (bundle) {
            bundlePath = `db://assets${RES_PATH[bundle]}`;
        } else {
            bundlePath = `db://assets/resources`;
        }
        // 去除spriteFrame后缀
        let imagePath = `${Language.getLanguageImage(key)}?`.replace("/spriteFrame?", "");
        // 拼合绝对路径
        const absolutePath = `${bundlePath}/${imagePath}.png`;
        console.log(absolutePath);
        // 查询UUID
        const uuid = await Editor.Message.request("asset-db", "query-uuid", absolutePath) + "@f9941";
        // 加载SpriteFrame
        return new Promise<SpriteFrame>((resolve: Function, reject: Function) => {
            assetManager.loadAny({ uuid: uuid }, (err, spriteFrame) => {
                err ? resolve(null) : resolve(spriteFrame);
            })
        })
    }

    private static async getImageByCurrencyForLocal(key: string, bundle: string): Promise<SpriteFrame> {
        if (!EDITOR) {
            return;
        }

        let bundlePath = null;
        if (bundle) {
            bundlePath = `db://assets${RES_PATH[bundle]}`;
        } else {
            bundlePath = `db://assets/resources`;
        }
        // 去除spriteFrame后缀
        let imagePath = `${Language.getCurrencyImage(key)}?`.replace("/spriteFrame?", "");
        // 拼合绝对路径
        let absolutePath = `${bundlePath}/${imagePath}.png`;
        // 查询UUID
        const uuid = await Editor.Message.request("asset-db", "query-uuid", absolutePath) + "@f9941";
        // 加载SpriteFrame
        return new Promise<SpriteFrame>((resolve, reject) => {
            assetManager.loadAny({ uuid: uuid }, (err, spriteFrame) => {
                err ? resolve(null) : resolve(spriteFrame);
            })
        })
    }

    /**
     * 获取货币符号
     *
     * @static
     * @return {*}  {string}
     * @memberof Language
     */
    public static getCurrSym(): string {
        switch (Language.currency) {
            case CurrencyType.ID:
                return "Rp";
            case CurrencyType.BR:
                return "R$";
            case CurrencyType.PH:
                return "₱";
            case CurrencyType.US:
                return "$";
            case CurrencyType.GB:
                return "£";
            case CurrencyType.ZA:
                return "R";
            case CurrencyType.NG:
                return "₦";
            case CurrencyType.IN:
                return "₹";
            case CurrencyType.MX:
                return "Mex$";
            case CurrencyType.AR:
                return "ARS$";
            case CurrencyType.CO:
                return "COP$";
            case CurrencyType.RU:
                return "₽";
            case CurrencyType.JP:
                return "¥";
            case CurrencyType.KR:
                return "₩";
            case CurrencyType.CA:
                return "$";
            case CurrencyType.DE:
                return "€";
            case CurrencyType.FR:
                return "€";
            case CurrencyType.AU:
                return "$";
            case CurrencyType.VN:
                return "₫";
        }
    }

    public static getEventEmiter(): EventTarget {
        return EventEmitter;
    }

    public static on<TFunction extends (...any: any[]) => void>(value: string, callback: TFunction, thisArg?: any, once?: boolean) {
        if (Language.isVariable(value)) {
            Language.getEventEmiter().on(value, callback, thisArg, once);
        } else {
            console.error(`${value} not a Variable, can't listen`)
        }
    }

    public static off<TFunction extends (...any: any[]) => void>(value: string, callback: TFunction, thisArg?: any) {
        if (Language.isVariable(value)) {
            Language.getEventEmiter().off(value, callback, thisArg);
        } else {
            console.error(`${value} not a Variable, can't unlisten`)
        }
    }

    public static emit(type: string, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any) {
        Language.getEventEmiter().emit(type, arg0, arg1, arg2, arg3, arg4);
    }

    public static getVariable(varName: string): string {
        let value = Language.variablePool.get(varName);
        if (value || value == "") {
            return value
        } else {
            return null;
        }
    }

    public static isVariable(varName: string): boolean {
        return varName.charAt(0) == "@";
    }

    private static toLanguage(language: string) {
        let country: LanguageType = null;
        switch (language) {
            case "pt_br":
            case "es_br":
            case "pt":
                country = LanguageType.PT;
                break;
            case "ru_ru":
            case "ru":
                country = LanguageType.RU;
                break;
            case "en":
            case "us":
                country = LanguageType.EN;
                break;
            case "in":
            case "in-rID":
                country = LanguageType.ID;
                break;
            case "ko":
                country = LanguageType.KO;
                break;
            case "hi":
                country = LanguageType.IN;
                break;
            case "ja":
                country = LanguageType.JP;
                break;
            case "de":
                country = LanguageType.DE;
                break;
            case "fr":
                country = LanguageType.FR;
                break;
            case "es":
                country = LanguageType.ES;
                break;
            case "vi":
                country = LanguageType.VN;
                break;
            default:
                country = LanguageType.EN;
                break;
        }

        if (LanguageSupportList.length != 0 && !LanguageSupportList.includes(country)) {
            // 不支持 回到默认
            country = LanguageSupportList[0];
        }

        return country;
    }

    private static toCurrency(currencyType: number) {
        let currency: CurrencyType = null;
        switch (currencyType) {
            case CurrencyType.ID:
                currency = CurrencyType.ID;
                break;
            case CurrencyType.BR:
                currency = CurrencyType.BR;
                break;
            case CurrencyType.PH:
                currency = CurrencyType.PH;
                break;
            case CurrencyType.US:
                currency = CurrencyType.US;
                break;
            case CurrencyType.GB:
                currency = CurrencyType.GB;
                break;
            case CurrencyType.ZA:
                currency = CurrencyType.ZA;
                break;
            case CurrencyType.NG:
                currency = CurrencyType.NG;
                break;
            case CurrencyType.IN:
                currency = CurrencyType.IN;
                break;
            case CurrencyType.MX:
                currency = CurrencyType.MX;
                break;
            case CurrencyType.AR:
                currency = CurrencyType.AR;
                break;
            case CurrencyType.CO:
                currency = CurrencyType.CO;
                break;
            case CurrencyType.RU:
                currency = CurrencyType.RU;
                break;
            case CurrencyType.JP:
                currency = CurrencyType.JP;
                break;
            case CurrencyType.KR:
                currency = CurrencyType.KR;
                break;
            case CurrencyType.CA:
                currency = CurrencyType.CA;
                break;
            case CurrencyType.DE:
                currency = CurrencyType.DE;
                break;
            case CurrencyType.FR:
                currency = CurrencyType.FR;
                break;
            case CurrencyType.AU:
                currency = CurrencyType.AU;
                break;
            case CurrencyType.VN:
                currency = CurrencyType.VN;
                break;
            default:
                currency = CurrencyType.US;
                break;
        }
        if (CurrencySupportList.length != 0 && !CurrencySupportList.includes(currency)) {
            // 不支持 回到默认
            currency = CurrencySupportList[0];
        }
        return currency;
    }

    private static replace(word: string, idx: number, arg: string): string {
        arg = arg || "";
        if (Language.isVariable(arg)) {
            // 动态变量类型
            let value = Language.getVariable(arg);
            return value ? word.replace(`{${idx}}`, value) : word;
        } else {
            // 值类型
            return word.replace(`{${idx}}`, arg);
        }
    }
}