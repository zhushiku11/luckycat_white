
export const RES_NAME = "slots";
export const RES_PATH = { "slots": "/sub_game0/res" };

/**场景名称 */
export const SCENES_NAME = {
    /** 子游戏 主页面 */
    Main: 'sub_game0/scene/Main',
    /** 子游戏 游戏页面 */
    Game: 'sub_game0/scene/Game',
}

/**预加载资源 */
export const PRELOAD = {
    SPFRAME_FRAMES: {
        COMMON: {
            s0: "texture/symbols/s0/spriteFrame",
            s1: "texture/symbols/s1/spriteFrame",
            s2: "texture/symbols/s2/spriteFrame",
            s3: "texture/symbols/s3/spriteFrame",
            s4: "texture/symbols/s4/spriteFrame",
            s5: "texture/symbols/s5/spriteFrame",
            s6: "texture/symbols/s6/spriteFrame",
            s7: "texture/symbols/s7/spriteFrame",
            s8: "texture/symbols/s8/spriteFrame",

            s0_blur: "texture/symbols/s0_blur/spriteFrame",
            s1_blur: "texture/symbols/s1_blur/spriteFrame",
            s2_blur: "texture/symbols/s2_blur/spriteFrame",
            s3_blur: "texture/symbols/s3_blur/spriteFrame",
            s4_blur: "texture/symbols/s4_blur/spriteFrame",
            s5_blur: "texture/symbols/s5_blur/spriteFrame",
            s6_blur: "texture/symbols/s6_blur/spriteFrame",
            s7_blur: "texture/symbols/s7_blur/spriteFrame",
            s8_blur: "texture/symbols/s8_blur/spriteFrame",
            s999_blur: "texture/symbols/s999_blur/spriteFrame",
            s1000_blur: "texture/symbols/s1000_blur/spriteFrame",
        },
        ID: {
            reward_icon0: 'texture/common/reward_icon0_id/spriteFrame',
            reward_icon1: 'texture/common/reward_icon1_id/spriteFrame',
            reward_icon2: 'texture/common/reward_icon2_id/spriteFrame',
            reward_icon3: 'texture/common/reward_icon3_id/spriteFrame',
            reward_icon4: 'texture/common/reward_icon4_id/spriteFrame',
            reward_icon5: 'texture/common/reward_icon5_id/spriteFrame',
            tip_icon0: 'texture/common/tip_icon0_id/spriteFrame',
            tip_icon1: 'texture/common/tip_icon1_id/spriteFrame',
            tip_icon2: 'texture/common/tip_icon2_id/spriteFrame',
            tip_icon3: 'texture/common/tip_icon3_id/spriteFrame',
            tip_icon4: 'texture/common/tip_icon4_id/spriteFrame',
            tip_icon5: 'texture/common/tip_icon5_id/spriteFrame',
            taskIcon: 'texture/common/task_icon_id/spriteFrame',
        },
        BR: {
            reward_icon0: 'texture/common/reward_icon0_br/spriteFrame',
            reward_icon1: 'texture/common/reward_icon1_br/spriteFrame',
            reward_icon2: 'texture/common/reward_icon2_br/spriteFrame',
            reward_icon3: 'texture/common/reward_icon3_br/spriteFrame',
            reward_icon4: 'texture/common/reward_icon4_br/spriteFrame',
            reward_icon5: 'texture/common/reward_icon5_br/spriteFrame',
            tip_icon0: 'texture/common/tip_icon0_br/spriteFrame',
            tip_icon1: 'texture/common/tip_icon1_br/spriteFrame',
            tip_icon2: 'texture/common/tip_icon2_br/spriteFrame',
            tip_icon3: 'texture/common/tip_icon3_br/spriteFrame',
            tip_icon4: 'texture/common/tip_icon4_br/spriteFrame',
            tip_icon5: 'texture/common/tip_icon5_br/spriteFrame',
            taskIcon: 'texture/common/task_icon_br/spriteFrame',
        },
        US: {
            reward_icon0: 'texture/common/reward_icon0_us/spriteFrame',
            reward_icon1: 'texture/common/reward_icon1_us/spriteFrame',
            reward_icon2: 'texture/common/reward_icon2_us/spriteFrame',
            reward_icon3: 'texture/common/reward_icon3_us/spriteFrame',
            reward_icon4: 'texture/common/reward_icon4_us/spriteFrame',
            reward_icon5: 'texture/common/reward_icon5_us/spriteFrame',
            tip_icon0: 'texture/common/tip_icon0_us/spriteFrame',
            tip_icon1: 'texture/common/tip_icon1_us/spriteFrame',
            tip_icon2: 'texture/common/tip_icon2_us/spriteFrame',
            tip_icon3: 'texture/common/tip_icon3_us/spriteFrame',
            tip_icon4: 'texture/common/tip_icon4_us/spriteFrame',
            tip_icon5: 'texture/common/tip_icon5_us/spriteFrame',
            taskIcon: 'texture/common/task_icon_us/spriteFrame',
        },

        EN: {
            drawcard_title0: "texture/common/drawcard_title0_en/spriteFrame",
            drawcard_title1: "texture/common/drawcard_title1_en/spriteFrame",
            drawcard_title2: "texture/common/drawcard_title2_en/spriteFrame",
            drawcard_title0_big: "texture/common/drawcard_title0_en_big/spriteFrame",
            drawcard_title1_big: "texture/common/drawcard_title1_en_big/spriteFrame",
            drawcard_title2_big: "texture/common/drawcard_title2_en_big/spriteFrame",
        },

        PT: {
            drawcard_title0: "texture/common/drawcard_title0_pt/spriteFrame",
            drawcard_title1: "texture/common/drawcard_title1_pt/spriteFrame",
            drawcard_title2: "texture/common/drawcard_title2_pt/spriteFrame",
            drawcard_title0_big: "texture/common/drawcard_title0_pt_big/spriteFrame",
            drawcard_title1_big: "texture/common/drawcard_title1_pt_big/spriteFrame",
            drawcard_title2_big: "texture/common/drawcard_title2_pt_big/spriteFrame",
        },

    },
}

export const STORAGE = {
    CACHE_BALL: "CACHE_BALL",
    PROP0_COUNT: "PROP0_COUNT", // 道具1数量
    PROP1_COUNT: "PROP1_COUNT", // 道具2数量
    PROP2_COUNT: "PROP2_COUNT", // 道具3数量
    PROP3_COUNT: "PROP3_COUNT", // 道具4数量
    PROP0_CLAIM_COUNT: "PROP0_CLAIM_COUNT", // 道具1数量
    PROP1_CLAIM_COUNT: "PROP1_CLAIM_COUNT", // 道具2数量
    PROP2_CLAIM_COUNT: "PROP2_CLAIM_COUNT", // 道具3数量
    PROP3_CLAIM_COUNT: "PROP3_CLAIM_COUNT", // 道具4数量
    GUIDE_STEP: "GUIDE_STEP",
}

export const SUBGAME = {
    /**功能事件 */
    FUNC: {
        GAME_PAUSE: "GAME_PAUSE",
        GAME_RESUME: "GAME_RESUME",
        GAME_ADD_TIME: "GAME_ADD_TIME",
        RESTART_GAME: "RESTART_GAME",
        AUTO_DROP: "AUTO_DROP",
        OPEN_BALL_TOUCH: "OPEN_BALL_TOUCH",
        CLOSE_BALL_TOUCH: "CLOSE_BALL_TOUCH",
    },
    /**面板事件 */
    PANEL: {
    },
    /**弹窗事件 */
    POPUP: {
        A_COINS: "A_COINS",
        B_COINS: "B_COINS",
        MONEY: "MONEY",
        ENERGY: "ENERGY",
    },
    /**场景事件 */
    SCENE: {
        GAME: "GAME",
        MAIN: "MAIN",
    },
}

/**挑战模式关卡数 */
export const CHALLENGE_PASS = 999;
/**无尽模式关卡数 */
export const ENDLESS_PASS = 100;

export const MAX_BALL_TYPE = 10;

/**slot游戏条件上线 */
export const SLOT_CONDITION = 150;

/**动画时间 */
export const ANIM_TIME = {
    TILE_REMOVE: 0.3,
    TILE_RECREATE: 0.3,
    TILE_SHAKE: 0.1,
    MAP_MOVE: 0.3,
    MAP_REFRESH: 0.3,
}

const AUDIO_PATH_PRE: string = 'sound/';
export const AUDIOS = {
    bgm: `${AUDIO_PATH_PRE}bgm_mg`,
    getWin: `${AUDIO_PATH_PRE}FX-16`,
    win0: `${AUDIO_PATH_PRE}FX-17`,
    win1: `${AUDIO_PATH_PRE}FX-18`,
    win2: `${AUDIO_PATH_PRE}FX-19`,
    win3: `${AUDIO_PATH_PRE}FX-20`,
    win4: `${AUDIO_PATH_PRE}FX-21`,
    onlyJackpot: `${AUDIO_PATH_PRE}FX-28`,
    treasureShow: `${AUDIO_PATH_PRE}FX-5`,
    treasureClose: `${AUDIO_PATH_PRE}FX-30`,
    treasureWinShow: `${AUDIO_PATH_PRE}bgm_totalwin_main`,
    treasureWinShowEnd: `${AUDIO_PATH_PRE}bgm_totalwin_end`,
    treasureWinClose: `${AUDIO_PATH_PRE}FX-30`,
    startSpin: `${AUDIO_PATH_PRE}FX-27`,
    rolling: `${AUDIO_PATH_PRE}FX-24`,
    dropDown: `${AUDIO_PATH_PRE}FX-15`,
    rate3: `${AUDIO_PATH_PRE}FX-9`,
    rate4: `${AUDIO_PATH_PRE}FX-10`,
    rate5: `${AUDIO_PATH_PRE}FX-11`,
    // rolling: `${AUDIO_PATH_PRE}FX-12`,
    // rolling: `${AUDIO_PATH_PRE}FX-13`,
    drawcardItem: `${AUDIO_PATH_PRE}FX-29`,
    reward: `${AUDIO_PATH_PRE}bgm_bigwin_main`,
    rewardEnd: `${AUDIO_PATH_PRE}bgm_bigwin_end`,
};