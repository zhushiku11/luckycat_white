

export enum ForkFlag {
    A = "FORK_A",
    B = "FORK_B",
    C = "FORK_C",
}

export enum VersionEvent {
    SHOW = 1,
    TRIGGER = 2
}

export class ForkTools {

    private static flag: ForkFlag = ForkFlag.A;
    private static triggers: Map<string, Function[]> = new Map<string, Function[]>();

    public static init(flag: ForkFlag) {
        ForkTools.flag = flag;
    }

    public static exec(flag: ForkFlag, callback: Function) {
        if (flag == ForkTools.flag) {
            callback();
        }
    }

    public static trigger(flag: ForkFlag, callback: Function) {
        ForkTools.exec(flag, callback);
        let triggers = ForkTools.triggers.get(flag);
        if (!triggers) {
            triggers = [];
            ForkTools.triggers.set(flag, triggers);
        }
        triggers.push(callback);
    }

    public static switch(flag: ForkFlag) {
        ForkTools.flag = flag;
        let t1 = ForkTools.triggers.get(ForkTools.flag) || [];
        for (const func of t1) {
            func();
        }
    }
}


