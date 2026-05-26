import { Game, game, ResolutionPolicy, screen, view } from "cc";
import { EDITOR } from "cc/env";
import { Language } from "./doge/framework/language/Language";

export const Variables = {}

const variablesConfig = () => {
    for (const key in Variables) {
        Language.defVariable(key, Variables[key]);
    }
}

if (!EDITOR) {
    let resolutionPolicy = -99999;
    let resolutionW = 750;
    let resolutionH = 1334;
    const resetResolutionSize = () => {
        console.log("on ResetResolutionSize", screen.windowSize.height / screen.windowSize.width);
        if (screen.windowSize.height / screen.windowSize.width >= resolutionH / resolutionW) {
            if (resolutionPolicy != ResolutionPolicy.FIXED_WIDTH) {
                resolutionPolicy = ResolutionPolicy.FIXED_WIDTH;
                view.setDesignResolutionSize(resolutionW, resolutionH, resolutionPolicy);
                console.log("on ResetResolutionPolicy", "ResolutionPolicy.FIXED_WIDTH");
            }
        } else {
            if (resolutionPolicy != ResolutionPolicy.SHOW_ALL) {
                resolutionPolicy = ResolutionPolicy.SHOW_ALL;
                view.setDesignResolutionSize(resolutionW, resolutionH, resolutionPolicy);
                console.log("on ResetResolutionPolicy", "ResolutionPolicy.SHOW_ALL");
            }
        }
    }
    game.on(Game.EVENT_GAME_INITED, () => {
        console.log("Game inited");
        variablesConfig();
        resetResolutionSize();
        screen.on('window-resize', resetResolutionSize);
    })
} else {
    variablesConfig();
}