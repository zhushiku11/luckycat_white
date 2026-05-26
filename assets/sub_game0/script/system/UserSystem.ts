import { AMoney, BMoney } from "db://assets/doge/framework/common/Currency";
import { CurrencyType, Language } from "db://assets/doge/framework/language/Language";
import { Utils } from "db://assets/doge/framework/common/Utils";
import FloatCalc from "db://assets/doge/framework/common/FloatCalc";
import { AD_RESULT, AD_TYPE, NI, REWARD_TYPE } from "db://assets/native_interface/NI";
import { Panel } from "db://assets/doge/framework/panel/Panel";
import { MAIN } from "db://assets/main/constant/Constant";
import { PlayerSystem } from "db://assets/main/script/system/PlayerSystem";
import { NetworkResult, NetworkSystem } from "./NetworkSystem";
import { StorageBox } from "db://assets/doge/framework/common/StorageBox";
import { SLOT_CONDITION, SUBGAME } from "../../constant/Constant";
import { getEventEmiter } from "db://assets/doge/framework/common/EventEmitter";
import { WithdrawSystem } from "./WithdrawSystem";
import { PanelCreator } from "../component/creator/PanelCreator";
import { ADInfoSystem } from "./ADInfoSystem";

export class UserSystem {

    private static _instance = null;
    public static get I(): UserSystem {
        if (!UserSystem._instance) {
            UserSystem._instance = new UserSystem();
        }
        return UserSystem._instance;
    }

    private vo: UserSystemVo = new UserSystemVo();

    init(amoney: number, rate: number) {
        this.vo.isWithdrawAMoney = amoney <= 0;
        this.vo.rate = rate;
    }

    // 现金奖励
    getCashReward1(): number {
        let money = AMoney.value();
        let cashRewards: AMoneyReward[] = null;
        let cashRate: number = 0;
        switch (Language.currency) {
            case CurrencyType.US:
                cashRewards = this.vo.cashReward1_us;
                cashRate = 100;
                break;
            case CurrencyType.BR:
                cashRewards = this.vo.cashReward1_br;
                cashRate = 100;
                break;
            case CurrencyType.ID:
                cashRewards = this.vo.cashReward1_id;
                cashRate = 1;
                break;
        }
        let cashReward: AMoneyReward = cashRewards.find((value: AMoneyReward) => {
            return money >= value.lowerLimit && money < value.upperLimit;
        })
        return Utils.randomInt(cashReward.rewardLowerLimit * cashRate, cashReward.rewardUpperLimit * cashRate) / cashRate;
    }

    getCashReward2() {
        let money = AMoney.value();
        let cashRewards: AMoneyReward[] = null;
        let cashRate: number = 0;
        switch (Language.currency) {
            case CurrencyType.US:
                cashRewards = this.vo.cashReward2_us;
                cashRate = 100;
                break;
            case CurrencyType.BR:
                cashRewards = this.vo.cashReward2_br;
                cashRate = 100;
                break;
            case CurrencyType.ID:
                cashRewards = this.vo.cashReward2_id;
                cashRate = 1;
                break;
        }

        let cashReward: AMoneyReward = cashRewards.find((value: AMoneyReward) => {
            return money >= value.lowerLimit && money < value.upperLimit;
        })
        return Utils.randomInt(cashReward.rewardLowerLimit * cashRate, cashReward.rewardUpperLimit * cashRate) / cashRate;
    }

    // 奖励结算
    getAdReward(adType: AD_TYPE, rewardType: REWARD_TYPE, reward: number, endCb?: (isErr: boolean, rewardA: number, rewardB: number) => void) {
        let rewardA = 0;
        let taskId = 0;
        let isDelayReward = false;
        if (rewardType == REWARD_TYPE.TASK) {
            taskId = reward;
        } else {
            rewardA = reward;
        }
        if (rewardType == REWARD_TYPE.DELAY_REWARD) {
            rewardType = REWARD_TYPE.REWARD;
            isDelayReward = true;
        }
        let func = (resultCode: AD_RESULT, adType: AD_TYPE, result: { rewardB: number, currentB: number, currentB1: number, rate: number }) => {
            getEventEmiter().emit(SUBGAME.FUNC.GAME_RESUME);
            switch (resultCode) {
                case AD_RESULT.SUCCESS:
                case AD_RESULT.CANCEL:
                    console.log("AD Reward ", REWARD_TYPE[rewardType], AD_TYPE[adType], rewardA, result.rewardB);
                    console.log("Current ", result.currentB, result.currentB1);
                    // A奖励
                    if (rewardA > 0) {
                        // 成功有奖励 更新货币
                        AMoney.add(rewardA);
                    }
                    // B奖励
                    if (result.rewardB > 0) {
                        // 成功有奖励 更新货币
                        BMoney.set(result.currentB, result.currentB1);
                    }
                    if (rewardType == REWARD_TYPE.TASK) {
                        result.rewardB = 0;
                    }
                    WithdrawSystem.I.addAdCount();
                    // 奖励提升比率
                    this.updateRewardRate(WithdrawSystem.I.getAdCount());
                    // 恭喜弹窗
                    if (!isDelayReward) {
                        // if (rewardA > 0 || result.rewardB > 0) {
                        //     UserSystem.I.congratulationsMoney(rewardA, result.rewardB);
                        // }
                    }
                    ADInfoSystem.I.addTotalAdCount();
                    endCb && endCb(false, rewardA, result.rewardB);
                    break;
                case AD_RESULT.FAIL:
                    // 接口调用失败
                    console.log("error:", Language.getWord("l_adErrText"));
                    // Toast.show(Language.getWord("adErrText"))
                    endCb && endCb(true, 0, 0);
                    break;
            }
        }
        getEventEmiter().emit(SUBGAME.FUNC.GAME_PAUSE);
        NI.playAd(func, adType, rewardType, taskId);
        if (adType == AD_TYPE.VIDEO) {
            ADInfoSystem.I.skipAdTimesClear();
        }
    }

    // 恭喜弹窗
    congratulationsMoney(rewardA: number, rewardB: number, rewardC: number = 0) {
        if (rewardA > 0 || rewardB > 0 || rewardC > 0) {
            // 恭喜弹窗
            PanelCreator.congratulations(rewardA, rewardB, rewardC, 0);
        }
    }

    // 金币 恭喜弹窗
    congratulationsCoins(acoins: number) {
        if (acoins > 0) {
            // 恭喜弹窗
            PanelCreator.congratulations(0, 0, 0, acoins);
        }
    }

    // 新手奖励结算
    getNewUserReward(endCb: (rewardA: number, rewardB: number) => void) {
        // 新手奖励
        let rewardA = 0;
        let rewardB = 0;
        if (PlayerSystem.I.isNewUser()) {
            NetworkSystem.newUserReward().then((result: NetworkResult) => {
                console.log(result);
                if (!result.error) {
                    // 现金
                    switch (Language.currency) {
                        case CurrencyType.US:
                            rewardA = result.data.SbmAcg.SbmRnw;
                            break;
                        case CurrencyType.BR:
                            // 现金
                            rewardA = result.data.SbmAcg.SbmRnw;
                            break;
                        case CurrencyType.ID:
                            rewardA = result.data.SbmAcg.SbmRnw;
                            break;
                    }
                    this.vo.isWithdrawAMoney = false;
                }
                endCb && endCb(rewardA, rewardB);
            })
        } else {
            setTimeout(() => {
                endCb && endCb(rewardA, rewardB);
            }, 500);
        }
    }

    isAMoneyWithdrawed() {
        return this.vo.isWithdrawAMoney;
    }

    amoneyWithdrawed() {
        this.vo.isWithdrawAMoney = true;
    }

    // 设置奖励提升比率
    updateRewardRate(adCount: number) {
        console.log(adCount, "adCount");
        let info = WithdrawSystem.I.getRewardRateInfo();
        if (adCount >= info.sm_three) {
            this.vo.rate = info.sm_three_rate / 100;
        } else if (adCount >= info.sm_two) {
            this.vo.rate = info.sm_two_rate / 100;
        } else if (adCount >= info.sm_one) {
            this.vo.rate = info.sm_one_rate / 100;
        } else {
            this.vo.rate = 0;
        }
    }

    getRate() {
        return this.vo.rate;
    }
}


type AMoneyReward = {
    lowerLimit: number,
    upperLimit: number,
    rewardLowerLimit: number,
    rewardUpperLimit: number,
}

export class UserSystemVo {
    // 普通奖励 条件
    public readonly normalCondition: number[] = [4];
    // 小奖励 条件
    public readonly samllRewardCondition: number = 2;
    // public readonly normalCondition: number[] = [1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 7];
    // Slots游戏 条件
    public readonly slotsCondition: number[] = [150];
    // 关卡SmallClaim 条件
    public readonly noClaimCondition: number = 3;
    // 现金奖励配置1
    public readonly cashReward1_us: AMoneyReward[] = [
        {
            lowerLimit: 0,
            upperLimit: 365,
            rewardLowerLimit: 9,
            rewardUpperLimit: 13,
        },
        {
            lowerLimit: 365,
            upperLimit: 450,
            rewardLowerLimit: 8,
            rewardUpperLimit: 12,
        },
        {
            lowerLimit: 450,
            upperLimit: 545,
            rewardLowerLimit: 7,
            rewardUpperLimit: 10,
        },
        {
            lowerLimit: 545,
            upperLimit: 590,
            rewardLowerLimit: 5,
            rewardUpperLimit: 7,
        },
        {
            lowerLimit: 590,
            upperLimit: 636,
            rewardLowerLimit: 4,
            rewardUpperLimit: 6,
        },
        {
            lowerLimit: 636,
            upperLimit: 681,
            rewardLowerLimit: 3,
            rewardUpperLimit: 4,
        },
        {
            lowerLimit: 681,
            upperLimit: 727,
            rewardLowerLimit: 2,
            rewardUpperLimit: 3,
        },
        {
            lowerLimit: 727,
            upperLimit: 736,
            rewardLowerLimit: 1,
            rewardUpperLimit: 2,
        },
        {
            lowerLimit: 736,
            upperLimit: 745,
            rewardLowerLimit: 0.7,
            rewardUpperLimit: 1,
        },
        {
            lowerLimit: 745,
            upperLimit: 754,
            rewardLowerLimit: 0.55,
            rewardUpperLimit: 0.7,
        },
        {
            lowerLimit: 754,
            upperLimit: 763,
            rewardLowerLimit: 0.36,
            rewardUpperLimit: 0.55,
        },
        {
            lowerLimit: 763,
            upperLimit: 772,
            rewardLowerLimit: 0.18,
            rewardUpperLimit: 0.36,
        },
        {
            lowerLimit: 772,
            upperLimit: 781,
            rewardLowerLimit: 0.09,
            rewardUpperLimit: 0.18,
        },
        {
            lowerLimit: 781,
            upperLimit: 790,
            rewardLowerLimit: 0.05,
            rewardUpperLimit: 0.09,
        },
        {
            lowerLimit: 790,
            upperLimit: 795,
            rewardLowerLimit: 0.04,
            rewardUpperLimit: 0.05,
        },
        {
            lowerLimit: 795,
            upperLimit: 796,
            rewardLowerLimit: 0.03,
            rewardUpperLimit: 0.03,
        },
        {
            lowerLimit: 796,
            upperLimit: 797,
            rewardLowerLimit: 0.02,
            rewardUpperLimit: 0.03,
        },
        {
            lowerLimit: 797,
            upperLimit: 798,
            rewardLowerLimit: 0.02,
            rewardUpperLimit: 0.02,
        },
        {
            lowerLimit: 798,
            upperLimit: 799,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.02,
        },
        {
            lowerLimit: 799,
            upperLimit: 800,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.01,
        },
        {
            lowerLimit: 800,
            upperLimit: 9999999,
            rewardLowerLimit: 9.0,
            rewardUpperLimit: 13.0,
        },
    ];
    public readonly cashReward1_br: AMoneyReward[] = [
        {
            lowerLimit: 0,
            upperLimit: 365,
            rewardLowerLimit: 9,
            rewardUpperLimit: 13,
        },
        {
            lowerLimit: 365,
            upperLimit: 450,
            rewardLowerLimit: 8,
            rewardUpperLimit: 12,
        },
        {
            lowerLimit: 450,
            upperLimit: 545,
            rewardLowerLimit: 7,
            rewardUpperLimit: 10,
        },
        {
            lowerLimit: 545,
            upperLimit: 590,
            rewardLowerLimit: 5,
            rewardUpperLimit: 7,
        },
        {
            lowerLimit: 590,
            upperLimit: 636,
            rewardLowerLimit: 4,
            rewardUpperLimit: 6,
        },
        {
            lowerLimit: 636,
            upperLimit: 681,
            rewardLowerLimit: 3,
            rewardUpperLimit: 4,
        },
        {
            lowerLimit: 681,
            upperLimit: 727,
            rewardLowerLimit: 2,
            rewardUpperLimit: 3,
        },
        {
            lowerLimit: 727,
            upperLimit: 736,
            rewardLowerLimit: 1,
            rewardUpperLimit: 2,
        },
        {
            lowerLimit: 736,
            upperLimit: 745,
            rewardLowerLimit: 0.7,
            rewardUpperLimit: 1,
        },
        {
            lowerLimit: 745,
            upperLimit: 754,
            rewardLowerLimit: 0.55,
            rewardUpperLimit: 0.7,
        },
        {
            lowerLimit: 754,
            upperLimit: 763,
            rewardLowerLimit: 0.36,
            rewardUpperLimit: 0.55,
        },
        {
            lowerLimit: 763,
            upperLimit: 772,
            rewardLowerLimit: 0.18,
            rewardUpperLimit: 0.36,
        },
        {
            lowerLimit: 772,
            upperLimit: 781,
            rewardLowerLimit: 0.09,
            rewardUpperLimit: 0.18,
        },
        {
            lowerLimit: 781,
            upperLimit: 790,
            rewardLowerLimit: 0.05,
            rewardUpperLimit: 0.09,
        },
        {
            lowerLimit: 790,
            upperLimit: 795,
            rewardLowerLimit: 0.04,
            rewardUpperLimit: 0.05,
        },
        {
            lowerLimit: 795,
            upperLimit: 796,
            rewardLowerLimit: 0.03,
            rewardUpperLimit: 0.03,
        },
        {
            lowerLimit: 796,
            upperLimit: 797,
            rewardLowerLimit: 0.02,
            rewardUpperLimit: 0.03,
        },
        {
            lowerLimit: 797,
            upperLimit: 798,
            rewardLowerLimit: 0.02,
            rewardUpperLimit: 0.02,
        },
        {
            lowerLimit: 798,
            upperLimit: 799,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.02,
        },
        {
            lowerLimit: 799,
            upperLimit: 800,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.01,
        },
        {
            lowerLimit: 800,
            upperLimit: 9999999,
            rewardLowerLimit: 9.0,
            rewardUpperLimit: 13.0,
        },
    ];
    public readonly cashReward1_id: AMoneyReward[] = [
        {
            lowerLimit: 0,
            upperLimit: 40000,
            rewardLowerLimit: 1000,
            rewardUpperLimit: 1500,
        },
        {
            lowerLimit: 40000,
            upperLimit: 50000,
            rewardLowerLimit: 900,
            rewardUpperLimit: 1400,
        },
        {
            lowerLimit: 50000,
            upperLimit: 60000,
            rewardLowerLimit: 800,
            rewardUpperLimit: 1200,
        },
        {
            lowerLimit: 60000,
            upperLimit: 65000,
            rewardLowerLimit: 600,
            rewardUpperLimit: 800,
        },
        {
            lowerLimit: 65000,
            upperLimit: 70000,
            rewardLowerLimit: 500,
            rewardUpperLimit: 700,
        },
        {
            lowerLimit: 70000,
            upperLimit: 75000,
            rewardLowerLimit: 400,
            rewardUpperLimit: 500,
        },
        {
            lowerLimit: 75000,
            upperLimit: 80000,
            rewardLowerLimit: 250,
            rewardUpperLimit: 350,
        },
        {
            lowerLimit: 80000,
            upperLimit: 81000,
            rewardLowerLimit: 100,
            rewardUpperLimit: 200,
        },
        {
            lowerLimit: 81000,
            upperLimit: 82000,
            rewardLowerLimit: 80,
            rewardUpperLimit: 120,
        },
        {
            lowerLimit: 82000,
            upperLimit: 83000,
            rewardLowerLimit: 60,
            rewardUpperLimit: 80,
        },
        {
            lowerLimit: 83000,
            upperLimit: 84000,
            rewardLowerLimit: 40,
            rewardUpperLimit: 60,
        },
        {
            lowerLimit: 84000,
            upperLimit: 85000,
            rewardLowerLimit: 20,
            rewardUpperLimit: 40,
        },
        {
            lowerLimit: 85000,
            upperLimit: 86000,
            rewardLowerLimit: 10,
            rewardUpperLimit: 20,
        },
        {
            lowerLimit: 86000,
            upperLimit: 87000,
            rewardLowerLimit: 5,
            rewardUpperLimit: 10,
        },
        {
            lowerLimit: 87000,
            upperLimit: 87500,
            rewardLowerLimit: 4,
            rewardUpperLimit: 5,
        },
        {
            lowerLimit: 87500,
            upperLimit: 87600,
            rewardLowerLimit: 3,
            rewardUpperLimit: 3,
        },
        {
            lowerLimit: 87600,
            upperLimit: 87700,
            rewardLowerLimit: 2,
            rewardUpperLimit: 3,
        },
        {
            lowerLimit: 87700,
            upperLimit: 87800,
            rewardLowerLimit: 2,
            rewardUpperLimit: 2,
        },
        {
            lowerLimit: 87800,
            upperLimit: 87900,
            rewardLowerLimit: 1,
            rewardUpperLimit: 2,
        },
        {
            lowerLimit: 87900,
            upperLimit: 88000,
            rewardLowerLimit: 1,
            rewardUpperLimit: 1,
        },
        {
            lowerLimit: 88000,
            upperLimit: 9999999999,
            rewardLowerLimit: 1000,
            rewardUpperLimit: 1500,
        },
    ];
    // 现金奖励配置1
    public readonly cashReward2_us: AMoneyReward[] = [
        {
            lowerLimit: 0,
            upperLimit: 365,
            rewardLowerLimit: 0.9,
            rewardUpperLimit: 1,
        },
        {
            lowerLimit: 365,
            upperLimit: 450,
            rewardLowerLimit: 0.8,
            rewardUpperLimit: 1.2,
        },
        {
            lowerLimit: 450,
            upperLimit: 545,
            rewardLowerLimit: 0.7,
            rewardUpperLimit: 1,
        },
        {
            lowerLimit: 545,
            upperLimit: 590,
            rewardLowerLimit: 0.5,
            rewardUpperLimit: 0.7,
        },
        {
            lowerLimit: 590,
            upperLimit: 636,
            rewardLowerLimit: 0.4,
            rewardUpperLimit: 0.6,
        },
        {
            lowerLimit: 636,
            upperLimit: 681,
            rewardLowerLimit: 0.3,
            rewardUpperLimit: 0.4,
        },
        {
            lowerLimit: 681,
            upperLimit: 727,
            rewardLowerLimit: 0.2,
            rewardUpperLimit: 0.3,
        },
        {
            lowerLimit: 727,
            upperLimit: 736,
            rewardLowerLimit: 0.1,
            rewardUpperLimit: 0.2,
        },
        {
            lowerLimit: 736,
            upperLimit: 745,
            rewardLowerLimit: 0.07,
            rewardUpperLimit: 0.1,
        },
        {
            lowerLimit: 745,
            upperLimit: 754,
            rewardLowerLimit: 0.05,
            rewardUpperLimit: 0.07,
        },
        {
            lowerLimit: 754,
            upperLimit: 763,
            rewardLowerLimit: 0.03,
            rewardUpperLimit: 0.05,
        },
        {
            lowerLimit: 763,
            upperLimit: 772,
            rewardLowerLimit: 0.2,
            rewardUpperLimit: 0.3,
        },
        {
            lowerLimit: 772,
            upperLimit: 781,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.01,
        },
        {
            lowerLimit: 781,
            upperLimit: 790,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.01,
        },
        {
            lowerLimit: 790,
            upperLimit: 795,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.01,
        },
        {
            lowerLimit: 795,
            upperLimit: 796,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.01,
        },
        {
            lowerLimit: 796,
            upperLimit: 797,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.01,
        },
        {
            lowerLimit: 797,
            upperLimit: 798,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.01,
        },
        {
            lowerLimit: 798,
            upperLimit: 799,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.01,
        },
        {
            lowerLimit: 799,
            upperLimit: 800,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.01,
        },
        {
            lowerLimit: 800,
            upperLimit: 9999999,
            rewardLowerLimit: 0.9,
            rewardUpperLimit: 1.3,
        }
    ];
    public readonly cashReward2_br: AMoneyReward[] = [
        {
            lowerLimit: 0,
            upperLimit: 365,
            rewardLowerLimit: 0.9,
            rewardUpperLimit: 1,
        },
        {
            lowerLimit: 365,
            upperLimit: 450,
            rewardLowerLimit: 0.8,
            rewardUpperLimit: 1.2,
        },
        {
            lowerLimit: 450,
            upperLimit: 545,
            rewardLowerLimit: 0.7,
            rewardUpperLimit: 1,
        },
        {
            lowerLimit: 545,
            upperLimit: 590,
            rewardLowerLimit: 0.5,
            rewardUpperLimit: 0.7,
        },
        {
            lowerLimit: 590,
            upperLimit: 636,
            rewardLowerLimit: 0.4,
            rewardUpperLimit: 0.6,
        },
        {
            lowerLimit: 636,
            upperLimit: 681,
            rewardLowerLimit: 0.3,
            rewardUpperLimit: 0.4,
        },
        {
            lowerLimit: 681,
            upperLimit: 727,
            rewardLowerLimit: 0.2,
            rewardUpperLimit: 0.3,
        },
        {
            lowerLimit: 727,
            upperLimit: 736,
            rewardLowerLimit: 0.1,
            rewardUpperLimit: 0.2,
        },
        {
            lowerLimit: 736,
            upperLimit: 745,
            rewardLowerLimit: 0.07,
            rewardUpperLimit: 0.1,
        },
        {
            lowerLimit: 745,
            upperLimit: 754,
            rewardLowerLimit: 0.05,
            rewardUpperLimit: 0.07,
        },
        {
            lowerLimit: 754,
            upperLimit: 763,
            rewardLowerLimit: 0.03,
            rewardUpperLimit: 0.05,
        },
        {
            lowerLimit: 763,
            upperLimit: 772,
            rewardLowerLimit: 0.2,
            rewardUpperLimit: 0.3,
        },
        {
            lowerLimit: 772,
            upperLimit: 781,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.01,
        },
        {
            lowerLimit: 781,
            upperLimit: 790,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.01,
        },
        {
            lowerLimit: 790,
            upperLimit: 795,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.01,
        },
        {
            lowerLimit: 795,
            upperLimit: 796,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.01,
        },
        {
            lowerLimit: 796,
            upperLimit: 797,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.01,
        },
        {
            lowerLimit: 797,
            upperLimit: 798,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.01,
        },
        {
            lowerLimit: 798,
            upperLimit: 799,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.01,
        },
        {
            lowerLimit: 799,
            upperLimit: 800,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.01,
        },
        {
            lowerLimit: 800,
            upperLimit: 9999999,
            rewardLowerLimit: 0.9,
            rewardUpperLimit: 1.3,
        }
    ];
    public readonly cashReward2_id: AMoneyReward[] = [
        {
            lowerLimit: 0,
            upperLimit: 40000,
            rewardLowerLimit: 100,
            rewardUpperLimit: 150,
        },
        {
            lowerLimit: 40000,
            upperLimit: 50000,
            rewardLowerLimit: 90,
            rewardUpperLimit: 140,
        },
        {
            lowerLimit: 50000,
            upperLimit: 60000,
            rewardLowerLimit: 80,
            rewardUpperLimit: 120,
        },
        {
            lowerLimit: 60000,
            upperLimit: 65000,
            rewardLowerLimit: 60,
            rewardUpperLimit: 80,
        },
        {
            lowerLimit: 65000,
            upperLimit: 70000,
            rewardLowerLimit: 50,
            rewardUpperLimit: 70,
        },
        {
            lowerLimit: 70000,
            upperLimit: 75000,
            rewardLowerLimit: 40,
            rewardUpperLimit: 50,
        },
        {
            lowerLimit: 75000,
            upperLimit: 80000,
            rewardLowerLimit: 25,
            rewardUpperLimit: 35,
        },
        {
            lowerLimit: 80000,
            upperLimit: 81000,
            rewardLowerLimit: 10,
            rewardUpperLimit: 20,
        },
        {
            lowerLimit: 81000,
            upperLimit: 82000,
            rewardLowerLimit: 8,
            rewardUpperLimit: 12,
        },
        {
            lowerLimit: 82000,
            upperLimit: 83000,
            rewardLowerLimit: 6,
            rewardUpperLimit: 8,
        },
        {
            lowerLimit: 83000,
            upperLimit: 84000,
            rewardLowerLimit: 4,
            rewardUpperLimit: 6,
        },
        {
            lowerLimit: 84000,
            upperLimit: 85000,
            rewardLowerLimit: 2,
            rewardUpperLimit: 4,
        },
        {
            lowerLimit: 85000,
            upperLimit: 86000,
            rewardLowerLimit: 2,
            rewardUpperLimit: 2,
        },
        {
            lowerLimit: 86000,
            upperLimit: 87000,
            rewardLowerLimit: 1,
            rewardUpperLimit: 2,
        },
        {
            lowerLimit: 87000,
            upperLimit: 87500,
            rewardLowerLimit: 1,
            rewardUpperLimit: 1,
        },
        {
            lowerLimit: 87500,
            upperLimit: 87600,
            rewardLowerLimit: 1,
            rewardUpperLimit: 1,
        },
        {
            lowerLimit: 87600,
            upperLimit: 87700,
            rewardLowerLimit: 1,
            rewardUpperLimit: 1,
        },
        {
            lowerLimit: 87700,
            upperLimit: 87800,
            rewardLowerLimit: 1,
            rewardUpperLimit: 1,
        },
        {
            lowerLimit: 87800,
            upperLimit: 87900,
            rewardLowerLimit: 1,
            rewardUpperLimit: 1,
        },
        {
            lowerLimit: 87900,
            upperLimit: 88000,
            rewardLowerLimit: 1,
            rewardUpperLimit: 1,
        },
        {
            lowerLimit: 88000,
            upperLimit: 9999999999,
            rewardLowerLimit: 100,
            rewardUpperLimit: 150,
        },
    ];

    // 现金是否提现
    private _isWithdrawAMoney: boolean = false;
    public get isWithdrawAMoney(): boolean {
        return this._isWithdrawAMoney;
    }
    public set isWithdrawAMoney(value: boolean) {
        this._isWithdrawAMoney = value;
    }

    // 奖励提升比率
    private _rate: number = 0;
    public get rate(): number {
        return this._rate;
    }
    public set rate(value: number) {
        this._rate = value;
        Language.updVariable("rate", FloatCalc.mul(this._rate, 100).toString());
    }
}

