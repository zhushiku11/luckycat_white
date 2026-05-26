import { native, sys } from "cc";
import AudioTools from "../doge/framework/common/AudioTools";
import { getEventEmiter } from "../doge/framework/common/EventEmitter";
import { MAIN } from "../main/constant/Constant";

const JAVA_CLASS = "com/aqwad/jackpot/au/a/MariachiJackpot";

export enum AD_TYPE {
    NONE = 0,
    VIDEO = 1,
    INTER = 2,
}

export enum REWARD_TYPE {
    REWARD = 0,
    TASK = 1,
    NONE = 2,
    DELAY_REWARD = 10,
}

export enum AD_RESULT {
    SUCCESS = 0,
    FAIL = 1,
    CANCEL = 2,
}

class NI_Android implements INativeInterface {
    syncUser(): UserInfoResult {
        console.log("JAVA_CLASS", JAVA_CLASS, "syncUser", "()Ljava/lang/String;");
        return JSON.parse(native.reflection.callStaticMethod(JAVA_CLASS, "syncUser", "()Ljava/lang/String;"));
    };
    syncGameData(): GameDataResult {
        console.log("JAVA_CLASS", JAVA_CLASS, "syncGameData", "()Ljava/lang/String;");
        return JSON.parse(native.reflection.callStaticMethod(JAVA_CLASS, "syncGameData", "()Ljava/lang/String;"));
    };

    playAd(callback: AdCallback, resultFunc: string, adType: number, rewardType: number, taskId: number) {
        console.log("JAVA_CLASS", JAVA_CLASS, "playAd", "(Ljava/lang/String;III)V", resultFunc, adType, rewardType, taskId);
        native.reflection.callStaticMethod(JAVA_CLASS, "playAd", "(Ljava/lang/String;III)V", resultFunc, adType, rewardType, taskId);
    };
    playWithdraw(callback: WithdrawCallback, resultFunc: string) {
        console.log("JAVA_CLASS", JAVA_CLASS, "playWithdraw", "(Ljava/lang/String;)V", resultFunc);
        native.reflection.callStaticMethod(JAVA_CLASS, "playWithdraw", "(Ljava/lang/String;)V", resultFunc);
    };
    playWithdrawInfo(callback: WithdrawInfoCallback, resultFunc: string, amount: number) {
        console.log("JAVA_CLASS", JAVA_CLASS, "playWithdrawInfo", "(Ljava/lang/String;F)V", resultFunc, amount);
        native.reflection.callStaticMethod(JAVA_CLASS, "playWithdrawInfo", "(Ljava/lang/String;F)V", resultFunc, amount);
    };
    playWithdrawInfoTask(callback: WithdrawInfoCallback, resultFunc: string, amount: number, taskId: number) {
        console.log("JAVA_CLASS", JAVA_CLASS, "playWithdrawInfoTask", "(Ljava/lang/String;FI)V", resultFunc, amount, taskId);
        native.reflection.callStaticMethod(JAVA_CLASS, "playWithdrawInfoTask", "(Ljava/lang/String;FI)V", resultFunc, amount, taskId);
    };
    playWithdrawRecord() {
        console.log("JAVA_CLASS", JAVA_CLASS, "playWithdrawRecord", "()V");
        native.reflection.callStaticMethod(JAVA_CLASS, "playWithdrawRecord", "()V");
    };
    playWithdrawFAQ() {
        console.log("JAVA_CLASS", JAVA_CLASS, "playWithdrawFAQ", "()V");
        native.reflection.callStaticMethod(JAVA_CLASS, "playWithdrawFAQ", "()V");
    };
    currentPage(code: number) {
        console.log("JAVA_CLASS", JAVA_CLASS, "currentPage", "(I)V", code);
        native.reflection.callStaticMethod(JAVA_CLASS, "currentPage", "(I)V", code);
    };
    uploadReport(callback: SuccessCallback, resultFunc: string, eventName: string, eventExt: string, pageName: string) {
        console.log("JAVA_CLASS", JAVA_CLASS, "uploadReport", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V");
        native.reflection.callStaticMethod(JAVA_CLASS, "uploadReport", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", resultFunc, eventName, eventExt, pageName);
    };
}

class NI_Default implements INativeInterface {
    syncUser(): UserInfoResult {
        return {
            p0: "82037343340206231552",
            p1: "unknow1",
            p2: "marjackpot",
            p3: true,
            p4: "en",
            p5: 4,
            p6: true,
            p7: "1.0.0",
        };
    };
    syncGameData(): GameDataResult {
        return {
            m0: 88.88,
            m1: 0.5,
            m2: 0,
            m3: 0,
            m4: 3630,
            rate: 0.7,
        };
    };
    playAd(callback: AdCallback, resultFunc: string, adType: number, rewardType: number, taskId: number) {
        let rewardNum = 1000;
        switch (rewardType) {
            case REWARD_TYPE.NONE:
                NI.func(resultFunc, JSON.stringify({
                    errCode: AD_RESULT.SUCCESS,
                    adType: adType,
                    rewardB: 0,
                    currentB: 888,
                    currentB1: 8.88,
                    rate: 0.66,
                }))
                break;
            case REWARD_TYPE.REWARD:
                NI.func(resultFunc, JSON.stringify({
                    errCode: AD_RESULT.SUCCESS,
                    adType: adType,
                    rewardB: rewardNum,
                    currentB: 888,
                    currentB1: 8.88,
                    rate: 0.66,
                }))
                break;
            case REWARD_TYPE.TASK:
                NI.func(resultFunc, JSON.stringify({
                    errCode: AD_RESULT.SUCCESS,
                    adType: adType,
                    rewardB: rewardNum,
                    currentB: 888,
                    currentB1: 8.88,
                    rate: 0.66,
                }))
                break;
        }

    };
    playWithdraw(callback: WithdrawCallback, resultFunc: string) {
        console.log("Withdraw open")
        NI.func(resultFunc, JSON.stringify({
            isWithdraw: 1,
            bal: 0,
            bal1: 0,
        }))
    };

    playWithdrawInfo(callback: WithdrawInfoCallback, resultFunc: string, amount: number) {
        console.log("WithdrawInfo open")
        NI.func(resultFunc, JSON.stringify({
            isWithdraw: 1,
            amount: amount,
        }))
    };

    playWithdrawInfoTask(callback: WithdrawInfoCallback, resultFunc: string, amount: number, taskId: number) {
        console.log("WithdrawInfo open")
        NI.func(resultFunc, JSON.stringify({
            isWithdraw: 1,
            amount: amount,
        }))
    };

    playWithdrawRecord() {
        console.log("playWithdrawRecord");
    };

    playWithdrawFAQ() {
        console.log("playWithdrawFAQ");
    };

    currentPage(code: number) {
        console.log("currentPage", code);
    };

    uploadReport(callback: SuccessCallback, resultFunc: string, eventName: string, eventExt: string, pageName: string) { };
}

export class NI {
    public static version: any = null;

    private static pool: Map<string, Function> = new Map<string, Function>();

    private static callbackID: number = 0;

    private static _ins: INativeInterface = null;
    public static get I(): INativeInterface {
        if (!NI._ins) {
            if (sys.os == sys.OS.ANDROID) {
                NI._ins = new NI_Android();
            } else {
                NI._ins = new NI_Default();
            }
        }
        return NI._ins;
    }

    private static setCallback(key: string, callback: Function) {
        NI.pool.set(key, callback);
    }

    private static getCallback(key: string): Function {
        return NI.pool.get(key);
    }

    private static deleteCallback(key: string) {
        NI.pool.delete(key);
    }

    private static getCallbackName(name: string): string {
        return name + NI.callbackID++;
    }

    /**
     * 获取系统信息
     *
     * @static
     * @return {*}  {string}
     * @memberof NativeSDK
     */
    public static syncUser(): UserInfoResult {
        return NI.I?.syncUser();
    }

    /**
     * 获取游戏数据
     *
     * @static
     * @return {*}  {string}
     * @memberof NativeSDK
     */
    public static syncGameData(): GameDataResult {
        return NI.I?.syncGameData();
    }

    /**
     * 拉起广告
     *
     * @static
     * @param {AdCallback} adCallback
     * @param {number} adType 0:无广告 1:视频广告 2:全屏广告
     * @param {number} rewardType 0:广告奖励 1:少量奖励
     * @memberof NI
     */
    public static playAd(adCallback: AdCallback, adType: number, rewardType: number, taskId: number) {
        let cbName = NI.getCallbackName("playAdEnd");
        if (adType != 0) {
            console.log("play Ad, Audio pause");
            AudioTools.pause();
        }
        NI.setCallback(cbName, (data: any) => {
            if (adType != 0) {
                AudioTools.resume();
                console.log("play Ad end, Audio resume");
            }
            adCallback(data.errCode, data.adType, { rewardB: data.rewardB, currentB: data.currentB, currentB1: data.currentB1, rate: data.rate });
        });
        NI.I?.playAd(adCallback, cbName, adType, rewardType, taskId);
    }

    /**
     * 打开提现页面
     *
     * @static
     * @param {WithdrawCallback} callback
     * @memberof NI
     */
    public static playWithdraw(callback: WithdrawCallback) {
        let cbName = NI.getCallbackName("playWithdrawEnd");
        NI.setCallback(cbName, (data: any) => {
            callback(data.isWithdraw, data.bal, data.bal1);
        });
        NI.I?.playWithdraw(callback, cbName);
    };

    /**
     * 打开金币提现信息页面
     *
     * @static
     * @param {WithdrawInfoCallback} callback
     * @param {number} amount 提现金额
     * @memberof NI
     */
    public static playWithdrawInfo(callback: WithdrawInfoCallback, amount: number) {
        let cbName = NI.getCallbackName("playWithdrawInfoEnd");
        NI.setCallback(cbName, (data: any) => {
            callback(data.isWithdraw, data.amount);
        });
        NI.I?.playWithdrawInfo(callback, cbName, amount);
    };

    /**
     * 打开任务提现信息页面
     *
     * @static
     * @param {WithdrawInfoCallback} callback
     * @param {number} amount 提现金额
     * @param {number} taskId 任务ID
     * @memberof NI
     */
    public static playWithdrawInfoTask(callback: WithdrawInfoCallback, amount: number, taskId: number) {
        let cbName = NI.getCallbackName("playWithdrawInfoTaskEnd");
        NI.setCallback(cbName, (data: any) => {
            callback(data.isWithdraw, data.amount);
        });
        NI.I?.playWithdrawInfoTask(callback, cbName, amount, taskId);
    };

    /**
     * 打开提现记录页面
     *
     * @static
     */
    public static playWithdrawRecord() {
        NI.I?.playWithdrawRecord();
    };

    /**
     * 打开FAQ页面
     *
     * @static
     */
    public static playWithdrawFAQ() {
        NI.I?.playWithdrawFAQ();
    };

    /**
     * 退出
     *
     * @static
     */
    public static currentPage(code: number) {
        NI.I?.currentPage(code);
    }

    /**
     * 埋点
     *
     * @static
     * @memberof NativeSDK
     */
    public static uploadReport(callback: SuccessCallback, eventName: string, eventExt: string, pageName: string): void {
        let cbName = NI.getCallbackName("uploadReportEnd");
        NI.setCallback(cbName, (data: any) => {
            callback(data.isSuccessful);
        });
        NI.I?.uploadReport(callback, cbName, eventName, eventExt, pageName);
    }

    /**
     * 执行回调
     *
     * @static
     * @param {string} callbackName 回调名称
     * @param {string} data 回调数据（json字符串）
     * @memberof NativeSDK
     */
    public static func(callbackName: string, data: string) {
        console.log("Android->JS callback: ", callbackName);
        console.log("Android->JS data: ", data);
        let callback = NI.getCallback(callbackName);
        if (callback) {
            NI.deleteCallback(callbackName);
            let obj = {};
            data = data || "{}";
            try {
                data.replace(/\u0000|\u0001|\u0002|\u0003|\u0004|\u0005|\u0006|\u0007|\u0008|\u0009|\u000a|\u000b|\u000c|\u000d|\u000e|\u000f|\u0010|\u0011|\u0012|\u0013|\u0014|\u0015|\u0016|\u0017|\u0018|\u0019|\u001a|\u001b|\u001c|\u001d|\u001e|\u001f|\u007F/g, "");
                obj = JSON.parse(data);
                console.log("Android->JS data obj: ", obj);
            } catch (error) {
                console.log("Android->JS data parse error: is not json string");
            }
            obj && callback(obj);
        } else {
            console.log("Android->JS callback: Not found callback ：", callbackName);
        }
    }

    public static mobileBack() {
        getEventEmiter().emit(MAIN.FUNC.MOBILE_BACK);
    }
}

//@ts-ignore
window.NI = NI;


