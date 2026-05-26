import { NetworkSystem } from "./NetworkSystem";

export class ReportSystem {

    private static _instance = null;
    public static get I(): ReportSystem {
        if (!ReportSystem._instance) {
            ReportSystem._instance = new ReportSystem();
        }
        return ReportSystem._instance;
    }

    init() { }

    private report(eventName: string, eventExt: string, pageName: string) {
        NetworkSystem.report(eventName, eventExt, pageName)
        console.log(eventName, eventExt, pageName);
    }

    classic_click() {
        this.report("classic_click", "", "home");
    }
    challenge_click() {
        this.report("challenge_click", "", "home");
    }
    endlless_click() {
        this.report("endlless_click", "", "home");
    }
    checkin_click() {
        this.report("checkin_click", "", "home");
    }
    task_click() {
        this.report("task_click", "", "home");
    }
    treasurebox_click() {
        this.report("treasurebox_click", "", "endless");
    }
    message_click() {
        this.report("message_click", "", "endless");
    }
    classic_ranking_click() {
        this.report("classic_ranking_click", "", "home");
    }
    challenge_ranking_click() {
        this.report("challenge_ranking_click", "", "home");
    }
    endlless_ranking_click() {
        this.report("endlless_ranking_click", "", "home");
    }
    withdraw_click_home() {
        this.report("classic_click", "", "home");
    }
    withdraw_click_endless() {
        this.report("classic_click", "", "endless");
    }
}