import Crypto from "./Crypto";

export class StorageBox {

    private static flag: string = "";
    private static globalFlag: string = "";

    public static init(flag: string) {
        this.flag = flag;
    }

    public static initGlobal(globalFlag: string) {
        this.globalFlag = globalFlag;
    }

    public static save(key: string, value: string, isEncrypt: boolean = false) {
        // key = Crypto.MD5(`${this.globalFlag}_${this.flag}_${key}`);
        value = isEncrypt ? Crypto.encryptXXTEA(value) : value;
        localStorage.setItem(key, value);
    }

    public static load(key: string, defaultValue: string, isDecrypt: boolean = false): string {
        // key = Crypto.MD5(`${this.globalFlag}_${this.flag}_${key}`);
        let ret = localStorage.getItem(key);
        if (ret) {
            return isDecrypt ? Crypto.decryptXXTEA(ret) : ret;
        } else {
            return defaultValue;
        }
    }

    public static saveGlobal(key: string, value: string, isEncrypt: boolean = false) {
        // key = Crypto.MD5(this.globalFlag + "_" + key);
        value = isEncrypt ? Crypto.encryptXXTEA(value) : value;
        localStorage.setItem(key, value);
    }

    public static loadGlobal(key: string, defaultValue: string, isDecrypt: boolean = false): string {
        // key = Crypto.MD5(this.globalFlag + "_" + key);
        let ret = localStorage.getItem(key);
        if (ret) {
            return isDecrypt ? Crypto.decryptXXTEA(ret) : ret;
        } else {
            return defaultValue;
        }
    }
}

