interface INativeInterface {
    syncUser: () => UserInfoResult; // 获取系统信息 初始化获取
    syncGameData: () => GameDataResult; // 获取游戏数据 初始化获取

    playAd: (callback: AdCallback, resultFunc: string, adType: number, rewardType: number, taskId: number) => void; // 展示广告并领取奖励
    playWithdraw: (callback: WithdrawCallback, resultFunc: string) => void; // 打开提现页面
    playWithdrawInfo: (callback: WithdrawInfoCallback, resultFunc: string, amount: number) => void; // 打开金币提现信息页面
    playWithdrawInfoTask: (callback: WithdrawInfoCallback, resultFunc: string, amount: number, taskId: number) => void; // 打开金币提现信息页面
    playWithdrawRecord: () => void; // 打开提现记录页面
    playWithdrawFAQ: () => void; // 打开FQA页面
    currentPage: (code: number) => void; // 退出

    uploadReport: (callback: SuccessCallback, resultFunc: string, eventName: string, eventExt: string, pageName: string) => void; // 事件上报
}

type UserInfoResult = { p0: string, p1: string, p2: string, p3: boolean, p4: string, p5: number, p6: boolean, p7: string };
type GameDataResult = { m0: number, m1: number, m2: number, m3: number, m4: number, rate: number };
type AdResult = { rewardB: number, currentB: number, currentB1: number, rate: number };

type AdCallback = (errCode: number, adType: number, result: AdResult) => void;
type WithdrawCallback = (isWithdraw: number, bal: number, bal1: number) => void;
type WithdrawInfoCallback = (isWithdraw: number, amount: number) => void;
type NicknameCallback = (nickname: string) => void;
type AnonymousCallback = (state: number, nickname: string) => void;
type SuccessCallback = (isSuccessful: number) => void;