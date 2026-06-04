/**场景名称 */
export const SCENES_NAME = {
    /** 加载页面 */
    Loading: 'scene/Loading',
    /** 大厅页面 */
    Main: 'scene/Main',
    /** Merge 游戏页面 */
    SubGame_0: 'sub_game0/scene/Loading',
}

/**预加载资源 */
export const PRELOAD = {
    /**预加载SpriteFrame */
    SPFRAME_FRAMES: {
        COMMON: {},
        ID: {
            amoney: "texture/common/am_id/spriteFrame",
            amoneyL: "texture/common/amL_id/spriteFrame",
            bmoney: "texture/common/bm_id/spriteFrame",
            bmoneyL: "texture/common/bmL_id/spriteFrame",
            bmoneyUp: "texture/common/bm_up_id/spriteFrame",
            giftIcon: 'texture/common/gift_id/spriteFrame',
        },
        BR: {
            amoney: "texture/common/am_br/spriteFrame",
            amoneyL: "texture/common/amL_br/spriteFrame",
            amoneyBig: "texture/common/am_br_big/spriteFrame",
            bmoney: "texture/common/bm_br/spriteFrame",
            bmoneyL: "texture/common/bmL_br/spriteFrame",
            bmoneyUp: "texture/common/bm_up_br/spriteFrame",
            giftIcon: 'texture/common/gift_br/spriteFrame',
        },
        US: {
            amoney: "texture/common/am_us/spriteFrame",
            amoneyL: "texture/common/amL_us/spriteFrame",
            amoneyBig: "texture/common/am_us_big/spriteFrame",
            bmoney: "texture/common/bm_us/spriteFrame",
            bmoneyL: "texture/common/bmL_us/spriteFrame",
            bmoneyUp: "texture/common/bm_up_us/spriteFrame",
            giftIcon: 'texture/common/gift_us/spriteFrame',
        },
    },
    /**预加载Prefabs */
    PREFABS: {}
}

export const STORAGE = {
    SHOW_AD_COUNT: "SHOW_AD_COUNT",
    NEW_FLAG: "NEW_FLAG",
    USER_ID: "USER_ID",
    ONLINE_DATE: "ONLINE_DATE", // 上线日期
    DAILY_GAME_DATA: "DAILY_GAME_DATA", // 每日游戏数据
    TOTAL_AD_COUNT: "TOTAL_AD_COUNT", // 累计视频数量
    AMONEY_TIME: "AMONEY_TIME", // 上线日期
}

export const MAIN = {
    /**功能事件 */
    FUNC: {
        MOBILE_BACK: "MOBILE_BACK",
    },
    /**弹窗事件 */
    POPUP: {
        A_MONEY: "A_MONEY",
        B_MONEY: "B_MONEY",
        C_MONEY: "C_MONEY",
    },
    /**场景事件 */
    SCENE: {
        TO_GAME: "TO_GAME",
    }
}

export const PACKAGE_NAME = "com.luckycatspin.mania.game";

const AUDIO_PATH_PRE: string = 'sound/';
export const AUDIOS = {
    reward: `${AUDIO_PATH_PRE}reward`,
}