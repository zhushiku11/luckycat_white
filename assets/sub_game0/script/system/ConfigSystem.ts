
export type CashWithdrawInfo = {
    adCount: number, // 视频数量
    toDayLevel: number, // 每日关卡
    id: number, // 序号
    loginDay: number, // 累计登录
    level: number, // 已通过关卡数
    price: number // 提现金额
}

export type LevelWithdrawRewardInfo = {
    id: number,
    name: string,
    condition: number,
    reward: number,
}

export class ConfigSystem {

    private static _instance = null;
    public static get I(): ConfigSystem {
        if (!ConfigSystem._instance) {
            ConfigSystem._instance = new ConfigSystem();
        }
        return ConfigSystem._instance;
    }

    // 现金提现档位
    public readonly WithdrawInfo_us: CashWithdrawInfo[] = [
        {
            adCount: 0, // 视频数量
            toDayLevel: 0, // 每日关卡
            id: 0, // 
            loginDay: 0, // 累计登录
            level: 0, // 已通过关卡数
            price: 0.01 // 提现金额
        },
        {
            adCount: 200000, // 视频数量
            toDayLevel: 10, // 每日关卡
            id: 1, // 
            loginDay: 50, // 累计登录
            level: 200, // 已通过关卡数
            price: 1000 // 提现金额
        },
        {
            adCount: 200000, // 视频数量
            toDayLevel: 10, // 每日关卡
            id: 2, // 
            loginDay: 50, // 累计登录
            level: 300, // 已通过关卡数
            price: 2000 // 提现金额
        },
        {
            adCount: 200000, // 视频数量
            toDayLevel: 10, // 每日关卡
            id: 3, // 
            loginDay: 50, // 累计登录
            level: 400, // 已通过关卡数
            price: 5000 // 提现金额
        },
        {
            adCount: 200000, // 视频数量
            toDayLevel: 10, // 每日关卡
            id: 4, // 
            loginDay: 50, // 累计登录
            level: 500, // 已通过关卡数
            price: 10000  // 提现金额
        },
    ];
    public readonly WithdrawInfo_br: CashWithdrawInfo[] = [
        {
            adCount: 0, // 视频数量
            toDayLevel: 0, // 每日关卡
            id: 0, // 
            loginDay: 0, // 累计登录
            level: 0, // 已通过关卡数
            price: 0.01 // 提现金额
        },
        {
            adCount: 200000, // 视频数量
            toDayLevel: 10, // 每日关卡
            id: 1, // 
            loginDay: 50, // 累计登录
            level: 200, // 已通过关卡数
            price: 1000 // 提现金额
        },
        {
            adCount: 200000, // 视频数量
            toDayLevel: 10, // 每日关卡
            id: 2, // 
            loginDay: 50, // 累计登录
            level: 300, // 已通过关卡数
            price: 2000 // 提现金额
        },
        {
            adCount: 200000, // 视频数量
            toDayLevel: 10, // 每日关卡
            id: 3, // 
            loginDay: 50, // 累计登录
            level: 400, // 已通过关卡数
            price: 5000 // 提现金额
        },
        {
            adCount: 200000, // 视频数量
            toDayLevel: 10, // 每日关卡
            id: 4, // 
            loginDay: 50, // 累计登录
            level: 500, // 已通过关卡数
            price: 10000  // 提现金额
        }
    ];
    public readonly WithdrawInfo_id: CashWithdrawInfo[] = [
        {
            adCount: 0, // 视频数量
            toDayLevel: 0, // 每日关卡
            id: 0, // 
            loginDay: 0, // 累计登录
            level: 0, // 已通过关卡数
            price: 20 // 提现金额
        },
        {
            adCount: 200000, // 视频数量
            toDayLevel: 10, // 每日关卡
            id: 1, // 
            loginDay: 50, // 累计登录
            level: 200, // 已通过关卡数
            price: 88000 // 提现金额
        },
        {
            adCount: 200000, // 视频数量
            toDayLevel: 10, // 每日关卡
            id: 2, // 
            loginDay: 50, // 累计登录
            level: 300, // 已通过关卡数
            price: 150000 // 提现金额
        },
        {
            adCount: 200000, // 视频数量
            toDayLevel: 10, // 每日关卡
            id: 3, // 
            loginDay: 50, // 累计登录
            level: 400, // 已通过关卡数
            price: 300000  // 提现金额
        },
        {
            adCount: 200000, // 视频数量
            toDayLevel: 10, // 每日关卡
            id: 4, // 
            loginDay: 50, // 累计登录
            level: 500, // 已通过关卡数
            price: 500000 // 提现金额
        },
        {
            adCount: 200000, // 视频数量
            toDayLevel: 10, // 每日关卡
            id: 5, // 
            loginDay: 50, // 累计登录
            level: 600, // 已通过关卡数
            price: 1000000 // 提现金额
        }
    ];
    // 段位奖励档位
    public readonly LevelWithdrawRewardInfo_us: LevelWithdrawRewardInfo[] = [
        {
            id: 0,
            name: "l_bronze", // 名称
            condition: 5, // 关卡条件
            reward: 300, // 奖励金额
        },
        {
            id: 1,
            name: "l_silver", // 视频数量
            condition: 15, // 关卡条件
            reward: 300, // 奖励金额
        },
        {
            id: 2,
            name: "l_gold", // 视频数量
            condition: 30, // 关卡条件
            reward: 300, // 奖励金额
        },
        {
            id: 3,
            name: "l_platinum", // 视频数量
            condition: 50, // 关卡条件
            reward: 300, // 奖励金额
        },
        {
            id: 4,
            name: "l_diamond", // 视频数量
            condition: 80, // 关卡条件
            reward: 300, // 奖励金额
        },
        {
            id: 5,
            name: "l_master", // 视频数量
            condition: 150, // 关卡条件
            reward: 400, // 奖励金额
        },
        {
            id: 6,
            name: "l_king", // 视频数量
            condition: 250, // 关卡条件
            reward: 1000, // 奖励金额
        },
    ];
    public readonly LevelWithdrawRewardInfo_br: LevelWithdrawRewardInfo[] = [
        {
            id: 0,
            name: "l_bronze", // 名称
            condition: 5, // 关卡条件
            reward: 300, // 奖励金额
        },
        {
            id: 1,
            name: "l_silver", // 视频数量
            condition: 15, // 关卡条件
            reward: 300, // 奖励金额
        },
        {
            id: 2,
            name: "l_gold", // 视频数量
            condition: 30, // 关卡条件
            reward: 300, // 奖励金额
        },
        {
            id: 3,
            name: "l_platinum", // 视频数量
            condition: 50, // 关卡条件
            reward: 300, // 奖励金额
        },
        {
            id: 4,
            name: "l_diamond", // 视频数量
            condition: 80, // 关卡条件
            reward: 300, // 奖励金额
        },
        {
            id: 5,
            name: "l_master", // 视频数量
            condition: 150, // 关卡条件
            reward: 400, // 奖励金额
        },
        {
            id: 6,
            name: "l_king", // 视频数量
            condition: 250, // 关卡条件
            reward: 1000, // 奖励金额
        },
    ];
    public readonly LevelWithdrawRewardInfo_id: LevelWithdrawRewardInfo[] = [
        {
            id: 0,
            name: "l_bronze", // 名称
            condition: 5, // 关卡条件
            reward: 15000, // 奖励金额
        },
        {
            id: 1,
            name: "l_silver", // 视频数量
            condition: 15, // 关卡条件
            reward: 15000, // 奖励金额
        },
        {
            id: 2,
            name: "l_gold", // 视频数量
            condition: 30, // 关卡条件
            reward: 15000, // 奖励金额
        },
        {
            id: 3,
            name: "l_platinum", // 视频数量
            condition: 50, // 关卡条件
            reward: 15000, // 奖励金额
        },
        {
            id: 4,
            name: "l_diamond", // 视频数量
            condition: 80, // 关卡条件
            reward: 15000, // 奖励金额
        },
        {
            id: 5,
            name: "l_master", // 视频数量
            condition: 150, // 关卡条件
            reward: 20000, // 奖励金额
        },
        {
            id: 6,
            name: "l_king", // 视频数量
            condition: 250, // 关卡条件
            reward: 50000, // 奖励金额
        },
    ];
    // 

}


